import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';

export const useAuthStore = create()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: true,

            login: async (email, password) => {
                const response = await api.post('/auth/login', { email, password });
                const { user, token } = response.data.data;
                set({ user, token });
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            },

            register: async (data) => {
                const response = await api.post('/auth/register', data);
                const { user, token } = response.data.data;
                set({ user, token });
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            },

            logout: () => {
                set({ user: null, token: null });
                delete api.defaults.headers.common['Authorization'];
            },

            checkAuth: async () => {
                const token = get().token;
                if (!token) {
                    set({ isLoading: false });
                    return;
                }

                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await api.get('/auth/me');
                    set({ user: response.data.data.user, isLoading: false });
                } catch {
                    set({ user: null, token: null, isLoading: false });
                    delete api.defaults.headers.common['Authorization'];
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token }),
        }
    )
);
