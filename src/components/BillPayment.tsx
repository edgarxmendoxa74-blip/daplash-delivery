import React, { useState } from 'react';
import { ArrowLeft, CreditCard, User, Hash, DollarSign, Phone, Send, Copy, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface BillPaymentProps {
    onBack: () => void;
}

const BillPayment: React.FC<BillPaymentProps> = ({ onBack }) => {
    const { siteSettings } = useSiteSettings();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const [formData, setFormData] = useState({
        biller_name: '',
        account_number: '',
        account_name: '',
        amount: '',
        contact_number: '',
        notes: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateMessageText = () => {
        return `*Bills Payment Request*

🏢 *Biller:* ${formData.biller_name}
🔢 *Account Number:* ${formData.account_number}
👤 *Account Name:* ${formData.account_name}
💰 *Amount:* ₱${parseFloat(formData.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}

📱 *Contact:* ${formData.contact_number}

${formData.notes ? `📝 *Notes:* ${formData.notes}\n` : ''}
Please process this payment request. Thank you!`;
    };

    const copyToClipboard = () => {
        const text = generateMessageText();
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const openMessenger = async () => {
        if (!formData.biller_name || !formData.account_number || !formData.account_name || !formData.amount || !formData.contact_number) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            // We can also save this to a 'bill_payments' table if needed later
            // For now, we'll just open Messenger
            const message = generateMessageText();
            const encodedMessage = encodeURIComponent(message);
            const messengerId = siteSettings?.messenger_id || '100064173395989';
            const messengerUrl = `https://m.me/${messengerId}?text=${encodedMessage}`;
            window.open(messengerUrl, '_blank');
        } catch (error) {
            console.error('Error opening Messenger:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 pt-32 sm:pt-24 pb-12">


            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-brand-primary p-8 text-white text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <span className="text-4xl">💰</span>
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Pay Bills</h1>
                    <p className="text-white/80 font-medium">Fast and convenient bills payment service</p>
                </div>

                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Biller Info */}
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    Biller Information
                                </label>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="biller_name"
                                        value={formData.biller_name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                                        placeholder="Biller Name (e.g. Meralco, Nawasa) *"
                                        required
                                    />
                                    <div className="relative">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            name="account_number"
                                            value={formData.account_number}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                                            placeholder="Account Number *"
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            name="account_name"
                                            value={formData.account_name}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                                            placeholder="Account Name *"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Amount & Contact */}
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Payment Details
                                </label>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₱</span>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                                            placeholder="Amount to Pay *"
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="tel"
                                            name="contact_number"
                                            value={formData.contact_number}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                                            placeholder="Contact Number *"
                                            required
                                        />
                                    </div>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                                        placeholder="Additional Notes (Optional)"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Request Preview</h3>
                            <button
                                onClick={copyToClipboard}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${copySuccess ? 'bg-green-500 text-white' : 'bg-white text-brand-charcoal hover:bg-gray-100 border border-gray-200'}`}
                            >
                                {copySuccess ? <span>Copied!</span> : <><Copy className="h-4 w-4" /> Copy text</>}
                            </button>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 font-mono text-sm whitespace-pre-wrap text-gray-600 shadow-inner">
                            {generateMessageText()}
                        </div>
                    </div>

                    {/* Cancellation Policy */}
                    <div className="mb-3 p-2.5 bg-orange-50 rounded-xl border border-orange-100/50 flex items-start gap-2">
                        <AlertCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[9px] font-black text-orange-700 uppercase tracking-widest mb-0.5">Cancellation Policy</p>
                            <p className="text-[10px] font-medium text-orange-600 leading-relaxed">
                                A ₱40 fee applies if the rider has arrived at the pickup point. This compensates for the rider's travel and effort.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            onClick={copyToClipboard}
                            className="w-full py-3 bg-white border-2 border-brand-primary text-brand-primary rounded-xl font-black text-sm hover:bg-brand-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-md flex items-center justify-center gap-2"
                        >
                            <Copy className="h-5 w-5" />
                            COPY TEXT
                        </button>
                        <button
                            onClick={openMessenger}
                            disabled={isSubmitting}
                            className="w-full py-3 bg-brand-primary text-white rounded-xl font-black text-sm hover:bg-green-700 transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Send className="h-5 w-5" />
                            {isSubmitting ? 'PROCESSING...' : 'SEND VIA MESSENGER'}
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={onBack}
                        className="w-full py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 border border-gray-100 mt-4"
                    >
                        <span>BACK TO HOME</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillPayment;
