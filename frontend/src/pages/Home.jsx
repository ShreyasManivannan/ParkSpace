import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Shield, DollarSign, ArrowRight, Star, Users, Car, Zap, Sparkles, Trophy } from 'lucide-react';

const features = [
    {
        icon: MapPin,
        title: 'Instant Discovery',
        description: 'Locate premium parking assets globally with real-time vector mapping.',
        accent: 'primary'
    },
    {
        icon: Clock,
        title: 'Seamless Booking',
        description: 'One-tap reservations with automated confirmation and entry codes.',
        accent: 'accent'
    },
    {
        icon: Shield,
        title: 'Ironclad Security',
        description: 'Military-grade encryption for all transactions and user data privacy.',
        accent: 'primary'
    },
    {
        icon: DollarSign,
        title: 'Yield Optimization',
        description: 'Monetize your idle space and maximize returns with dynamic pricing.',
        accent: 'accent'
    },
];

const stats = [
    { value: '10K+', label: 'GLOBAL SPOTS', icon: Users },
    { value: '50K+', label: 'ACTIVE USERS', icon: Users },
    { value: '100K+', label: 'SUCCESSFUL STOPS', icon: Zap },
    { value: '4.9', label: 'USER RATING', icon: Star },
];

export default function Home() {
    return (
        <div className="overflow-hidden bg-black selection:bg-primary-500/40">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-20">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 bg-hero-pattern opacity-40" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(6,182,212,0.15),transparent_70%)]" />

                {/* Animated Orbs */}
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] animate-pulse-slow delay-700" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <span className="inline-flex items-center gap-2 px-6 py-2 bg-white/[0.03] border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-10 shadow-2xl backdrop-blur-md">
                                <Sparkles className="w-3 h-3 animate-spin-slow" />
                                Revolutionizing Urban Parking
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                            className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.85]"
                        >
                            Find Your <br />
                            <span className="gradient-text italic">Perfect Spot</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-14 font-medium leading-relaxed"
                        >
                            The premier marketplace for high-end parking assets.
                            List with confidence, book with ease, and experience
                            frictionless urban mobility.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <button onClick={() => window.location.href = '/search'} className="btn-primary text-sm px-10 py-5 group !rounded-2xl relative overflow-hidden">
                                <span className="relative z-10 flex items-center gap-3 font-black">
                                    EXPLORE SPOTS
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            </button>
                            <Link to="/register" className="btn-secondary text-sm px-10 py-5 !rounded-2xl font-black">
                                LIST HYPER-SPOT
                            </Link>
                        </motion.div>
                    </div>

                    {/* Stats Layout */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
                        className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-4 px-4"
                    >
                        {stats.map((stat, idx) => (
                            <div
                                key={stat.label}
                                className={`glass !bg-white/[0.01] border border-white/5 p-8 text-center glass-shine group hover:border-primary-500/20 transition-all duration-700 ${idx % 2 === 0 ? 'translate-y-4' : '-translate-y-4'}`}
                            >
                                <div className="flex items-center justify-center gap-2 text-4xl font-black text-white mb-2 tracking-tighter">
                                    {stat.value}
                                </div>
                                <div className="text-[10px] font-black text-primary-500 tracking-[0.2em] uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Masterpiece */}
            <section className="relative py-40 border-y border-white/5">
                {/* Background Accent */}
                <div className="absolute inset-0 bg-white/[0.01]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_50%)]" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-24"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
                            Designed for <span className="text-primary-500 italic">Excellence</span>
                        </h2>
                        <div className="w-24 h-1 bg-neon-gradient mx-auto rounded-full mb-8 shadow-neon" />
                        <p className="text-gray-500 max-w-xl mx-auto font-medium uppercase text-xs tracking-widest">
                            We've re-engineered the parking experience from the ground up,
                            focusing on speed, aesthetics, and reliability.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.8 }}
                                whileHover={{ y: -10 }}
                                className="glass !bg-white/[0.02] border border-white/5 p-10 group relative h-full overflow-hidden !rounded-[2.5rem]"
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-all duration-500 ${feature.accent === 'primary' ? 'bg-primary-500/10 group-hover:bg-primary-500/20 group-hover:shadow-neon' : 'bg-accent-500/10 group-hover:bg-accent-500/20 group-hover:shadow-neon-purple'}`}>
                                    <feature.icon className={`w-8 h-8 ${feature.accent === 'primary' ? 'text-primary-400' : 'text-accent-400'}`} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter leading-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Bottom Accent Line */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 group-hover:bg-neon-gradient transition-all duration-700" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA High-End Section */}
            <section className="relative py-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative glass !bg-white/[0.03] border border-white/10 p-20 md:p-32 !rounded-[4rem] text-center overflow-hidden"
                    >
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent-500/10 rounded-full blur-[100px]" />
                        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]" />

                        <div className="relative z-10">
                            <div className="flex justify-center mb-10">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    className="p-8 bg-neon-gradient rounded-[2.5rem] shadow-neon"
                                >
                                    <Car className="w-16 h-16 text-white" />
                                </motion.div>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase tracking-tighter leading-none">
                                Ready to Elevate <br />
                                Your <span className="gradient-text italic">Journey?</span>
                            </h2>
                            <p className="text-gray-500 max-w-2xl mx-auto mb-14 text-lg font-medium">
                                Join our network of premium parking assets and elite commuters.
                                Secure your spot in the future of urban mobility.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Link to="/register" className="btn-primary text-sm px-12 py-6 !rounded-2xl font-black shadow-neon group">
                                    JOIN COMMUNIY
                                    <Trophy className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                                </Link>
                                <Link to="/search" className="btn-secondary text-sm px-12 py-6 !rounded-2xl font-black">
                                    BROWSE ASSETS
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Elite Footer */}
            <footer className="border-t border-white/5 py-20 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-neon-gradient rounded-2xl shadow-neon">
                                <Car className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-3xl font-black tracking-tighter text-white uppercase">
                                PARK<span className="text-primary-500 italic">SPACE</span>
                            </span>
                        </div>

                        <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
                            <a href="#" className="hover:text-primary-400 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-primary-400 transition-colors">Terms</a>
                            <a href="#" className="hover:text-primary-400 transition-colors">Twitter</a>
                            <a href="#" className="hover:text-primary-400 transition-colors">Discord</a>
                        </div>

                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">
                            © 2024 LUXURY ASSETS GROUP. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
