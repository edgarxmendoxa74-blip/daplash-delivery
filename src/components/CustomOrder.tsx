import React, { useState } from 'react';
import { ArrowLeft, User, Phone, MapPin, Navigation, Plus, Trash2, Copy, MessageSquare, ShoppingBag, AlertCircle } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import AddressMapPicker from './AddressMapPicker';

interface CustomOrderProps {
    onBack: () => void;
}

interface CustomItem {
    id: string;
    description: string;
    quantity: number;
    estimatedPrice: number;
}

const CustomOrder: React.FC<CustomOrderProps> = ({ onBack }) => {
    const { siteSettings } = useSiteSettings();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const [formData, setFormData] = useState({
        customerName: '',
        contactNumber: '',
        deliveryAddress: '',
        lat: '',
        lng: '',
    });

    const [items, setItems] = useState<CustomItem[]>([
        { id: `item-${Date.now()}`, description: '', quantity: 1, estimatedPrice: 0 }
    ]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addItem = () => {
        setItems(prev => [
            ...prev,
            { id: `item-${Date.now()}`, description: '', quantity: 1, estimatedPrice: 0 }
        ]);
    };

    const removeItem = (id: string) => {
        if (items.length <= 1) return;
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: keyof CustomItem, value: string | number) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const totalEstimatedAmount = items.reduce((sum, item) => sum + (item.estimatedPrice * item.quantity), 0);

    const handleLocationSelect = (lat: number, lng: number, address?: string) => {
        setFormData(prev => ({
            ...prev,
            lat: lat.toString(),
            lng: lng.toString(),
            deliveryAddress: address || prev.deliveryAddress
        }));
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setFormData(prev => ({
                    ...prev,
                    lat: latitude.toString(),
                    lng: longitude.toString()
                }));

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                    );
                    const data = await response.json();
                    if (data && data.display_name) {
                        setFormData(prev => ({ ...prev, deliveryAddress: data.display_name }));
                    }
                } catch (err) {
                    console.error('Reverse geocoding error:', err);
                }
                setIsGettingLocation(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Could not get your location. Please try manually.');
                setIsGettingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const generateMessageText = () => {
        const itemsList = items.map(item => `• ${item.description} (x${item.quantity}) - ₱${item.estimatedPrice.toLocaleString()}`).join('\n');

        return `*Custom Order Request*

*Customer Details:*
Name: ${formData.customerName}
Phone: ${formData.contactNumber}
Delivery Address: ${formData.deliveryAddress}
${formData.lat && formData.lng ? `GPS: https://www.google.com/maps?q=${formData.lat},${formData.lng}` : ''}

*Items Requested:*
${itemsList}

*Estimated Total Amount: ₱${totalEstimatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}*

Please confirm availability and final pricing.`;
    };

    const copyToClipboard = () => {
        const text = generateMessageText();
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const openMessenger = () => {
        if (!formData.customerName || !formData.contactNumber || !formData.deliveryAddress || items.some(i => !i.description)) {
            alert('Please fill in all required fields and item descriptions');
            return;
        }
        setIsSubmitting(true);
        const message = generateMessageText();
        const encodedMessage = encodeURIComponent(message);
        const messengerId = siteSettings?.messenger_id || '100064173395989';
        const messengerUrl = `https://m.me/${messengerId}?text=${encodedMessage}`;

        // Open Messenger
        window.open(messengerUrl, '_blank');

        // Clear Form
        setFormData({
            customerName: '',
            contactNumber: '',
            deliveryAddress: '',
            lat: '',
            lng: '',
        });
        setItems([
            { id: `item-${Date.now()}`, description: '', quantity: 1, estimatedPrice: 0 }
        ]);

        // Finalize
        setIsSubmitting(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-6 pt-32 sm:pt-24 pb-12">


            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-brand-primary p-8 text-white text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <ShoppingBag className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Custom Order</h1>
                    <p className="text-white/80 font-medium">Describe what you need and we'll get it for you</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Customer Information */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-brand-charcoal flex items-center gap-2">
                            <User className="h-5 w-5 text-brand-primary" />
                            Your Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Full Name *</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                                    placeholder="09XX-XXX-XXXX"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                                <span>Delivery Address *</span>
                                <button
                                    type="button"
                                    onClick={getCurrentLocation}
                                    disabled={isGettingLocation}
                                    className="text-xs bg-brand-primary text-white px-3 py-1 rounded-full flex items-center gap-1 hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    <Navigation className={`h-3 w-3 ${isGettingLocation ? 'animate-spin' : ''}`} />
                                    Pin Location
                                </button>
                            </label>
                            <div className="h-[200px] rounded-2xl overflow-hidden border border-gray-200">
                                <AddressMapPicker
                                    lat={formData.lat ? parseFloat(formData.lat) : undefined}
                                    lng={formData.lng ? parseFloat(formData.lng) : undefined}
                                    onLocationSelect={handleLocationSelect}
                                    height="100%"
                                />
                            </div>
                            <textarea
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                                placeholder="Click 'Pin Location' to select address or type manually"
                                rows={2}
                                required
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Items to Request */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-brand-charcoal flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-brand-primary" />
                                Items to Request
                            </h2>
                            <button
                                type="button"
                                onClick={addItem}
                                className="text-sm bg-brand-primary text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Add New Item
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 italic">Describe what you need and provide an estimated price</p>

                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div key={item.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.id)}
                                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Remove item"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div className="md:col-span-6 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Item Description *</label>
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                                                placeholder="e.g., 2 boxes of office supplies, 5kg rice, wedding decorations, etc."
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label htmlFor={`qty-${item.id}`} className="text-xs font-black text-gray-400 uppercase tracking-widest">Quantity *</label>
                                            <input
                                                id={`qty-${item.id}`}
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all text-center"
                                                min="1"
                                                placeholder="1"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-4 space-y-2">
                                            <label htmlFor={`price-${item.id}`} className="text-xs font-black text-gray-400 uppercase tracking-widest">Estimated Price (₱) *</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₱</span>
                                                <input
                                                    id={`price-${item.id}`}
                                                    type="number"
                                                    value={item.estimatedPrice}
                                                    onChange={(e) => updateItem(item.id, 'estimatedPrice', parseFloat(e.target.value) || 0)}
                                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total & Startup Message */}
                    <div className="bg-brand-charcoal text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-base sm:text-lg font-bold uppercase tracking-wider text-gray-400">Estimated Total</span>
                        <span className="text-3xl sm:text-4xl font-black text-brand-accent">₱{totalEstimatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-6 text-orange-800">
                        <p className="text-center font-bold text-lg">Really sorry — we're a startup. 🚀</p>
                        <p className="text-center text-sm mt-1">Please tap <strong>"Copy order text"</strong>, then <strong>"Open Messenger"</strong>, and paste the message there.</p>
                    </div>

                    {/* Preview */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Message Preview</h3>
                            <button
                                onClick={copyToClipboard}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${copySuccess ? 'bg-green-500 text-white' : 'bg-white text-brand-charcoal hover:bg-gray-100 border border-gray-200'}`}
                            >
                                {copySuccess ? <span>Copied!</span> : <><Copy className="h-4 w-4" /> Copy order text</>}
                            </button>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100 font-mono text-sm whitespace-pre-wrap text-gray-600 shadow-inner">
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

                    {/* Action Buttons */}
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            <MessageSquare className="h-5 w-5" />
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

                    <p className="text-center text-gray-400 text-xs font-medium">
                        Paste the copied text into the Messenger chat to finalise your custom order.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CustomOrder;
