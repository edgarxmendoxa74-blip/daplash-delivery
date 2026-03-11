import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Using a predefined admin email in the background
        const { error } = await supabase.auth.signInWithPassword({
            email: 'admin@daplash.com',
            password: password
        });

        if (error) {
            // Log for dev tools
            console.error("Login Error:", error);

            if (error.message.includes("Email not confirmed")) {
                setError("Email not confirmed. Go to Supabase > Auth > Users and click 'Confirm' on admin@daplash.com");
            } else {
                // Show raw error if credentials fail to help debugging
                setError(`${error.message}. (Using: admin@daplash.com)`);
            }
            setLoading(false);
        } else {
            navigate('/admin/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-outfit">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 sm:p-12 border border-gray-100"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-daplash-yellow rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-daplash-yellow/20">
                        <Lock size={32} className="text-daplash-dark" />
                    </div>
                    <h1 className="text-3xl font-black text-daplash-dark tracking-tight">ADMIN <span className="text-daplash-blue">PORTAL</span></h1>
                    <p className="text-gray-500 mt-2 font-medium">Enter password to manage site</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center space-x-3 text-sm font-bold border border-red-100">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Admin Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-daplash-yellow outline-none font-bold transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-daplash-dark text-white font-black rounded-2xl shadow-xl shadow-gray-200 flex items-center justify-center space-x-3 hover:bg-daplash-blue transition-all group disabled:opacity-50"
                    >
                        <span>{loading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}</span>
                        {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                    <button
                        onClick={async () => {
                            setLoading(true);
                            const { error } = await supabase.auth.signUp({
                                email: 'admin@daplash.com',
                                password: password || 'Daplash2026!'
                            });
                            if (error) {
                                setError(error.message);
                            } else {
                                setError("Admin Account Initialized! Now try logging in.");
                            }
                            setLoading(false);
                        }}
                        className="text-xs font-black text-gray-400 hover:text-daplash-yellow uppercase tracking-widest transition-colors block w-full"
                    >
                        First time? Initialize Admin Account
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm font-black text-gray-400 hover:text-daplash-blue uppercase tracking-widest transition-colors"
                    >
                        ← Back to Website
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
