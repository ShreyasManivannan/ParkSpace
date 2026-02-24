import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, DollarSign, FileText, Image, ArrowLeft, Check, Sparkles, ShieldCheck, Info } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../components/ui/Toaster';

export default function CreateSpace() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        pricePerHour: '',
        latitude: '',
        longitude: '',
        imageUrl: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.post('/spaces', {
                ...formData,
                pricePerHour: parseFloat(formData.pricePerHour),
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                imageUrl: formData.imageUrl || undefined,
            });

            addToast('success', 'ASSET INITIALISED. Node is now online.');
            navigate('/dashboard');
        } catch (error) {
            addToast('error', error.response?.data?.message || 'Deployment failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-black selection:bg-primary-500/30 overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 bg-hero-pattern opacity-40 -z-10" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)] -z-10" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 pb-8 border-b border-white/5"
                >
                    <div className="space-y-2">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-400 hover:text-white transition-colors mb-4 group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            Return to hub
                        </button>
                        <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">List <span className="text-transparent bg-clip-text bg-neon-gradient">Space</span></h1>
                        <p className="text-gray-500 font-medium">Register your parking asset on the global secure network.</p>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-10">
                    {/* Guidance Sidebar */}
                    <div className="md:col-span-1 space-y-6">
                        {[
                            { icon: ShieldCheck, title: 'Network Security', desc: 'All assets undergo automated verification.' },
                            { icon: Sparkles, title: 'Premium Design', desc: 'Use high-resolution imagery for better reach.' },
                            { icon: Info, title: 'Geospatial', desc: 'Precise coordinates ensure accurate mapping.' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass !bg-white/[0.02] border border-white/5 p-6 !rounded-[2rem] group"
                            >
                                <item.icon className="w-6 h-6 text-primary-500 mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1">{item.title}</h3>
                                <p className="text-[10px] text-gray-500 font-medium leading-relaxed uppercase">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Form Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-2"
                    >
                        <form onSubmit={handleSubmit} className="glass !bg-white/[0.03] border border-white/10 p-10 !rounded-[3rem] shadow-2xl relative overflow-hidden glass-shine">
                            <div className="space-y-8 relative z-10">
                                {/* Title */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 ml-1">
                                        <FileText className="w-3.5 h-3.5" /> Asset Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="input !rounded-2xl !bg-black/40 focus:!bg-black/60 !border-white/5 focus:!border-primary-500/30 transition-all font-medium py-5"
                                        placeholder="E.g., Downtown Executive Skyway"
                                    />
                                </div>

                                {/* Address */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 ml-1">
                                        <MapPin className="w-3.5 h-3.5" /> Global Address
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="input !rounded-2xl !bg-black/40 focus:!bg-black/60 !border-white/5 focus:!border-primary-500/30 transition-all font-medium py-5"
                                        placeholder="Full street address and city"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Price */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 ml-1">
                                            <DollarSign className="w-3.5 h-3.5" /> Hourly Fee
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-500/60 font-black">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.pricePerHour}
                                                onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                                                className="input !pl-10 !rounded-2xl !bg-black/40 focus:!bg-black/60 !border-white/5 focus:!border-primary-500/30 transition-all font-medium py-5"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    {/* Image URL */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 ml-1">
                                            <Image className="w-3.5 h-3.5" /> Asset Media (URL)
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            className="input !rounded-2xl !bg-black/40 focus:!bg-black/60 !border-white/5 focus:!border-primary-500/30 transition-all font-medium py-5 text-sm"
                                            placeholder="https://images.com/park.jpg"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Latitude */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 ml-1">Latitude</label>
                                        <input
                                            type="number"
                                            step="0.000001"
                                            required
                                            value={formData.latitude}
                                            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                            className="input !rounded-2xl !bg-black/40 focus:!bg-black/60 !border-white/5 focus:!border-primary-500/30 transition-all font-medium py-5 text-sm"
                                            placeholder="40.7128"
                                        />
                                    </div>
                                    {/* Longitude */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 ml-1">Longitude</label>
                                        <input
                                            type="number"
                                            step="0.000001"
                                            required
                                            value={formData.longitude}
                                            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                            className="input !rounded-2xl !bg-black/40 focus:!bg-black/60 !border-white/5 focus:!border-primary-500/30 transition-all font-medium py-5 text-sm"
                                            placeholder="-74.0060"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 ml-1">Operational Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="input !rounded-2xl !bg-black/40 focus:!bg-black/60 !border-white/5 focus:!border-primary-500/30 transition-all font-medium py-5 min-h-[120px] resize-none"
                                        placeholder="Describe security protocols, entry methods, and accessibility features..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-primary w-full py-6 !rounded-2xl shadow-neon relative overflow-hidden group mt-4"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <div className="relative flex items-center justify-center gap-3">
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span className="font-black text-xs uppercase tracking-[0.2em]">Deploy Asset</span>
                                                <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
