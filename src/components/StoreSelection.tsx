import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ArrowRight, ArrowLeft, Store as StoreIcon, X, Copy, Check, ExternalLink } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface Store {
    id: string;
    name: string;
    description: string;
    image_url: string;
    location: string;
    is_active: boolean;
    menu_image_url?: string;
    menu_image_2_url?: string;
    menu_image_3_url?: string;
    external_menu_url?: string;
}

interface StoreSelectionProps {
    onStoreSelect: (storeId: string) => void;
    onBack: () => void;
}

const fallbackStores: Store[] = [
    {
        id: 'example-store-1',
        name: "Daplash House Specialty",
        description: "Our very own kitchen serving the best local delicacies and home-cooked favorites.",
        image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
        location: "Naga City",
        is_active: true
    }
];

const StoreSelection: React.FC<StoreSelectionProps> = ({ onStoreSelect, onBack }) => {
    const { siteSettings } = useSiteSettings();
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStoreForMenu, setSelectedStoreForMenu] = useState<Store | null>(null);
    const [orderForm, setOrderForm] = useState({
        name: '',
        contact: '',
        address: '',
        orderDetails: ''
    });
    const [isCopied, setIsCopied] = useState(false);

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
                setStores(data && data.length > 0 ? data : fallbackStores);
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
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl sm:text-4xl md:text-6xl font-[1000] text-brand-charcoal uppercase tracking-tighter leading-none"
                        >
                            CHOOSE FROM <span className="text-brand-primary">STORES</span>
                        </motion.h2>
                        <p className="text-gray-500 font-medium text-sm sm:text-lg uppercase tracking-widest mt-2">Daplash partner products delivered to you</p>
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
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredStores.map((store, index) => (
                                <motion.div
                                    layout
                                    key={store.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -10 }}
                                    className="group bg-white rounded-2xl md:rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-brand-primary/10 transition-all cursor-pointer flex flex-col"
                                    onClick={() => setSelectedStoreForMenu(store)}
                                >
                                    <div className="h-40 md:h-56 relative overflow-hidden">
                                        <img
                                            src={store.image_url || 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=800'}
                                            alt={store.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                        <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
                                            <h3 className="text-base md:text-xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-brand-accent transition-colors">
                                                {store.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="p-4 md:p-8 flex flex-col flex-1">
                                        <div className="mt-auto">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest gap-2">
                                                    <MapPin size={12} className="text-brand-primary" />
                                                    <span className="truncate">{store.location || 'Local Area'}</span>
                                                </div>
                                            </div>
                                            <button
                                                className="w-full py-2.5 md:py-3 bg-brand-charcoal text-white rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-brand-primary transition-all duration-300"
                                            >
                                                <span className="hidden sm:inline">🛒</span>
                                                BOOK ORDER
                                            </button>
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

            {/* ═══════════ STORE MENU MODAL ═══════════ */}
            <AnimatePresence>
                {selectedStoreForMenu && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedStoreForMenu(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-[1000] text-brand-charcoal uppercase tracking-tighter">
                                        {selectedStoreForMenu.name}
                                    </h3>
                                    <p className="text-gray-500 font-bold text-xs sm:text-sm uppercase tracking-widest mt-1">View Menu & Place Order</p>
                                </div>
                                <button
                                    onClick={() => setSelectedStoreForMenu(null)}
                                    className="p-3 bg-gray-50 text-gray-400 hover:text-brand-charcoal hover:bg-gray-100 rounded-full transition-all"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
                                {/* 3-Image Menu Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="rounded-2xl md:rounded-3xl border-4 border-gray-50 overflow-hidden shadow-inner bg-gray-50 h-[300px] flex flex-col justify-center">
                                        {selectedStoreForMenu.menu_image_url ? (
                                            <img
                                                src={selectedStoreForMenu.menu_image_url}
                                                alt={`${selectedStoreForMenu.name} Menu 1`}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="text-center p-4">
                                                <StoreIcon size={32} className="mx-auto text-gray-200 mb-2" />
                                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Menu 1</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="rounded-2xl md:rounded-3xl border-4 border-gray-50 overflow-hidden shadow-inner bg-gray-50 h-[300px] flex flex-col justify-center">
                                        {selectedStoreForMenu.menu_image_2_url ? (
                                            <img
                                                src={selectedStoreForMenu.menu_image_2_url}
                                                alt={`${selectedStoreForMenu.name} Menu 2`}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="text-center p-4">
                                                <StoreIcon size={32} className="mx-auto text-gray-200 mb-2" />
                                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Menu 2</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="rounded-2xl md:rounded-3xl border-4 border-gray-50 overflow-hidden shadow-inner bg-gray-50 h-[300px] flex flex-col justify-center">
                                        {selectedStoreForMenu.menu_image_3_url ? (
                                            <img
                                                src={selectedStoreForMenu.menu_image_3_url}
                                                alt={`${selectedStoreForMenu.name} Menu 3`}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="text-center p-4">
                                                <StoreIcon size={32} className="mx-auto text-gray-200 mb-2" />
                                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Menu 3</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Other Menu Link */}
                                <div className="flex justify-center mt-2">
                                    <button
                                        onClick={(e) => {
                                            if (selectedStoreForMenu.external_menu_url) {
                                                window.open(selectedStoreForMenu.external_menu_url, '_blank', 'noopener,noreferrer');
                                            } else {
                                                alert("No external menu has been set for this store yet!");
                                            }
                                        }}
                                        className="px-8 py-4 bg-brand-charcoal text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 hover:bg-brand-primary transition-colors shadow-lg shadow-brand-charcoal/20"
                                    >
                                        <ExternalLink size={18} />
                                        SEE OTHER MENUS
                                    </button>
                                </div>

                                {/* Order Form */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="h-px flex-1 bg-gray-100"></div>
                                        <span className="text-xs font-black text-gray-300 uppercase tracking-[0.3em]">Fill Order Details</span>
                                        <div className="h-px flex-1 bg-gray-100"></div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">👤 Your Name</label>
                                            <input
                                                type="text"
                                                placeholder="ENTER FULL NAME"
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary font-bold placeholder:text-gray-300 transition-all"
                                                value={orderForm.name}
                                                onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">📞 Contact Number</label>
                                            <input
                                                type="text"
                                                placeholder="09XX XXX XXXX"
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary font-bold placeholder:text-gray-300 transition-all"
                                                value={orderForm.contact}
                                                onChange={(e) => setOrderForm({ ...orderForm, contact: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">📍 Delivery Address</label>
                                        <input
                                            type="text"
                                            placeholder="ENTER COMPLETE ADDRESS 📍"
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary font-bold placeholder:text-gray-300 transition-all"
                                            value={orderForm.address}
                                            onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">📝 What's your order?</label>
                                        <textarea
                                            placeholder="LIST YOUR ORDERS HERE (Example: 2 Signature Pizza 🍕)"
                                            rows={4}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary font-bold placeholder:text-gray-300 transition-all resize-none"
                                            value={orderForm.orderDetails}
                                            onChange={(e) => setOrderForm({ ...orderForm, orderDetails: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 sm:p-8 bg-gray-50/50 border-t border-gray-100 shrink-0">
                                <button
                                    onClick={() => {
                                        if (!orderForm.name || !orderForm.contact || !orderForm.address || !orderForm.orderDetails) {
                                            alert("Please fill up all delivery and order details first!");
                                            return;
                                        }
                                        const message = `DAPLASH DELIVERY - STORE ORDER\n\n` +
                                            `🏪 STORE: ${selectedStoreForMenu.name}\n` +
                                            `📝 ITEMS: ${orderForm.orderDetails}\n\n` +
                                            `👤 CUSTOMER: ${orderForm.name}\n` +
                                            `📞 CONTACT: ${orderForm.contact}\n` +
                                            `📍 ADDRESS: ${orderForm.address}`;

                                        const encodedMessage = encodeURIComponent(message);
                                        const messengerId = siteSettings?.messenger_id || '100064173395989';
                                        window.open(`https://m.me/${messengerId}?text=${encodedMessage}`, '_blank');
                                    }}
                                    className="w-full py-5 bg-brand-primary text-white rounded-3xl font-black text-lg sm:text-xl uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mb-4"
                                >
                                    <span>📩</span>
                                    Send order thru Messenger
                                </button>

                                {/* Cancellation Policy */}
                                <div className="mb-4 p-4 bg-orange-50 rounded-2xl border border-orange-100/50 flex items-start gap-3">
                                    <AlertCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest mb-1">Cancellation Policy</p>
                                        <p className="text-[11px] font-medium text-orange-600 leading-relaxed">
                                            A ₱40 fee applies if the rider has arrived at the pickup point. This compensates for the rider's travel and effort.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={async () => {
                                        if (!orderForm.name || !orderForm.contact || !orderForm.address || !orderForm.orderDetails) {
                                            alert("Please fill up all delivery and order details first!");
                                            return;
                                        }
                                        const message = `DAPLASH DELIVERY - STORE ORDER\n\n` +
                                            `🏪 STORE: ${selectedStoreForMenu.name}\n` +
                                            `📝 ITEMS: ${orderForm.orderDetails}\n\n` +
                                            `👤 CUSTOMER: ${orderForm.name}\n` +
                                            `📞 CONTACT: ${orderForm.contact}\n` +
                                            `📍 ADDRESS: ${orderForm.address}`;

                                        try {
                                            await navigator.clipboard.writeText(message);
                                            setIsCopied(true);
                                            setTimeout(() => setIsCopied(false), 2000);
                                        } catch (err) {
                                            console.error('Failed to copy text: ', err);
                                            alert('Failed to copy text. Please try again.');
                                        }
                                    }}
                                    className={`w-full py-4 rounded-3xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 mt-4 border-2 ${isCopied
                                        ? 'bg-green-50 border-green-500 text-green-600'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-brand-primary hover:text-brand-primary'
                                        }`}
                                >
                                    {isCopied ? (
                                        <>
                                            <Check size={18} />
                                            <span>Copied to Clipboard!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={18} />
                                            <span>Copy Details</span>
                                        </>
                                    )}
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default StoreSelection;
