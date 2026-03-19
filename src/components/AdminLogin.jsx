import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { siteSettings } = useSiteSettings();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email: email || 'admin@daplash.com',
            password: password
        });

        if (error) {
            setError(error.message + " (Attempted: " + (email || 'admin@daplash.com') + ")");
        } else {
            navigate('/admin/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 font-outfit relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[440px] relative z-10"
            >
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <div className="inline-block p-1 bg-white/5 backdrop-blur-xl rounded-full border-2 border-brand-accent mb-6 shadow-2xl overflow-hidden">
                        <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg shadow-brand-primary/20 bg-brand-accent flex items-center justify-center">
                            {siteSettings?.site_logo ? (
                                <img
                                    src={siteSettings.site_logo}
                                    alt="Daplash Logo"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl font-black text-brand-charcoal">D</span>
                            )}
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
                        DAPLASH <span className="text-brand-primary">DELIVERY</span>
                    </h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Admin Login</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/[0.03] backdrop-blur-2xl p-8 sm:p-10 rounded-[3rem] border border-white/10 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Admin Identity</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors">
                                        <Shield size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all placeholder:text-gray-700"
                                        placeholder="Enter admin email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Security Key</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all placeholder:text-gray-700"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-brand-primary hover:bg-brand-primary/90 text-white font-black rounded-2xl shadow-xl shadow-brand-primary/20 transition-all transform active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
                        >
                            <span className="uppercase tracking-widest text-sm">{loading ? 'Verifying...' : 'Initialize Access'}</span>
                            {!loading && <span className="group-hover:translate-x-1 transition-transform">→</span>}
                        </button>
                    </form>

                    {/* Secondary Actions */}
                    <div className="mt-12 text-center space-y-6 border-t border-white/5 pt-10">
                        <button
                            onClick={async () => {
                                setLoading(true);
                                const { error } = await supabase.auth.signUp({
                                    email: email || 'admin@daplash.com',
                                    password: password || 'Daplash2026!'
                                });
                                if (error) {
                                    setError(error.message);
                                } else {
                                    setError("Access protocols initialized. Proceed to login.");
                                }
                                setLoading(false);
                            }}
                            className="text-[10px] font-black text-gray-600 hover:text-brand-primary uppercase tracking-[0.2em] transition-colors block w-full"
                        >
                            Request Core Initialization
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="text-[10px] font-black text-gray-600 hover:text-brand-primary uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 group mx-auto"
                        >
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Public Interface
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
