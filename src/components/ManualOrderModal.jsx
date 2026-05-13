import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MapPin, User, Utensils, Phone } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../hooks/useSiteSettings';

const ManualOrderModal = ({ isOpen, onClose, onConfirm }) => {
    const { siteSettings } = useSiteSettings();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        orderDetails: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase.from('manual_orders').insert({
                customer_name: formData.name,
                contact_number: formData.phone,
                address: formData.address,
                order_details: formData.orderDetails,
                status: 'pending'
            });

            if (error) throw error;

            if (onConfirm) onConfirm(formData);

            // Send to Messenger
            const message = `✨ Daplash Manual Order
            
👤 Name: ${formData.name}
📞 Phone: ${formData.phone}
📍 Address: ${formData.address}

📝 Order Details:
${formData.orderDetails}

Please confirm this manual order. Thank you! 🛵`;

            const encodedMessage = encodeURIComponent(message);
            const messengerId = siteSettings?.messenger_id || '100064173395989';
            window.open(`https://m.me/${messengerId}?text=${encodedMessage}`, '_blank');

            onClose();
        } catch (err) {
            console.error('Error saving manual order:', err);
            alert('Failed to save order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 font-outfit">
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
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-accent shadow-sm">
                                    <Utensils size={28} />
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-brand-charcoal tracking-tight leading-none uppercase">
                                        MANUAL <span className="text-white">ORDER</span>
                                    </h2>
                                    <p className="text-[10px] font-bold text-brand-charcoal/60 uppercase tracking-widest mt-1">Tell us what you want</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-brand-charcoal transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">What are you craving?</label>
                                <textarea
                                    required
                                    name="orderDetails"
                                    value={formData.orderDetails}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none font-bold min-h-[120px]"
                                    placeholder="List the items, store name, or any specific cravings you have..."
                                ></textarea>
                            </div>

                            {/* Customer Fields */}
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Your Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input required name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none font-bold" placeholder="Full name" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none font-bold" placeholder="09XX XXX XXXX" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input required name="address" value={formData.address} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none font-bold" placeholder="Complete address & landmark" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-brand-primary text-white font-black rounded-2xl shadow-lg shadow-brand-primary/30 flex items-center justify-center space-x-2 hover:bg-brand-secondary transition-colors mt-6 group disabled:opacity-50"
                            >
                                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                <span>{isSubmitting ? 'SUBMITTING...' : 'SEND VIA MESSENGER'}</span>
                            </button>
                            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                Your order will be stored and sent to our Messenger
                            </p>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ManualOrderModal;
