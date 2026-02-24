import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { AppError } from './errorHandler.js';

export const authenticate = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true, name: true },
        });

        if (!user) {
            throw new AppError('User not found', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export const requireRole = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new AppError('Not authenticated', 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError('Not authorized for this action', 403));
        }

        next();
    };
};
