import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ShieldCheck, Car, Key, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../components/ui/Toaster';

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'RENTER',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);

    const navigate = useNavigate();
    const { register } = useAuthStore();
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await register(formData);
            addToast('success', 'IDENTITY CREATED. Welcome to the network.');
            navigate('/dashboard');
        } catch (error) {
            addToast('error', error.response?.data?.message || 'REGISTRATION FAILED');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-24 px-4 pb-12 bg-black selection:bg-primary-500/30 overflow-hidden">
            {/* Ambient Animated Background */}
            <div className="fixed inset-0 bg-hero-pattern opacity-40 -z-10" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)] -z-10" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[100px] -z-10 animate-pulse-slow delay-1000" />

            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-0 relative">
                {/* Left Side: Branding & Info */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden md:flex flex-col justify-between p-16 glass !bg-white/[0.01] border-y border-l border-white/10 !rounded-l-[3.5rem] relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-3 mb-16 group">
                            <div className="p-2.5 bg-neon-gradient rounded-xl shadow-neon">
                                <Car className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                                PARK<span className="text-primary-500">SPACE</span>
                            </span>
                        </Link>

                        <h2 className="text-5xl font-black text-white leading-tight uppercase tracking-tighter italic mb-8">
                            Join the <br />
                            <span className="text-transparent bg-clip-text bg-neon-gradient">Elite Network</span>
                        </h2>

                        <div className="space-y-8">
                            {[
                                { icon: Zap, title: "Real-time Discovery", desc: "Instant access to verified parking nodes." },
                                { icon: Shield, title: "Secure Protocol", desc: "Encrypted transactions and data privacy." },
                                { icon: Sparkles, title: "Premium Assets", desc: "Curated high-end urban locations." }
                            ].map((feature, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-primary-500/10 group-hover:border-primary-500/30 transition-all">
                                        <feature.icon className="w-5 h-5 text-primary-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-white uppercase tracking-widest">{feature.title}</h4>
                                        <p className="text-[10px] text-gray-500 font-medium uppercase mt-1 tracking-wider">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 pt-10 border-t border-white/5">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">© 2024 Luxury Assets Group. Secured Access Only.</p>
                    </div>

                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />
                </motion.div>

                {/* Right Side: Registration Form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full"
                >
                    <div className="glass !bg-white/[0.03] border border-white/10 p-12 md:p-16 !rounded-[3rem] md:!rounded-l-none md:!rounded-r-[3.5rem] shadow-2xl relative overflow-hidden glass-shine h-full">
                        <div className="mb-10">
                            <div className="flex items-center gap-2 mb-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-primary-500 shadow-neon' : 'w-4 bg-white/10'}`} />
                                ))}
                            </div>
                            <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Create <span className="text-primary-500">Identity</span></h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <AnimatePresence mode="wait">
                                {step === 1 ? (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: 'RENTER' })}
                                                className={`p-6 rounded-3xl border transition-all duration-500 flex flex-col items-center gap-3 group ${formData.role === 'RENTER' ? 'bg-primary-500/10 border-primary-500 shadow-neon' : 'bg-white/[0.02] border-white/10 hover:border-white/20'}`}
                                            >
                                                <div className={`p-3 rounded-xl transition-colors ${formData.role === 'RENTER' ? 'bg-primary-500 text-black' : 'bg-white/5 text-gray-500 group-hover:text-white'}`}>
                                                    <Key className="w-5 h-5" />
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${formData.role === 'RENTER' ? 'text-white' : 'text-gray-500'}`}>Renter</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: 'OWNER' })}
                                                className={`p-6 rounded-3xl border transition-all duration-500 flex flex-col items-center gap-3 group ${formData.role === 'OWNER' ? 'bg-accent-500/10 border-accent-500 shadow-neon-purple' : 'bg-white/[0.02] border-white/10 hover:border-white/20'}`}
                                            >
                                                <div className={`p-3 rounded-xl transition-colors ${formData.role === 'OWNER' ? 'bg-accent-500 text-white' : 'bg-white/5 text-gray-500 group-hover:text-white'}`}>
                                                    <Car className="w-5 h-5" />
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${formData.role === 'OWNER' ? 'text-white' : 'text-gray-500'}`}>Owner</span>
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 ml-1">Full Name</label>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 p-1 bg-white/[0.03] rounded-lg border border-white/5 group-focus-within:border-primary-500/30">
                                                    <User className="w-5 h-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="input !pl-16 !rounded-2xl !bg-black/40 focus:!bg-black/60 !border-white/5 focus:!border-primary-500/30 transition-all font-medium py-5"
                                                    placeholder="John Wickman"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            disabled={!formData.name}
                                            className="btn-primary w-full py-6 !rounded-2xl shadow-neon flex items-center justify-center gap-3 group disabled:opacity-50"
                                        >
                                            <span className="font-black text-xs uppercase tracking-[0.2em]">Next Protocol</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 ml-1">Identity Vector (Email)</label>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 p-1 bg-white/[0.03] rounded-lg border border-white/5">
                                                    <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-primary-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="input !pl-16 !rounded-2xl !bg-black/40 focus:!bg-black/60 !border-white/5 focus:!border-primary-500/30 transition-all font-medium py-5"
                                                    placeholder="identity@network.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 ml-1">Access Key (Password)</label>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 p-1 bg-white/[0.03] rounded-lg border border-white/5">
                                                    <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-primary-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    required
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    className="input !pl-16 !rounded-2xl !bg-black/40 focus:!bg-black/60 !border-white/5 focus:!border-primary-500/30 transition-all font-medium py-5"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="flex-1 py-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading || !formData.email || !formData.password}
                                                className="flex-[2] btn-primary py-6 !rounded-2xl shadow-neon relative overflow-hidden group"
                                            >
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                                <div className="relative flex items-center justify-center gap-3">
                                                    {isLoading ? (
                                                        <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                    ) : (
                                                        <>
                                                            <span className="font-black text-xs uppercase tracking-[0.2em]">Join Network</span>
                                                            <ShieldCheck className="w-5 h-5" />
                                                        </>
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>

                        <div className="mt-12 text-center">
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                Already identified?{' '}
                                <Link to="/login" className="text-primary-500 hover:text-white transition-colors border-b border-primary-500/20 hover:border-white pb-0.5">
                                    Authorise Session
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
