import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    role: z.enum(['OWNER', 'RENTER']).default('RENTER'),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

// Register
router.post('/register', async (req, res, next) => {
    try {
        const data = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new AppError('Email already registered', 400);
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                role: data.role,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(201).json({
            success: true,
            data: { user, token },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
});

// Login
router.post('/login', async (req, res, next) => {
    try {
        const data = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        const isValidPassword = await bcrypt.compare(data.password, user.password);

        if (!isValidPassword) {
            throw new AppError('Invalid email or password', 401);
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
    res.json({
        success: true,
        data: { user: req.user },
    });
});

export default router;
