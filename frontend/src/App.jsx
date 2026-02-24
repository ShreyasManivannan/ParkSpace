import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import SpaceDetails from './pages/SpaceDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import CreateSpace from './pages/CreateSpace';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/Toaster';


function App() {
    const checkAuth = useAuthStore((state) => state.checkAuth);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <div className="min-h-screen bg-black text-white font-inter antialiased">
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="search" element={<Search />} />
                    <Route path="spaces/:id" element={<SpaceDetails />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="my-bookings" element={<MyBookings />} />
                    </Route>

                    {/* Owner Only Routes */}
                    <Route element={<ProtectedRoute requiredRole="OWNER" />}>
                        <Route path="create-space" element={<CreateSpace />} />
                    </Route>
                </Route>
            </Routes>
            <Toaster />
        </div>
    );
}

export default App;
