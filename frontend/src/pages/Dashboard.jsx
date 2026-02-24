import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, Calendar, TrendingUp, Car, ArrowRight, Wallet, Activity, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

export default function Dashboard() {
    const { user } = useAuthStore();
    const [spaces, setSpaces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.role === 'OWNER') {
                try {
                    const response = await api.get('/spaces/owner/my-spaces');
                    setSpaces(response.data.data);
                } catch (error) {
                    console.error('Failed to fetch spaces:', error);
                }
            }
            setIsLoading(false);
        };

        fetchData();
    }, [user]);

    // Calculate stats for owner
    const totalEarnings = spaces.reduce((acc, space) => {
        return acc + space.bookings
            .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
            .reduce((sum, b) => sum + b.totalAmount, 0);
    }, 0);

    const activeBookings = spaces.reduce((acc, space) => {
        return acc + space.bookings.filter(b => b.status === 'CONFIRMED').length;
    }, 0);

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
        <div className="min-h-screen pt-32 pb-20 bg-black selection:bg-primary-500/30 overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 bg-hero-pattern opacity-40 -z-10" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(6,182,212,0.1),transparent_70%)] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="relative mb-16"
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mb-4">
                                <Activity className="w-3 h-3" />
                                Operational Dashboard
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
                                Hello, <span className="text-transparent bg-clip-text bg-neon-gradient">{user?.name}</span>
                            </h1>
                            <p className="mt-4 text-gray-500 max-w-xl font-medium">
                                {user?.role === 'OWNER'
                                    ? 'Your real-estate portfolio performance and network metrics.'
                                    : 'Access your secure reservations and explore new parking nodes.'}
                            </p>
                        </div>
                        {user?.role === 'OWNER' && (
                            <Link to="/create-space" className="btn-primary py-4 px-8 !rounded-2xl shadow-neon group">
                                <span className="flex items-center gap-2">
                                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                                    Add New Asset
                                </span>
                            </Link>
                        )}
                    </div>
                </motion.div>

                {user?.role === 'OWNER' ? (
                    <div className="space-y-12">
                        {/* Owner Metrics Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {[
                                { label: 'Assets Listed', value: spaces.length, icon: Car, color: 'primary' },
                                { label: 'Revenue Generated', value: `$${totalEarnings.toFixed(2)}`, icon: Wallet, color: 'emerald' },
                                { label: 'Active Sessions', value: activeBookings, icon: Activity, color: 'accent' }
                            ].map((stat, i) => (
                                <div key={i} className="glass group relative overflow-hidden !rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-500 p-8 glass-shine">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-4 rounded-2xl bg-${stat.color === 'emerald' ? 'emerald-500' : stat.color === 'accent' ? 'accent-500' : 'primary-500'}/10 border border-${stat.color === 'emerald' ? 'emerald-500' : stat.color === 'accent' ? 'accent-500' : 'primary-500'}/20 group-hover:scale-110 transition-transform duration-500`}>
                                            <stat.icon className={`w-8 h-8 text-${stat.color === 'emerald' ? 'emerald-400' : stat.color === 'accent' ? 'accent-400' : 'primary-400'}`} />
                                        </div>
                                        <TrendingUp className="w-5 h-5 text-gray-700" />
                                    </div>
                                    <div className="text-4xl font-black text-white tracking-tighter mb-1">{stat.value}</div>
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>

                                    {/* Ambient Glow */}
                                    <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-${stat.color === 'emerald' ? 'emerald-500' : stat.color === 'accent' ? 'accent-500' : 'primary-500'}/5 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-700`} />
                                </div>
                            ))}
                        </motion.div>

                        {/* Inventory Section */}
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Active Inventory</h2>
                                <div className="h-px flex-1 bg-white/5" />
                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                    <Sparkles className="w-3 h-3 text-primary-500" />
                                    {spaces.length} Nodes Online
                                </div>
                            </div>

                            {spaces.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="glass !rounded-[3rem] p-20 text-center border border-dashed border-white/10"
                                >
                                    <div className="inline-flex p-6 bg-white/[0.02] rounded-full mb-8">
                                        <Car className="w-16 h-16 text-gray-700" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase mb-3">No Active Assets</h3>
                                    <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium">Your portfolio is currently empty. Secure your first parking node to begin network operations.</p>
                                    <Link to="/create-space" className="btn-primary py-5 px-10 !rounded-2xl shadow-neon inline-flex">
                                        Initialise First Node
                                    </Link>
                                </motion.div>
                            ) : (
                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    <AnimatePresence>
                                        {spaces.map((space, i) => (
                                            <motion.div
                                                key={space.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * i }}
                                                className="group glass !rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-primary-500/30 transition-all duration-500"
                                            >
                                                <div className="aspect-[16/10] relative overflow-hidden">
                                                    {space.imageUrl ? (
                                                        <img
                                                            src={space.imageUrl}
                                                            alt={space.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-white/[0.02] flex items-center justify-center">
                                                            <MapPin className="w-12 h-12 text-gray-800" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                                    <div className="absolute top-4 right-4">
                                                        <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black text-primary-400 uppercase tracking-widest">
                                                            ID: {space.id.slice(0, 8)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-8">
                                                    <h3 className="text-xl font-black text-white hover:text-primary-400 transition-colors duration-300 mb-2 truncate uppercase italic">{space.title}</h3>
                                                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-6">
                                                        <MapPin className="w-3.5 h-3.5 text-primary-500/60" />
                                                        <span className="truncate">{space.address}</span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 mb-6">
                                                        <div>
                                                            <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Fee Rate</div>
                                                            <div className="text-lg font-black text-white">${space.pricePerHour}<span className="text-[10px] text-gray-500 ml-1">/HR</span></div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Utilization</div>
                                                            <div className="text-lg font-black text-primary-400">
                                                                {space.bookings.filter(b => b.status === 'CONFIRMED').length} <span className="text-[10px] text-gray-500 uppercase">Active</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Link
                                                        to={`/spaces/${space.id}`}
                                                        className="flex items-center justify-center w-full py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all duration-300 group/btn"
                                                    >
                                                        Node Details
                                                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Renter Dashboard Section */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <div className="grid gap-8 md:grid-cols-2">
                            {[
                                {
                                    to: "/search",
                                    title: "Network Search",
                                    desc: "Locate and secure high-end parking nodes in real-time.",
                                    icon: MapPin,
                                    color: "primary",
                                    action: "Launch Explorer"
                                },
                                {
                                    to: "/my-bookings",
                                    title: "Access Tokens",
                                    desc: "Manage your active reservations and historical sessions.",
                                    icon: Calendar,
                                    color: "accent",
                                    action: "View Records"
                                }
                            ].map((item, i) => (
                                <Link key={i} to={item.to} className="group relative">
                                    <div className="glass !rounded-[3rem] p-10 border border-white/5 hover:border-white/20 transition-all duration-500 relative z-10 h-full flex flex-col justify-between">
                                        <div>
                                            <div className={`inline-flex p-6 bg-${item.color}-500/10 border border-${item.color}-500/20 rounded-[2rem] mb-8 group-hover:scale-110 group-hover:shadow-neon${item.color === 'accent' ? '-purple' : ''} transition-all duration-700`}>
                                                <item.icon className={`w-10 h-10 text-${item.color}-400`} />
                                            </div>
                                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">{item.title}</h3>
                                            <p className="text-gray-500 font-medium leading-relaxed max-w-xs">{item.desc}</p>
                                        </div>

                                        <div className="mt-12 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em]">{item.action}</span>
                                            <div className="p-4 bg-white/[0.03] rounded-full group-hover:bg-primary-500 group-hover:text-black transition-all duration-500">
                                                <ArrowRight className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decoration */}
                                    <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-${item.color}-500/5 rounded-full blur-[100px] group-hover:bg-${item.color}-500/10 transition-all duration-700`} />
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
