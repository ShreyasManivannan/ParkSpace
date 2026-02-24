import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

const createSpaceSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(1000),
    address: z.string().min(5),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    pricePerHour: z.number().positive(),
    imageUrl: z.string().url().optional(),
});

const updateSpaceSchema = createSpaceSchema.partial();

// Get all spaces (with optional filters)
router.get('/', async (req, res, next) => {
    try {
        const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice, search } = req.query;

        const where = { isAvailable: true };

        // Bounding box filter for map
        if (minLat && maxLat && minLng && maxLng) {
            where.latitude = {
                gte: parseFloat(minLat),
                lte: parseFloat(maxLat),
            };
            where.longitude = {
                gte: parseFloat(minLng),
                lte: parseFloat(maxLng),
            };
        }

        // Price filter
        if (minPrice || maxPrice) {
            where.pricePerHour = {};
            if (minPrice) where.pricePerHour.gte = parseFloat(minPrice);
            if (maxPrice) where.pricePerHour.lte = parseFloat(maxPrice);
        }

        // Search filter
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { address: { contains: search } },
                { description: { contains: search } },
            ];
        }

        const spaces = await prisma.space.findMany({
            where,
            include: {
                owner: {
                    select: { id: true, name: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({
            success: true,
            data: spaces,
        });
    } catch (error) {
        next(error);
    }
});

// Get single space
router.get('/:id', async (req, res, next) => {
    try {
        const space = await prisma.space.findUnique({
            where: { id: req.params.id },
            include: {
                owner: {
                    select: { id: true, name: true, email: true },
                },
                bookings: {
                    where: {
                        status: { in: ['PENDING', 'CONFIRMED'] },
                        endTime: { gte: new Date() },
                    },
                    select: {
                        id: true,
                        startTime: true,
                        endTime: true,
                        status: true,
                    },
                },
            },
        });

        if (!space) {
            throw new AppError('Space not found', 404);
        }

        res.json({
            success: true,
            data: space,
        });
    } catch (error) {
        next(error);
    }
});

// Create space (Owner only)
router.post(
    '/',
    authenticate,
    requireRole('OWNER'),
    async (req, res, next) => {
        try {
            const data = createSpaceSchema.parse(req.body);

            const space = await prisma.space.create({
                data: {
                    ...data,
                    ownerId: req.user.id,
                },
                include: {
                    owner: {
                        select: { id: true, name: true },
                    },
                },
            });

            res.status(201).json({
                success: true,
                data: space,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return next(new AppError(error.errors[0].message, 400));
            }
            next(error);
        }
    }
);

// Update space (Owner only, own spaces)
router.put(
    '/:id',
    authenticate,
    requireRole('OWNER'),
    async (req, res, next) => {
        try {
            const existingSpace = await prisma.space.findUnique({
                where: { id: req.params.id },
            });

            if (!existingSpace) {
                throw new AppError('Space not found', 404);
            }

            if (existingSpace.ownerId !== req.user.id) {
                throw new AppError('Not authorized to update this space', 403);
            }

            const data = updateSpaceSchema.parse(req.body);

            const space = await prisma.space.update({
                where: { id: req.params.id },
                data,
                include: {
                    owner: {
                        select: { id: true, name: true },
                    },
                },
            });

            // Notify connected clients about the update
            const io = req.app.get('io');
            io.to(`space-${space.id}`).emit('space-updated', space);

            res.json({
                success: true,
                data: space,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return next(new AppError(error.errors[0].message, 400));
            }
            next(error);
        }
    }
);

// Delete space (Owner only, own spaces)
router.delete(
    '/:id',
    authenticate,
    requireRole('OWNER'),
    async (req, res, next) => {
        try {
            const existingSpace = await prisma.space.findUnique({
                where: { id: req.params.id },
            });

            if (!existingSpace) {
                throw new AppError('Space not found', 404);
            }

            if (existingSpace.ownerId !== req.user.id) {
                throw new AppError('Not authorized to delete this space', 403);
            }

            await prisma.space.delete({
                where: { id: req.params.id },
            });

            res.json({
                success: true,
                message: 'Space deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }
);

// Get owner's spaces
router.get(
    '/owner/my-spaces',
    authenticate,
    requireRole('OWNER'),
    async (req, res, next) => {
        try {
            const spaces = await prisma.space.findMany({
                where: { ownerId: req.user.id },
                include: {
                    bookings: {
                        where: {
                            status: { in: ['PENDING', 'CONFIRMED'] },
                        },
                        orderBy: { startTime: 'asc' },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            res.json({
                success: true,
                data: spaces,
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
