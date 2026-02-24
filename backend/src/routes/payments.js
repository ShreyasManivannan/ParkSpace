import { Router } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Initialize Stripe (will be null if no key provided)
const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
    : null;

const createPaymentSchema = z.object({
    bookingId: z.string(),
});

// Create payment intent
router.post(
    '/create-intent',
    authenticate,
    async (req, res, next) => {
        try {
            const { bookingId } = createPaymentSchema.parse(req.body);

            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    space: true,
                },
            });

            if (!booking) {
                throw new AppError('Booking not found', 404);
            }

            if (booking.userId !== req.user.id) {
                throw new AppError('Not authorized', 403);
            }

            if (booking.status !== 'PENDING') {
                throw new AppError('Booking is not pending payment', 400);
            }

            // If Stripe is not configured, simulate payment
            if (!stripe) {
                // Update booking to confirmed (mock payment)
                const updatedBooking = await prisma.booking.update({
                    where: { id: bookingId },
                    data: {
                        status: 'CONFIRMED',
                        stripePaymentIntentId: `mock_${Date.now()}`,
                    },
                });

                // Notify via socket
                const io = req.app.get('io');
                io.to(`space-${booking.spaceId}`).emit('booking-confirmed', {
                    bookingId: updatedBooking.id,
                    spaceId: booking.spaceId,
                });

                return res.json({
                    success: true,
                    data: {
                        mock: true,
                        message: 'Payment simulated (Stripe not configured)',
                        booking: updatedBooking,
                    },
                });
            }

            // Create real Stripe payment intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(booking.totalAmount * 100), // Convert to cents
                currency: 'usd',
                metadata: {
                    bookingId: booking.id,
                    userId: req.user.id,
                    spaceId: booking.spaceId,
                },
            });

            // Update booking with payment intent ID
            await prisma.booking.update({
                where: { id: bookingId },
                data: { stripePaymentIntentId: paymentIntent.id },
            });

            res.json({
                success: true,
                data: {
                    clientSecret: paymentIntent.client_secret,
                    amount: booking.totalAmount,
                },
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return next(new AppError(error.errors[0].message, 400));
            }
            next(error);
        }
    }
);

// Stripe webhook handler
router.post(
    '/webhook',
    async (req, res, next) => {
        if (!stripe) {
            return res.json({ received: true, message: 'Stripe not configured' });
        }

        const sig = req.headers['stripe-signature'];

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error('Webhook signature verification failed');
            return res.status(400).send('Webhook Error');
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const bookingId = paymentIntent.metadata.bookingId;

                if (bookingId) {
                    await prisma.booking.update({
                        where: { id: bookingId },
                        data: { status: 'CONFIRMED' },
                    });

                    // Notify via socket
                    const booking = await prisma.booking.findUnique({
                        where: { id: bookingId },
                    });

                    if (booking) {
                        const io = req.app.get('io');
                        io.to(`space-${booking.spaceId}`).emit('booking-confirmed', {
                            bookingId: booking.id,
                            spaceId: booking.spaceId,
                        });
                    }
                }
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                const bookingId = paymentIntent.metadata.bookingId;

                if (bookingId) {
                    await prisma.booking.update({
                        where: { id: bookingId },
                        data: { status: 'CANCELLED' },
                    });
                }
                break;
            }
        }

        res.json({ received: true });
    }
);

export default router;
