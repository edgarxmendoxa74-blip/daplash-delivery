import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Utensils, Box, ShoppingCart, ShoppingBag, Zap, ShieldCheck } from 'lucide-react';

const fallbackServices = [
    {
        title: "Food Delivery",
        description: "Cravings satisfied! Favorite local restaurants to your doorstep.",
        icon: <Utensils className="text-daplash-blue" size={32} />,
        color: "bg-blue-50",
        features: ["Flat Rate", "Hot & Fresh", "Cash on Delivery"]
    },
    {
        title: "Parcel & Docs",
        description: "Fast and secure transport for important papers and packages.",
        icon: <Box className="text-daplash-yellow" size={32} />,
        color: "bg-yellow-50",
        features: ["Secure Handling", "Real-time Tracking", "P2P Delivery"]
    },
    {
        title: "Grocery",
        description: "No time for the market? We'll handle your grocery list.",
        icon: <ShoppingCart className="text-daplash-blue" size={32} />,
        color: "bg-blue-50",
        features: ["Fresh Items", "Custom List", "Weight Checks"]
    },
    {
        title: "Pabili Service",
        description: "Need something from the store? We'll buy it for you.",
        icon: <ShoppingBag className="text-daplash-yellow" size={32} />,
        color: "bg-yellow-50",
        features: ["Errand Runner", "Store Picking", "Item Matching"]
    },
    {
        title: "Pasakay Service",
        description: "Safe & fast motorcycle ride for your travel needs.",
        icon: <Zap className="text-daplash-yellow" size={32} />,
        color: "bg-yellow-50",
        features: ["Professional Rider", "Safety Helmet", "Fast Transit"]
    }
];

const Services = ({ onBook }) => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('order_index');

            if (data && data.length > 0) {
                // Map the DB data to match the UI requirements (e.g., adding back icons based on title)
                const mappedServices = data.map(s => ({
                    ...s,
                    icon: getIconForService(s.icon_name || s.title)
                }));
                setServices(mappedServices);
            } else {
                setServices(fallbackServices);
            }
        };

        fetchServices();
    }, []);

    const getIconForService = (identifier) => {
        const id = identifier?.toLowerCase();
        if (id === 'food' || id === 'food delivery') return <Utensils className="text-daplash-blue" size={32} />;
        if (id === 'parcel' || id === 'parcel & docs') return <Box className="text-daplash-yellow" size={32} />;
        if (id === 'grocery') return <ShoppingCart className="text-daplash-blue" size={32} />;
        if (id === 'pabili' || id === 'pabili service') return <ShoppingBag className="text-daplash-yellow" size={32} />;
        if (id === 'pasakay' || id === 'pasakay service') return <Zap className="text-daplash-yellow" size={32} />;
        return <Zap className="text-daplash-blue" size={32} />;
    };
    return (
        <section id="services" className="pt-32 pb-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-5xl font-[1000] text-daplash-dark leading-none uppercase tracking-tighter"
                    >
                        CHOOSE <span className="text-daplash-blue">SERVICES</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-3 sm:p-5 rounded-2xl sm:rounded-[2rem] border border-gray-100 bg-white hover:bg-gradient-to-b hover:from-white hover:to-gray-50/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-daplash-blue/5 relative overflow-hidden flex flex-col highlight-border"
                        >
                            {/* Decorative Background Shape */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="relative mb-4 sm:mb-8">
                                <div className={`w-10 h-10 sm:w-14 sm:h-14 ${service.color} rounded-xl sm:rounded-2xl flex items-center justify-center relative group-hover:rotate-6 transition-transform duration-500`}>
                                    {/* Inner Glow/Shadow */}
                                    <div className="absolute inset-0 bg-white/20 rounded-xl sm:rounded-2xl scale-75 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10 filter drop-shadow-md">
                                        {/* Scale icon for mobile */}
                                        <div className="scale-[0.6] sm:scale-75">
                                            {service.icon}
                                        </div>
                                    </div>
                                    {/* Accent Ring */}
                                    <div className={`absolute -inset-1 border-2 border-transparent group-hover:border-current opacity-20 rounded-xl sm:rounded-[1.8rem] transition-all duration-500 group-hover:scale-105`}></div>
                                </div>
                            </div>

                            <h3 className="text-xs sm:text-xl font-black text-daplash-dark mb-1.5 sm:mb-3 tracking-tight leading-tight group-hover:text-daplash-blue transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-[9px] sm:text-sm text-gray-500 leading-tight sm:leading-relaxed mb-3 sm:mb-5 font-medium line-clamp-2 sm:line-clamp-none">
                                {service.description}
                            </p>

                            {/* Features List */}
                            <ul className="space-y-1 sm:space-y-1.5 mb-4 sm:mb-6">
                                {service.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-center space-x-1.5 sm:space-x-2 text-[8px] sm:text-xs text-gray-400 font-semibold group/item">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-daplash-yellow group-hover/item:scale-125 transition-transform"></div>
                                        <span className="group-hover/item:text-daplash-blue transition-colors">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto">
                                <button
                                    onClick={() => onBook(service)}
                                    className="w-full inline-flex items-center justify-center space-x-1 sm:space-x-2 py-1.5 sm:py-3 px-2 sm:px-6 bg-daplash-yellow text-daplash-dark font-black rounded-lg sm:rounded-xl hover:bg-daplash-blue hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-daplash-yellow/30 hover:shadow-daplash-blue/30"
                                >
                                    <span className="text-[9px] sm:text-sm">Book Now</span>
                                    <Zap size={10} className="sm:w-4 sm:h-4 fill-current" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Services;
