import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Filter, Plus, Zap } from 'lucide-react';

const fallbackMenu = [
    {
        name: "Daplash Signature Pizza",
        description: "Freshly baked dough with our secret tomato sauce and premium mozzarella.",
        price: 299,
        category: "Pizza",
        image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Classic Cheese Burger",
        description: "Quarter pounder pure beef patty with melting cheddar and house sauce.",
        price: 149,
        category: "Burgers",
        image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Creamy Carbonara",
        description: "Authentic Italian style pasta with white sauce and crispy bacon.",
        price: 189,
        category: "Pasta",
        image_url: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Iced Caramel Macchiato",
        description: "Freshly brewed espresso with steamed milk and sweet caramel drizzle.",
        price: 110,
        category: "Drinks",
        image_url: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=800"
    }
];

const Menu = ({ onOrder, onOpenManualOrder, storeId, onBackToStores }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchMenu = async () => {
            let finalQuery = supabase
                .from('menu_items')
                .select('*');

            if (storeId) {
                finalQuery = finalQuery.eq('store_id', storeId);
            }

            const { data } = await finalQuery.order('order_index');

            if (data && data.length > 0) {
                setMenuItems(data);
                const uniqueCategories = ['All', ...new Set(data.map(item => item.category))];
                setCategories(uniqueCategories);
            } else {
                setMenuItems(fallbackMenu);
                setCategories(['All', 'Pizza', 'Burgers', 'Pasta', 'Drinks']);
            }
        };

        fetchMenu();
    }, []);

    const filteredItems = menuItems.filter(item => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <section id="menu" className="pt-32 sm:pt-24 pb-24 bg-white font-outfit">
            <div className="container mx-auto px-6">
                <button
                    onClick={onBackToStores}
                    className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200 mb-6"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">Back to Stores</span>
                </button>

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl md:text-6xl font-[1000] text-brand-charcoal leading-none uppercase tracking-tighter mb-4"
                    >
                        OUR <span className="text-green-primary">MENU</span>
                    </motion.h2>
                    <p className="text-gray-500 font-medium text-sm sm:text-lg uppercase tracking-widest mt-2">Taste the excellence in every bite</p>
                </div>

                {/* Actions & Search */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
                    <div className="flex flex-col sm:flex-row justify-center gap-3 w-full lg:w-auto">
                        <button
                            onClick={onOpenManualOrder}
                            className="inline-flex items-center justify-center space-x-2 px-6 py-4 lg:py-3 rounded-full bg-brand-accent text-brand-charcoal text-sm font-black uppercase tracking-widest shadow-lg hover:bg-yellow-400 transition-colors duration-200 w-full sm:w-auto"
                        >
                            <Plus size={16} />
                            <span>Manual Order</span>
                        </button>
                        <p className="text-gray-400 text-xs text-center sm:text-left mt-1 px-2">Can't find what you're craving? Book here and we'll take care of it — delivered fast to your door!</p>
                    </div>
                    <div className="relative w-full lg:max-w-sm">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="SEARCH CRUNCHY DISHES..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-full outline-none focus:ring-2 focus:ring-brand-primary font-bold text-sm transition-all text-brand-charcoal"
                        />
                    </div>
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item, index) => (
                            <motion.div
                                layout
                                key={item.id || index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className="group bg-white rounded-2xl md:rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-green-primary/10 transition-all flex flex-col"
                            >
                                <div className="h-40 md:h-64 relative overflow-hidden">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 md:top-6 left-4 md:left-6 px-3 md:px-4 py-1 md:py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest text-green-primary">
                                        {item.category}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="p-4 md:p-8 flex flex-col flex-1">
                                    <div className="flex flex-col mb-2">
                                        <h3 className="text-sm md:text-xl font-black text-brand-charcoal leading-tight tracking-tight uppercase group-hover:text-green-primary transition-colors line-clamp-1">{item.name}</h3>
                                        <span className="text-lg md:text-xl font-black text-green-primary tracking-tighter">₱{item.price}</span>
                                    </div>
                                    <p className="text-gray-500 text-[10px] md:text-sm font-medium line-clamp-2 mb-4 md:mb-8 leading-relaxed italic border-l-2 border-brand-accent/50 pl-2 md:pl-3">
                                        "{item.description || 'Our chef\'s special creation.'}"
                                    </p>
                                    <button
                                        onClick={() => onOrder(item)}
                                        className="mt-auto w-full py-2.5 md:py-4 bg-green-primary text-white font-black rounded-xl md:rounded-2xl flex items-center justify-center space-x-2 md:space-x-3 hover:bg-green-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-green-primary/30 group-hover:shadow-green-dark/20"
                                    >
                                        <ShoppingCart size={16} />
                                        <span className="uppercase text-[10px] md:text-sm tracking-widest">Order</span>
                                        <Zap size={12} className="hidden sm:inline fill-current text-brand-accent" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <Filter size={40} />
                        </div>
                        <h4 className="text-2xl font-black text-brand-charcoal">No dishes found</h4>
                        <p className="text-gray-500 font-medium">Try searching for something else or change the category.</p>
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

export default Menu;
