import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../components/ui/Toaster';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuthStore();
    const { addToast } = useToast();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(email, password);
            addToast('success', 'ACCESS GRANTED. Welcome back.');
            navigate(from, { replace: true });
        } catch (error) {
            addToast('error', error.response?.data?.message || 'AUTHENTICATION FAILED');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-24 px-4 pb-12 bg-black selection:bg-primary-500/30">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 bg-hero-pattern opacity-40 -z-10" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)] -z-10" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-[100px] -z-10 animate-pulse-slow delay-700" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-lg"
            >
                <div className="glass !bg-white/[0.02] border border-white/10 p-12 md:p-16 !rounded-[3rem] shadow-2xl relative overflow-hidden glass-shine">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            className="inline-flex p-4 bg-neon-gradient rounded-2xl shadow-neon mb-8"
                        >
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </motion.div>
                        <h1 className="text-4xl font-black text-white mb-3 uppercase tracking-tighter">Secure Login</h1>
                        <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Access Your Parking Hub</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 ml-1">Identity Vector (Email)</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 p-1 bg-white/[0.03] rounded-lg border border-white/5 group-focus-within:border-primary-500/30 transition-colors">
                                        <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input !pl-16 !rounded-2xl !bg-black/40 focus:!bg-black/60 !border-white/5 focus:!border-primary-500/30 transition-all font-medium py-5"
                                        placeholder="user@network.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 ml-1">Access Key (Password)</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 p-1 bg-white/[0.03] rounded-lg border border-white/5 group-focus-within:border-primary-500/30 transition-colors">
                                        <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input !pl-16 !pr-16 !rounded-2xl !bg-black/40 focus:!bg-black/60 !border-white/5 focus:!border-primary-500/30 transition-all font-medium py-5"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-primary-400 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="w-5 h-5 rounded-md border border-white/10 bg-black/40 flex items-center justify-center group-hover:border-primary-500/50 transition-colors">
                                    <div className="w-2 h-2 rounded-sm bg-primary-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                                </div>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">Remember Node</span>
                            </label>
                            <a href="#" className="text-[10px] font-black text-primary-500/60 hover:text-primary-400 uppercase tracking-widest transition-colors">Reset Key?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-6 !rounded-2xl shadow-neon relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <div className="relative flex items-center justify-center gap-3">
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="font-black text-xs uppercase tracking-[0.2em]">Initialise Session</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                            New to the network?{' '}
                            <Link to="/register" className="text-primary-500 hover:text-white transition-colors border-b border-primary-500/20 hover:border-white pb-0.5">
                                Create Identity
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Security Footer */}
                <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-black text-gray-700 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        SSL ENCRYPTED
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        SECURE GATEWAY
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
