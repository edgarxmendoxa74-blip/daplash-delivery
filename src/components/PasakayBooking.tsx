import React, { useState } from 'react';
import { ArrowLeft, MapPin, User, Package, Phone, Copy, MessageSquare, Plus, Minus, Navigation } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../hooks/useSiteSettings';
import AddressMapPicker from './AddressMapPicker';

interface PasakayBookingProps {
    onBack: () => void;
}

const PasakayBooking: React.FC<PasakayBookingProps> = ({ onBack }) => {
    const { siteSettings } = useSiteSettings();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const [formData, setFormData] = useState({
        customer_name: '',
        contact_number: '',
        pickup_location: '',
        destination: '',
        passengers: 1,
        has_baggage: false,
        notes: '',
        pickup_lat: '',
        pickup_lng: '',
        destination_lat: '',
        destination_lng: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const updatePassengers = (delta: number) => {
        setFormData(prev => ({
            ...prev,
            passengers: Math.max(1, Math.min(4, prev.passengers + delta))
        }));
    };

    const handleLocationSelect = (field: 'pickup' | 'destination', lat: number, lng: number, address?: string) => {
        setFormData(prev => ({
            ...prev,
            [`${field}_lat`]: lat.toString(),
            [`${field}_lng`]: lng.toString(),
            [`${field}_location`]: address || prev[`${field}_location` as keyof typeof prev]
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
                    pickup_lat: latitude.toString(),
                    pickup_lng: longitude.toString()
                }));

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                    );
                    const data = await response.json();
                    if (data && data.display_name) {
                        setFormData(prev => ({ ...prev, pickup_location: data.display_name }));
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
        return `*Angkas Delivery Request*

📍 *Pickup Location:* ${formData.pickup_location}
📍 *Destination:* ${formData.destination}
👥 *Passengers:* ${formData.passengers}
🧳 *Baggage:* ${formData.has_baggage ? 'Yes' : 'No'}

👤 *Name:* ${formData.customer_name}
📱 *Phone:* ${formData.contact_number}

${formData.notes ? `📝 *Notes:* ${formData.notes}\n` : ''}
Please confirm this delivery request.`;
    };

    const copyToClipboard = () => {
        const text = generateMessageText();
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const openMessenger = async () => {
        if (!formData.customer_name || !formData.contact_number || !formData.pickup_location || !formData.destination) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            // Save to Supabase
            const { error } = await supabase
                .from('pasakay_bookings')
                .insert({
                    customer_name: formData.customer_name,
                    contact_number: formData.contact_number,
                    pickup_location: formData.pickup_location,
                    destination: formData.destination,
                    passengers: formData.passengers,
                    has_baggage: formData.has_baggage,
                    notes: formData.notes,
                    pickup_lat: formData.pickup_lat,
                    pickup_lng: formData.pickup_lng,
                    destination_lat: formData.destination_lat,
                    destination_lng: formData.destination_lng,
                    status: 'pending'
                });

            if (error) throw error;

            const message = generateMessageText();
            const encodedMessage = encodeURIComponent(message);
            const messengerId = siteSettings?.messenger_id || '61558704207383';
            const messengerUrl = `https://m.me/${messengerId}?text=${encodedMessage}`;
            window.open(messengerUrl, '_blank');
        } catch (error) {
            console.error('Error saving booking:', error);
            alert('Failed to save booking. You can still copy the text and open Messenger.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 pt-32 sm:pt-24 pb-12">


            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-brand-primary p-8 text-white text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <span className="text-4xl">🏍️</span>
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Pasakay Service</h1>
                    <p className="text-white/80 font-medium">Safe and fast rider for your travel needs</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Locations Section */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-red-500" />
                                    Pickup Location *
                                </div>
                                <button
                                    type="button"
                                    onClick={getCurrentLocation}
                                    disabled={isGettingLocation}
                                    className="text-[10px] bg-brand-primary text-white px-2 py-1 rounded-full flex items-center gap-1 hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    <Navigation className={`h-2.5 w-2.5 ${isGettingLocation ? 'animate-spin' : ''}`} />
                                    AUTO-GPS
                                </button>
                            </label>
                            <div className="mb-4 h-[250px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                                <AddressMapPicker
                                    lat={formData.pickup_lat ? parseFloat(formData.pickup_lat) : undefined}
                                    lng={formData.pickup_lng ? parseFloat(formData.pickup_lng) : undefined}
                                    onLocationSelect={(lat, lng, addr) => handleLocationSelect('pickup', lat, lng, addr)}
                                    height="100%"
                                    placeholder="Tap to pin pickup location"
                                />
                            </div>
                            <textarea
                                name="pickup_location"
                                value={formData.pickup_location}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                placeholder="Enter complete pickup address or pin on map"
                                rows={2}
                                required
                            />
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-blue-500" />
                                Destination *
                            </label>
                            <div className="mb-4 h-[250px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                                <AddressMapPicker
                                    lat={formData.destination_lat ? parseFloat(formData.destination_lat) : undefined}
                                    lng={formData.destination_lng ? parseFloat(formData.destination_lng) : undefined}
                                    onLocationSelect={(lat, lng, addr) => handleLocationSelect('destination', lat, lng, addr)}
                                    height="100%"
                                    placeholder="Tap to pin your destination"
                                />
                            </div>
                            <textarea
                                name="destination"
                                value={formData.destination}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                placeholder="Where are you going?"
                                rows={2}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Passengers & Baggage */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Number of Passengers *
                                </label>
                                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => updatePassengers(-1)}
                                        className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm text-brand-charcoal hover:bg-gray-100 transition-colors"
                                    >
                                        <Minus className="h-5 w-5" />
                                    </button>
                                    <div className="text-2xl font-black text-brand-charcoal">
                                        {formData.passengers}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => updatePassengers(1)}
                                        className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm text-brand-charcoal hover:bg-gray-100 transition-colors"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center font-medium">Max 4 passengers</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Baggage/Cargo
                                </label>
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={formData.has_baggage}
                                            onChange={(e) => setFormData(prev => ({ ...prev, has_baggage: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-primary"></div>
                                    </div>
                                    <span className="text-gray-700 font-bold group-hover:text-brand-charcoal transition-colors">I have baggage/cargo to transport</span>
                                </label>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Contact Information
                                </label>
                                <div className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="customer_name"
                                            value={formData.customer_name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                                            placeholder="Full Name *"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            name="contact_number"
                                            value={formData.contact_number}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                                            placeholder="Phone Number (09XX-XXX-XXXX) *"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                                    placeholder="Any special instructions or notes for the driver..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Startup Message Alert */}
                    <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-6 text-orange-800">
                        <p className="text-center font-bold text-lg">Really sorry — we're a startup. 🚀</p>
                        <p className="text-center text-sm mt-1">Please tap <strong>"Copy order text"</strong>, then <strong>"Open Messenger"</strong>, and paste the message there.</p>
                    </div>

                    {/* Message Preview */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Message Preview</h3>
                            <button
                                onClick={copyToClipboard}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${copySuccess ? 'bg-green-500 text-white' : 'bg-white text-brand-charcoal hover:bg-gray-100 border border-gray-200'}`}
                            >
                                {copySuccess ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy order text</>}
                            </button>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 font-mono text-sm whitespace-pre-wrap text-gray-600 shadow-inner">
                            {generateMessageText()}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={copyToClipboard}
                            className="w-full py-5 bg-white border-2 border-brand-primary text-brand-primary rounded-2xl font-black text-lg hover:bg-brand-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-lg shadow-brand-primary/10 flex items-center justify-center gap-3"
                        >
                            <Copy className="h-6 w-6" />
                            COPY TEXT
                        </button>
                        <button
                            onClick={openMessenger}
                            disabled={isSubmitting}
                            className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-lg hover:bg-green-700 transition-all transform hover:-translate-y-1 shadow-xl shadow-brand-primary/30 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <MessageSquare className="h-6 w-6" />
                            {isSubmitting ? 'PROCESSING...' : 'OPEN MESSENGER'}
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={onBack}
                        className="w-full py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 border border-gray-100"
                    >
                        <span>BACK TO HOME</span>
                    </button>

                    <p className="text-center text-gray-400 text-xs font-medium">
                        Paste the copied text into the Messenger chat to finalise your booking.
                    </p>
                </div>
            </div>
        </div>
    );
};

const Check = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

export default PasakayBooking;
