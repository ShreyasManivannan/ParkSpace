import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { create } from 'zustand';

export const useToast = create((set) => ({
    toasts: [],
    addToast: (type, message) => {
        const id = Date.now().toString();
        set((state) => ({
            toasts: [...state.toasts, { id, type, message }],
        }));
        // Auto-remove after 5 seconds
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id),
            }));
        }, 5000);
    },
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),
}));

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
};

const colors = {
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
    info: 'bg-primary-500/10 border-primary-500/20 text-primary-400',
};

export function Toaster() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => {
                    const Icon = icons[toast.type];
                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl ${colors[toast.type]}`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
