import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, X, Ticket, History, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../lib/api';
import { useToast } from '../components/ui/Toaster';

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings/my-bookings');
            setBookings(response.data.data);
        } catch (error) {
            addToast('error', 'SESSION RECOVERY FAILED. Could not load records.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        setCancellingId(bookingId);
        try {
            await api.patch(`/bookings/${bookingId}/cancel`);
            addToast('success', 'RESERVATION TERMINATED. Session voided.');
            fetchBookings();
        } catch (error) {
            addToast('error', error.response?.data?.message || 'TERMINATION FAILED');
        } finally {
            setCancellingId(null);
        }
    };

    const handlePayment = async (bookingId) => {
        setIsProcessing(true);
        try {
            const paymentResponse = await api.post('/payments/create-intent', {
                bookingId,
            });

            const { mock, clientSecret } = paymentResponse.data.data;

            if (mock) {
                addToast('success', 'BOOKING INITIALISED. Allocation confirmed via mock gateway.');
                fetchBookings();
                return;
            }

            // Stripe handling would go here if needed
            addToast('info', 'Stripe checkout initiated.');
        } catch (error) {
            addToast('error', error.response?.data?.message || 'TRANSACTION FAILED');
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
            case 'PENDING':
                return 'border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
            case 'CANCELLED':
                return 'border-red-500/30 bg-red-500/10 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
            case 'COMPLETED':
                return 'border-primary-500/30 bg-primary-500/10 text-primary-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]';
            default:
                return 'border-white/10 bg-white/5 text-gray-400';
        }
    };

    const upcomingBookings = bookings.filter(
        (b) => new Date(b.startTime) > new Date() && b.status !== 'CANCELLED'
    );
    const pastBookings = bookings.filter(
        (b) => new Date(b.startTime) <= new Date() || b.status === 'CANCELLED'
    );

    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center bg-black">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary-500/10 border-t-primary-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 bg-primary-500/20 blur-xl animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-black selection:bg-primary-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 bg-hero-pattern opacity-40 -z-10" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(6,182,212,0.1),transparent_70%)] -z-10" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 pb-8 border-b border-white/5"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mb-6">
                        <Ticket className="w-3 h-3" />
                        Reservation Ledger
                    </div>
                    <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">My <span className="text-transparent bg-clip-text bg-neon-gradient">Bookings</span></h1>
                    <p className="mt-4 text-gray-500 font-medium">Encrypted records of your parking node allocations and interactions.</p>
                </motion.div>

                {bookings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass !rounded-[3rem] text-center p-20 border border-dashed border-white/10"
                    >
                        <div className="inline-flex p-6 bg-white/[0.02] rounded-full mb-8">
                            <Calendar className="w-16 h-16 text-gray-700" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase italic mb-4">No Historical Records</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium">Your account has no active or past parking node allocations on the network.</p>
                        <Link to="/search" className="btn-primary py-5 px-10 !rounded-2xl shadow-neon inline-flex">
                            Initialise Search
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-20">
                        {/* Upcoming Bookings */}
                        {upcomingBookings.length > 0 && (
                            <section>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-2 bg-primary-500/20 rounded-lg">
                                        <Activity className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-wide">Active Allocations</h2>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>

                                <div className="space-y-6">
                                    <AnimatePresence>
                                        {upcomingBookings.map((booking, i) => (
                                            <motion.div
                                                key={booking.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="group glass !rounded-[2.5rem] p-6 md:p-8 border border-white/5 hover:border-primary-500/30 transition-all duration-500 relative overflow-hidden"
                                            >
                                                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                                    <div className="w-full md:w-48 h-32 bg-white/[0.02] rounded-3xl overflow-hidden flex-shrink-0 group-hover:shadow-neon transition-all duration-700">
                                                        {booking.space.imageUrl ? (
                                                            <img
                                                                src={booking.space.imageUrl}
                                                                alt={booking.space.title}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <MapPin className="w-10 h-10 text-gray-800" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 space-y-4">
                                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                                            <div>
                                                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mb-1">
                                                                    <Link to={`/spaces/${booking.space.id}`} className="hover:text-primary-400 transition-colors">
                                                                        {booking.space.title}
                                                                    </Link>
                                                                </h3>
                                                                <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase">
                                                                    <MapPin className="w-3.5 h-3.5 text-primary-500/60" />
                                                                    {booking.space.address}
                                                                </div>
                                                            </div>
                                                            <div className={`px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${getStatusStyles(booking.status)}`}>
                                                                {booking.status}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/5">
                                                            <div className="space-y-1">
                                                                <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Date</div>
                                                                <div className="text-sm font-bold text-white uppercase">{format(new Date(booking.startTime), 'MMM d, yyyy')}</div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Window</div>
                                                                <div className="text-sm font-bold text-white uppercase">{format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}</div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Total Cost</div>
                                                                <div className="text-sm font-black text-primary-400 font-mono">${booking.totalAmount.toFixed(2)}</div>
                                                            </div>
                                                            <div className="flex items-end justify-end gap-3">
                                                                {booking.status === 'PENDING' && (
                                                                    <button
                                                                        onClick={() => handlePayment(booking.id)}
                                                                        disabled={isProcessing}
                                                                        className="px-4 py-2 rounded-xl bg-primary-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all duration-300 disabled:opacity-50 shadow-neon"
                                                                    >
                                                                        {isProcessing ? 'Processing' : 'Pay Now'}
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleCancel(booking.id)}
                                                                    disabled={cancellingId === booking.id}
                                                                    className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all duration-300 disabled:opacity-50"
                                                                    title="Terminate Allocation"
                                                                >
                                                                    {cancellingId === booking.id ? (
                                                                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                                    ) : (
                                                                        <X className="w-5 h-5" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Scanline Effect */}
                                                <div className="absolute inset-0 bg-scanline opacity-5 pointer-events-none" />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </section>
                        )}

                        {/* Past Bookings */}
                        {pastBookings.length > 0 && (
                            <section>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <History className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <h2 className="text-xl font-black text-gray-500 uppercase italic tracking-wide">Historical Data</h2>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>

                                <div className="grid gap-4">
                                    {pastBookings.map((booking, i) => (
                                        <motion.div
                                            key={booking.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 + i * 0.05 }}
                                            className="glass !rounded-3xl p-6 border border-white/5 bg-white/[0.01] flex flex-wrap items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-all duration-500"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white/5 rounded-2xl overflow-hidden grayscale">
                                                    {booking.space.imageUrl ? (
                                                        <img src={booking.space.imageUrl} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center"><MapPin className="w-6 h-6 text-gray-800" /></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-white italic truncate max-w-[200px] uppercase">{booking.space.title}</h3>
                                                    <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{format(new Date(booking.startTime), 'MMM d, yyyy')}</div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-10">
                                                <div className="text-right">
                                                    <div className="text-[10px] font-black text-gray-700 uppercase tracking-widest mb-1">Final Amount</div>
                                                    <div className="text-sm font-bold text-gray-400 font-mono">${booking.totalAmount.toFixed(2)}</div>
                                                </div>
                                                <div className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${getStatusStyles(booking.status)}`}>
                                                    {booking.status}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
