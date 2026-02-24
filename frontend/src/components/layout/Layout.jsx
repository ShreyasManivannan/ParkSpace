import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import { useAuthStore } from '../../stores/authStore';

export default function Layout() {
    const { checkAuth, isLoading } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center bg-black">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-primary-500/10 border-t-primary-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 bg-primary-500/20 blur-3xl animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black transition-colors duration-500">
            <Navbar />
            <main className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
