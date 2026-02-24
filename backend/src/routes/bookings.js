import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const createBookingSchema = z.object({
    spaceId: z.string(),
    startTime: z.string().transform((s) => new Date(s)),
    endTime: z.string().transform((s) => new Date(s)),
});

// Create booking with transaction to prevent double-booking
router.post(
    '/',
    authenticate,
    async (req, res, next) => {
        try {
            const data = createBookingSchema.parse(req.body);

            // Validate times
            if (data.startTime >= data.endTime) {
                throw new AppError('End time must be after start time', 400);
            }

            if (data.startTime < new Date()) {
                throw new AppError('Cannot book in the past', 400);
            }

            // Use transaction to ensure atomicity
            const booking = await prisma.$transaction(async (tx) => {
                // Get space with lock (for update)
                const space = await tx.space.findUnique({
                    where: { id: data.spaceId },
                });

                if (!space) {
                    throw new AppError('Space not found', 404);
                }

                if (!space.isAvailable) {
                    throw new AppError('Space is not available', 400);
                }

                if (space.ownerId === req.user.id) {
                    throw new AppError('Cannot book your own space', 400);
                }

                // Check for overlapping bookings
                const overlapping = await tx.booking.findFirst({
                    where: {
                        spaceId: data.spaceId,
                        status: { in: ['PENDING', 'CONFIRMED'] },
                        OR: [
                            {
                                AND: [
                                    { startTime: { lte: data.startTime } },
                                    { endTime: { gt: data.startTime } },
                                ],
                            },
                            {
                                AND: [
                                    { startTime: { lt: data.endTime } },
                                    { endTime: { gte: data.endTime } },
                                ],
                            },
                            {
                                AND: [
                                    { startTime: { gte: data.startTime } },
                                    { endTime: { lte: data.endTime } },
                                ],
                            },
                        ],
                    },
                });

                if (overlapping) {
                    throw new AppError('Time slot is already booked', 409);
                }

                // Calculate total amount
                const hours =
                    (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60 * 60);
                const totalAmount = parseFloat((hours * space.pricePerHour).toFixed(2));

                // Create booking
                const newBooking = await tx.booking.create({
                    data: {
                        userId: req.user.id,
                        spaceId: data.spaceId,
                        startTime: data.startTime,
                        endTime: data.endTime,
                        totalAmount,
                        status: 'PENDING',
                    },
                    include: {
                        space: {
                            select: {
                                id: true,
                                title: true,
                                address: true,
                                pricePerHour: true,
                            },
                        },
                    },
                });

                return newBooking;
            });

            // Notify about new booking
            const io = req.app.get('io');
            io.to(`space-${booking.spaceId}`).emit('booking-created', {
                spaceId: booking.spaceId,
                startTime: booking.startTime,
                endTime: booking.endTime,
            });

            res.status(201).json({
                success: true,
                data: booking,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return next(new AppError(error.errors[0].message, 400));
            }
            next(error);
        }
    }
);

// Get user's bookings
router.get(
    '/my-bookings',
    authenticate,
    async (req, res, next) => {
        try {
            const bookings = await prisma.booking.findMany({
                where: { userId: req.user.id },
                include: {
                    space: {
                        select: {
                            id: true,
                            title: true,
                            address: true,
                            imageUrl: true,
                            pricePerHour: true,
                            owner: {
                                select: { id: true, name: true },
                            },
                        },
                    },
                },
                orderBy: { startTime: 'desc' },
            });

            res.json({
                success: true,
                data: bookings,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Get single booking
router.get(
    '/:id',
    authenticate,
    async (req, res, next) => {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: req.params.id },
                include: {
                    space: {
                        include: {
                            owner: {
                                select: { id: true, name: true, email: true },
                            },
                        },
                    },
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
            });

            if (!booking) {
                throw new AppError('Booking not found', 404);
            }

            // Only allow owner of booking or space owner to view
            if (
                booking.userId !== req.user.id &&
                booking.space.ownerId !== req.user.id
            ) {
                throw new AppError('Not authorized to view this booking', 403);
            }

            res.json({
                success: true,
                data: booking,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Cancel booking
router.patch(
    '/:id/cancel',
    authenticate,
    async (req, res, next) => {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: req.params.id },
            });

            if (!booking) {
                throw new AppError('Booking not found', 404);
            }

            if (booking.userId !== req.user.id) {
                throw new AppError('Not authorized to cancel this booking', 403);
            }

            if (booking.status === 'CANCELLED') {
                throw new AppError('Booking is already cancelled', 400);
            }

            if (booking.status === 'COMPLETED') {
                throw new AppError('Cannot cancel a completed booking', 400);
            }

            const updatedBooking = await prisma.booking.update({
                where: { id: req.params.id },
                data: { status: 'CANCELLED' },
                include: {
                    space: {
                        select: { id: true, title: true },
                    },
                },
            });

            // Notify about cancellation
            const io = req.app.get('io');
            io.to(`space-${booking.spaceId}`).emit('booking-cancelled', {
                spaceId: booking.spaceId,
                bookingId: booking.id,
            });

            res.json({
                success: true,
                data: updatedBooking,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Confirm booking (after payment)
router.patch(
    '/:id/confirm',
    authenticate,
    async (req, res, next) => {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: req.params.id },
            });

            if (!booking) {
                throw new AppError('Booking not found', 404);
            }

            if (booking.userId !== req.user.id) {
                throw new AppError('Not authorized', 403);
            }

            if (booking.status !== 'PENDING') {
                throw new AppError('Booking cannot be confirmed', 400);
            }

            const updatedBooking = await prisma.booking.update({
                where: { id: req.params.id },
                data: { status: 'CONFIRMED' },
                include: {
                    space: {
                        select: { id: true, title: true, address: true },
                    },
                },
            });

            res.json({
                success: true,
                data: updatedBooking,
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
