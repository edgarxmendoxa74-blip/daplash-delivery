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

const Menu = ({ onOrder }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchMenu = async () => {
            const { data } = await supabase
                .from('menu_items')
                .select('*')
                .order('order_index');

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
        <section id="menu" className="pt-32 pb-24 bg-white font-outfit">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-6xl font-[1000] text-daplash-dark leading-none uppercase tracking-tighter mb-4"
                    >
                        OUR <span className="text-daplash-blue">MENU</span>
                    </motion.h2>
                    <p className="text-gray-500 font-medium text-lg uppercase tracking-widest">Taste the excellence in every bite</p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-8 py-3 rounded-full font-black text-sm transition-all uppercase tracking-widest ${activeCategory === cat ? 'bg-daplash-dark text-white shadow-xl shadow-gray-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="SEARCH CRUNCHY DISHES..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-full outline-none focus:ring-2 focus:ring-daplash-yellow font-bold text-sm transition-all"
                        />
                    </div>
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item, index) => (
                            <motion.div
                                layout
                                key={item.id || index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-daplash-blue/10 transition-all highlight-border flex flex-col"
                            >
                                <div className="h-64 relative overflow-hidden">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-daplash-blue">
                                        {item.category}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-black text-daplash-dark leading-tight tracking-tight uppercase group-hover:text-daplash-blue transition-colors">{item.name}</h3>
                                        <span className="text-xl font-black text-daplash-blue tracking-tighter self-start">₱{item.price}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-8 leading-relaxed italic border-l-2 border-daplash-yellow/30 pl-3">
                                        "{item.description}"
                                    </p>
                                    <button
                                        onClick={() => onOrder(item)}
                                        className="mt-auto w-full py-4 bg-daplash-yellow text-daplash-dark font-black rounded-2xl flex items-center justify-center space-x-3 hover:bg-daplash-dark hover:text-white transition-all transform hover:-translate-y-1 shadow-lg shadow-daplash-yellow/20 group-hover:shadow-daplash-dark/20"
                                    >
                                        <ShoppingCart size={20} />
                                        <span className="uppercase text-sm tracking-widest">Add to Order</span>
                                        <Zap size={14} className="fill-current" />
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
                        <h4 className="text-2xl font-black text-daplash-dark">No dishes found</h4>
                        <p className="text-gray-500 font-medium">Try searching for something else or change the category.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Menu;
