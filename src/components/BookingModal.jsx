import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MapPin, User, ShoppingCart, Package, Utensils, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

const BookingModal = ({ isOpen, onClose, onConfirm, item }) => {
    if (!item) return null;

    const [formData, setFormData] = useState({
        quantity: 1,
        instructions: '',
        address: '',
        phone: '',
        name: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const totalPrice = item.price * (formData.quantity || 1);

        // Save to Supabase
        try {
            await supabase.from('food_orders').insert({
                item_name: item.name,
                item_price: item.price,
                quantity: formData.quantity || 1,
                total_price: totalPrice,
                instructions: formData.instructions || null,
                customer_name: formData.name,
                contact_number: formData.phone,
                address: formData.address,
                status: 'pending'
            });
        } catch (err) {
            console.error('Error saving food order:', err);
        }

        onConfirm({ ...formData, itemName: item.name, price: item.price });

        // Also send to Messenger
        const message = `🍔 Daplash Food Order

📋 Item: ${item.name}
🔢 Qty: ${formData.quantity}
💰 Total: ₱${totalPrice}
${formData.instructions ? `📝 Note: ${formData.instructions}\n` : ''}
━━━━━━━━━━━━━━━━━━
👤 Name: ${formData.name}
📞 Phone: ${formData.phone}
📍 Address: ${formData.address}

Please confirm this food order. Thank you! 🛵`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://m.me/100064173395989?text=${encodedMessage}`, '_blank');

        setIsSubmitting(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-outfit">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-brand-accent to-yellow-400 p-6 sm:p-8 flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-white rounded-2xl overflow-hidden shadow-sm">
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-brand-charcoal tracking-tight leading-none uppercase">
                                        ORDER <span className="text-white">NOW</span>
                                    </h2>
                                    <p className="text-[10px] font-bold text-brand-charcoal/60 uppercase tracking-widest mt-1">{item.name}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-brand-charcoal transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        min="1"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Price Total</label>
                                    <div className="w-full px-4 py-3 bg-blue-50 text-brand-primary rounded-xl font-black flex items-center">
                                        ₱{item.price * (formData.quantity || 1)}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Special Instructions</label>
                                <textarea name="instructions" onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none font-bold min-h-[80px]" placeholder="Ex: No onions, spicy please..."></textarea>
                            </div>

                            {/* Customer Fields */}
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Your Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input required name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none font-bold" placeholder="Your full name" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input required name="address" value={formData.address} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none font-bold" placeholder="Where to deliver?" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none font-bold" placeholder="09XX XXX XXXX" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-brand-primary text-white font-black rounded-2xl shadow-lg shadow-brand-primary/30 flex items-center justify-center space-x-3 hover:bg-brand-secondary transition-colors mt-8 group disabled:opacity-50"
                            >
                                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                <span>{isSubmitting ? 'SUBMITTING...' : 'CONFIRM BOOKING'}</span>
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BookingModal;
