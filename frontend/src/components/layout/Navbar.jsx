import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Menu, X, User, LogOut, MapPin, Plus, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import ThemeToggle from '../ui/ThemeToggle';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    const navLinks = [
        { name: 'Explore', path: '/search', icon: MapPin },
        ...(user ? [
            { name: 'Dashboard', path: '/dashboard', icon: Car },
            ...(user.role === 'OWNER' ? [{ name: 'List Space', path: '/create-space', icon: Plus }] : []),
            { name: 'My Bookings', path: '/my-bookings', icon: Calendar },
        ] : []),
    ];

    return (
        <header className="fixed w-full z-50 px-4 pt-6 pointer-events-none">
            <nav className="max-w-7xl mx-auto glass !rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl pointer-events-auto overflow-hidden bg-white/80 dark:bg-black/80 backdrop-blur-xl">
                <div className="px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group relative transition-transform hover:scale-105 z-50">
                        <div className="p-2.5 bg-neon-gradient rounded-xl shadow-neon group-hover:rotate-12 transition-all duration-500">
                            <Car className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">
                            PARK<span className="text-primary-500">SPACE</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.03] transition-all flex items-center gap-2 z-50"
                            >
                                <link.icon className="w-3.5 h-3.5 text-primary-500/60" />
                                {link.name}
                            </Link>
                        ))}

                        <div className="w-px h-8 bg-gray-200 dark:bg-white/5 mx-2" />

                        <div className="flex items-center gap-4 pl-2">
                            <ThemeToggle />
                            {user ? (
                                <>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{user.name}</span>
                                        <span className="text-[8px] font-black text-primary-600 dark:text-primary-500 uppercase tracking-widest leading-none">{user.role}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-3 bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-red-500/30 hover:bg-red-500/10 rounded-2xl transition-all group z-50"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-400" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/login" className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors z-50">
                                        Login
                                    </Link>
                                    <Link to="/register" className="btn-primary !py-3 !px-8 !rounded-2xl text-[10px] shadow-neon z-50">
                                        Join Network
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="lg:hidden flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-3 bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white outline-none active:scale-95 transition-transform z-50"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                            className="lg:hidden border-t border-gray-200 dark:border-white/5 bg-white/95 dark:bg-black/95 backdrop-blur-3xl absolute top-20 left-0 w-full z-40"
                        >
                            <div className="p-6 space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 active:text-primary-500 dark:active:text-primary-400"
                                    >
                                        <link.icon className="w-5 h-5 text-primary-500" />
                                        {link.name}
                                    </Link>
                                ))}

                                <div className="h-px bg-gray-200 dark:bg-white/5 my-6" />

                                {user ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-5 bg-primary-500/10 border border-primary-500/20 rounded-2xl">
                                            <div className="w-12 h-12 bg-neon-gradient rounded-xl p-0.5">
                                                <div className="w-full h-full bg-white dark:bg-black rounded-[0.6rem] flex items-center justify-center">
                                                    <User className="w-6 h-6 text-primary-500 dark:text-primary-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 dark:text-white uppercase italic">{user.name}</p>
                                                <p className="text-[10px] font-black text-primary-600 dark:text-primary-500 uppercase tracking-widest">{user.role} ACCESS</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center gap-3 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 dark:text-red-400"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Terminate Session
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <Link to="/login" onClick={() => setIsOpen(false)} className="btn-secondary !py-5 !rounded-2xl text-[10px] font-black text-center">
                                            LOGIN
                                        </Link>
                                        <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary !py-5 !rounded-2xl text-[10px] font-black text-center shadow-neon">
                                            JOIN
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}
