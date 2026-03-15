import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ArrowRight, ArrowLeft, Store as StoreIcon } from 'lucide-react';

interface Store {
    id: string;
    name: string;
    description: string;
    image_url: string;
    location: string;
    is_active: boolean;
}

interface StoreSelectionProps {
    onStoreSelect: (storeId: string) => void;
    onBack: () => void;
}

const StoreSelection: React.FC<StoreSelectionProps> = ({ onStoreSelect, onBack }) => {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStores = async () => {
            const { data, error } = await supabase
                .from('stores')
                .select('*')
                .eq('is_active', true)
                .order('order_index');

            if (error) {
                console.error('Error fetching stores:', error);
            } else {
                setStores(data || []);
            }
            setLoading(false);
        };

        fetchStores();
    }, []);

    const filteredStores = stores.filter(store =>
        (store.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (store.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <section className="pt-32 sm:pt-24 pb-16 sm:pb-24 bg-brand-light/20 min-h-screen font-outfit">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="w-full">
                        <button
                            onClick={onBack}
                            className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200 mb-6"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="text-sm font-bold uppercase tracking-wider">Back to Services</span>
                        </button>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl sm:text-4xl md:text-6xl font-[1000] text-brand-charcoal uppercase tracking-tighter leading-none"
                        >
                            CHOOSE A <span className="text-brand-primary">STORE</span>
                        </motion.h2>
                        <p className="text-gray-500 font-medium text-sm sm:text-lg uppercase tracking-widest mt-2">Daplash partner stores delivered to you</p>
                    </div>

                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="SEARCH FOR STORES..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-full outline-none focus:ring-2 focus:ring-brand-primary font-bold shadow-sm transition-all text-brand-charcoal"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-primary border-t-transparent"></div>
                    </div>
                ) : filteredStores.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-gray-100">
                        <StoreIcon size={64} className="mx-auto text-gray-200 mb-4" />
                        <h4 className="text-2xl font-black text-brand-charcoal">No stores found</h4>
                        <p className="text-gray-500 font-medium mt-2">Try searching for a different shop or name.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredStores.map((store, index) => (
                                <motion.div
                                    layout
                                    key={store.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -10 }}
                                    className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-brand-primary/10 transition-all cursor-pointer flex flex-col"
                                    onClick={() => onStoreSelect(store.id)}
                                >
                                    <div className="h-56 relative overflow-hidden">
                                        <img
                                            src={store.image_url || 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=800'}
                                            alt={store.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-brand-accent transition-colors">
                                                {store.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-1">
                                        <p className="text-gray-500 text-sm font-medium mb-6 line-clamp-2 leading-relaxed italic border-l-2 border-brand-accent/50 pl-3">
                                            "{store.description || 'Quality selection from our local partners.'}"
                                        </p>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-widest gap-2">
                                                <MapPin size={14} className="text-brand-primary" />
                                                {store.location || 'Local Area'}
                                            </div>
                                            <div className="w-10 h-10 bg-brand-light flex items-center justify-center rounded-full text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-inner">
                                                <ArrowRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                <div className="mt-16 flex justify-center">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-12 py-4 bg-white border-2 border-brand-primary text-brand-primary rounded-full text-lg font-bold shadow-lg shadow-brand-primary/10 hover:bg-brand-primary hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3"
                    >
                        <span>🏠</span>
                        BACK TO HOME
                    </button>
                </div>
            </div>
        </section>
    );
};

export default StoreSelection;
