import React, { useState } from 'react';
import { ArrowLeft, MapPin, Plus, Trash2, Navigation, Copy, Check, MessageSquare, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { useSiteSettings } from '../hooks/useSiteSettings';
import MultiPointMapPicker from './MultiPointMapPicker';


interface PadalaBookingProps {
  onBack: () => void;
  title?: string;
  mode?: 'simple' | 'full';
}

interface OrderItem {
  id: string;
  item_description: string;
  quantity: number;
}

interface StoreOrder {
  id: string;
  store_name: string;
  store_address: string;
  items: OrderItem[];
}

const PadalaBooking: React.FC<PadalaBookingProps> = ({ onBack, title = 'Padala', mode = 'full' }) => {
  const { calculateDistanceBetweenAddresses, calculateDeliveryFee } = useGoogleMaps();
  const { siteSettings } = useSiteSettings();

  // Customer details
  const [customerData, setCustomerData] = useState({
    receivers_name: '',
    address: '',
    pin_lat: '',
    pin_lng: '',
    landmark: '',
    contact_number: '',
  });


  // Store orders (for Pabili mode - multiple stores with items) - DEPRECATED in favor of new format
  const [storeOrders, setStoreOrders] = useState<StoreOrder[]>([
    {
      id: `store-${Date.now()}`,
      store_name: '',
      store_address: '',
      items: [{ id: `item-${Date.now()}`, item_description: '', quantity: 1 }]
    }
  ]);

  // Padala mode form data (single item send)
  const [padalaData, setPadalaData] = useState({
    customer_name: '',
    contact_number: '',
    pickup_address: '',
    delivery_address: '',
    item_description: '',
    item_weight: '',
    item_value: '',
    special_instructions: '',
    preferred_date: '',
    preferred_time: 'Morning',
    notes: '',
    pickup_lat: '',
    pickup_lng: '',
    delivery_lat: '',
    delivery_lng: '',
    receiver_name: '',
    receiver_contact: '',
  });

  const [distance, setDistance] = useState<number | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number>(65);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const generatePadalaMessage = () => {
    return `📦 Padala Service

👤 Customer: ${padalaData.customer_name}
📞 Contact: ${padalaData.contact_number}

📍 Pickup Address:
${padalaData.pickup_address}${padalaData.pickup_lat && padalaData.pickup_lng ? `\n📌 Pin: https://www.google.com/maps?q=${padalaData.pickup_lat},${padalaData.pickup_lng}` : ''}

📍 Delivery Address:
${padalaData.delivery_address}${padalaData.delivery_lat && padalaData.delivery_lng ? `\n📌 Pin: https://www.google.com/maps?q=${padalaData.delivery_lat},${padalaData.delivery_lng}` : ''}

👤 Receiver: ${padalaData.receiver_name || 'N/A'}
📞 Receiver Contact: ${padalaData.receiver_contact || 'N/A'}

${padalaData.item_description ? `📦 Item Details:\n${padalaData.item_description}\n` : ''}${padalaData.item_weight ? `Weight: ${padalaData.item_weight}\n` : ''}${padalaData.item_value ? `Declared Value: ₱${padalaData.item_value}\n` : ''}
📅 Preferred Date: ${padalaData.preferred_date || 'Any'}
⏰ Preferred Time: ${padalaData.preferred_time}

${distance ? `📏 Distance: ${distance} km` : ''}
💰 Delivery Fee: ₱${deliveryFee.toFixed(2)}

${padalaData.special_instructions ? `📝 Special Instructions: ${padalaData.special_instructions}` : ''}${padalaData.notes ? `\n📝 Notes: ${padalaData.notes}` : ''}

Please confirm this Padala booking. Thank you! 🛵`;
  };

  const generatePabiliMessage = () => {
    const storeDetails = storeOrders
      .filter(s => s.store_name.trim())
      .map(store => ({
        store_name: store.store_name,
        store_address: store.store_address,
        items: store.items.filter(i => i.item_description.trim())
      }));

    return `🛒 Pabili Service

${storeDetails.map((store, idx) => `
🏪 Store ${idx + 1}: ${store.store_name}${store.store_address ? `\n📍 Address: ${store.store_address}` : ''}
📋 Items:
${store.items.map(i => `  • ${i.item_description} — Qty: ${i.quantity}`).join('\n')}`).join('\n')}

━━━━━━━━━━━━━━━━━━
👤 Customer Details
━━━━━━━━━━━━━━━━━━
📋 Receiver: ${customerData.receivers_name}
📞 Contact: ${customerData.contact_number}
📍 Address: ${customerData.address}${customerData.pin_lat && customerData.pin_lng ? `\n📌 Pin: https://www.google.com/maps?q=${customerData.pin_lat},${customerData.pin_lng}` : ''}${customerData.landmark ? `\n🗺️ Landmark: ${customerData.landmark}` : ''}

Please confirm this Pabili order. Thank you! 🛵`;
  };

  const copyToClipboard = () => {
    const text = mode === 'simple' ? generatePabiliMessage() : generatePadalaMessage();
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // ═══════════ PADALA MODE HANDLERS ═══════════
  const handlePadalaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPadalaData(prev => ({ ...prev, [name]: value }));
  };

  const calculatePadalaFee = async () => {
    if (!padalaData.pickup_address.trim() || !padalaData.delivery_address.trim()) {
      return;
    }

    setIsCalculating(true);
    try {
      const result = await calculateDistanceBetweenAddresses(
        padalaData.pickup_address,
        padalaData.delivery_address
      );

      if (result && !isNaN(result.distance)) {
        setDistance(result.distance);
        const fee = calculateDeliveryFee(result.distance);
        setDeliveryFee(fee);
      } else {
        setDistance(null);
        setDeliveryFee(65);
      }
    } catch (error) {
      console.error('Error calculating fee:', error);
      setDistance(null);
      setDeliveryFee(65);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleLocationSelect = (type: 'pickup' | 'dropoff', lat: number, lng: number, address?: string) => {
    if (type === 'pickup') {
      setPadalaData(prev => ({
        ...prev,
        pickup_lat: lat.toString(),
        pickup_lng: lng.toString(),
        pickup_address: address || prev.pickup_address
      }));
    } else if (type === 'dropoff') {
      setPadalaData(prev => ({
        ...prev,
        delivery_lat: lat.toString(),
        delivery_lng: lng.toString(),
        delivery_address: address || prev.delivery_address
      }));
      // Recalculate fee when delivery location changes
      setTimeout(() => calculatePadalaFee(), 100);
    }
  };


  // ═══════════ PABILI / PADALA STORE ORDER HANDLERS ═══════════
  const addStoreOrder = () => {
    setStoreOrders(prev => [
      ...prev,
      {
        id: `store-${Date.now()}`,
        store_name: '',
        store_address: '',
        items: [{ id: `item-${Date.now()}`, item_description: '', quantity: 1 }]
      }
    ]);
  };

  const removeStoreOrder = (storeId: string) => {
    if (storeOrders.length <= 1) return;
    setStoreOrders(prev => prev.filter(s => s.id !== storeId));
  };

  const updateStoreOrder = (storeId: string, field: 'store_name' | 'store_address', value: string) => {
    setStoreOrders(prev =>
      prev.map(s => s.id === storeId ? { ...s, [field]: value } : s)
    );
  };

  const addItemToStore = (storeId: string) => {
    setStoreOrders(prev =>
      prev.map(s => s.id === storeId ? {
        ...s,
        items: [...s.items, { id: `item-${Date.now()}`, item_description: '', quantity: 1 }]
      } : s)
    );
  };

  const removeItemFromStore = (storeId: string, itemId: string) => {
    setStoreOrders(prev =>
      prev.map(s => {
        if (s.id === storeId) {
          const newItems = s.items.filter(i => i.id !== itemId);
          return { ...s, items: newItems.length > 0 ? newItems : [{ id: `item-${Date.now()}`, item_description: '', quantity: 1 }] };
        }
        return s;
      })
    );
  };

  const updateItem = (storeId: string, itemId: string, field: 'item_description' | 'quantity', value: string | number) => {
    setStoreOrders(prev =>
      prev.map(s => s.id === storeId ? {
        ...s,
        items: s.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
      } : s)
    );
  };

  // Get current GPS location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please enter your address manually.');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCustomerData(prev => ({
          ...prev,
          pin_lat: latitude.toString(),
          pin_lng: longitude.toString()
        }));

        // Reverse geocode to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          if (data && data.display_name) {
            setCustomerData(prev => ({ ...prev, address: data.display_name }));
          }
        } catch (err) {
          console.error('Reverse geocoding error:', err);
        }
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let msg = 'Could not get your location.';
        switch (error.code) {
          case 1: msg = 'Location permission denied. Please enable location access in your browser settings.'; break;
          case 2: msg = 'Location information is unavailable. Please make sure your device\'s GPS/Location is turned ON and try again.'; break;
          case 3: msg = 'Location request timed out. Your connection might be slow. Please try again or pin your location on the map.'; break;
        }
        alert(msg + '\n\nIf GPS continues to fail, you can manually pin your location on the map.');
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // ═══════════ SUBMIT HANDLER ═══════════
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'simple') {
      // Pabili mode validation
      const hasValidStore = storeOrders.some(s => s.store_name.trim());
      const hasValidItems = storeOrders.some(s => s.items.some(i => i.item_description.trim()));

      if (!customerData.receivers_name || !customerData.address || !customerData.contact_number || !hasValidStore || !hasValidItems) {
        alert('Please fill in all required fields: Receiver name, Address, Contact Number, at least one store, and at least one item.');
        return;
      }
    } else {
      // Padala mode validation
      if (
        !padalaData.customer_name ||
        !padalaData.contact_number ||
        !padalaData.pickup_address ||
        !padalaData.delivery_address ||
        !padalaData.item_description
      ) {
        alert('Please fill in all required fields');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === 'simple') {
        // ═══════════ PABILI SUBMISSION ═══════════
        const storeDetails = storeOrders
          .filter(s => s.store_name.trim())
          .map(store => ({
            store_name: store.store_name,
            store_address: store.store_address,
            items: store.items.filter(i => i.item_description.trim())
          }));

        // Build item description from all stores
        const allItemsDescription = storeDetails.map(store =>
          `[${store.store_name}${store.store_address ? ` - ${store.store_address}` : ''}]\n` +
          store.items.map(i => `  • ${i.item_description} x${i.quantity}`).join('\n')
        ).join('\n\n');

        const { error } = await supabase
          .from('padala_bookings')
          .insert({
            customer_name: customerData.receivers_name,
            contact_number: customerData.contact_number,
            pickup_address: storeDetails.map(s => `${s.store_name}: ${s.store_address}`).join(' | '),
            delivery_address: customerData.address,
            item_description: allItemsDescription,
            delivery_fee: deliveryFee || null,
            distance_km: distance || null,
            notes: customerData.landmark ? `Landmark: ${customerData.landmark}` : null,
            status: 'pending'
          });

        if (error) throw error;

        // Open Messenger
        const message = generatePabiliMessage();
        const encodedMessage = encodeURIComponent(message);
        const messengerId = siteSettings?.messenger_id || '100064173395989';
        const messengerUrl = `https://m.me/${messengerId}?text=${encodedMessage}`;
        window.open(messengerUrl, '_blank');

        // Reset form and show success
        setStoreOrders([{
          id: `store-${Date.now()}`,
          store_name: '',
          store_address: '',
          items: [{ id: `item-${Date.now()}`, item_description: '', quantity: 1 }]
        }]);
        setCustomerData({
          receivers_name: '',
          address: '',
          pin_lat: '',
          pin_lng: '',
          landmark: '',
          contact_number: '',
        });

        setBookingSuccess(true);

      } else {
        // ═══════════ PADALA SUBMISSION ═══════════
        const { error } = await supabase
          .from('padala_bookings')
          .insert({
            customer_name: padalaData.customer_name,
            contact_number: padalaData.contact_number,
            pickup_address: padalaData.pickup_address,
            delivery_address: padalaData.delivery_address,
            item_description: padalaData.item_description || null,
            item_weight: padalaData.item_weight ? padalaData.item_weight : null,
            item_value: padalaData.item_value ? parseFloat(padalaData.item_value) : null,
            special_instructions: padalaData.special_instructions || null,
            preferred_date: padalaData.preferred_date ? padalaData.preferred_date : null,
            preferred_time: padalaData.preferred_time,
            delivery_fee: deliveryFee || null,
            distance_km: distance || null,
            notes: padalaData.notes ? padalaData.notes : null,
            receiver_name: padalaData.receiver_name || null,
            receiver_contact: padalaData.receiver_contact || null,
            status: 'pending'
          });

        if (error) throw error;

        // Open Messenger
        const message = (mode as any) === 'simple' ? generatePabiliMessage() : generatePadalaMessage();
        const encodedMessage = encodeURIComponent(message);
        const messengerId = siteSettings?.messenger_id || '100064173395989';
        const messengerUrl = `https://m.me/${messengerId}?text=${encodedMessage}`;
        window.open(messengerUrl, '_blank');

        // Reset form and show success
        setPadalaData({
          customer_name: '',
          contact_number: '',
          pickup_address: '',
          delivery_address: '',
          item_description: '',
          item_weight: '',
          item_value: '',
          special_instructions: '',
          preferred_date: '',
          preferred_time: 'Morning',
          notes: '',
          pickup_lat: '',
          pickup_lng: '',
          delivery_lat: '',
          delivery_lng: '',
          receiver_name: '',
          receiver_contact: '',
        });

        setBookingSuccess(true);
      }

      setDistance(null);
      setDeliveryFee(65);
    } catch (error) {
      console.error('Error submitting booking:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again.';
      alert(`Failed to submit booking: ${errorMessage}\n\nNote: If the error mentions 'relation "padala_bookings" does not exist', please make sure you have run the database migration.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ═══════════════════════════════════════
  // SUCCESS VIEW
  // ═══════════════════════════════════════
  if (bookingSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-32 sm:pt-24 pb-8 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center max-w-lg w-full transform transition-all border border-brand-primary/20">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-12 w-12 text-brand-primary" />
          </div>
          <h2 className="text-3xl font-black text-brand-charcoal uppercase tracking-tighter mb-4">
            Order Received!
          </h2>
          <p className="text-gray-600 mb-8 font-medium text-lg leading-relaxed">
            Your {mode === 'simple' ? 'Pabili' : 'Padala'} booking has been sent successfully. Our team will review your order and contact you shortly.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => setBookingSuccess(false)}
              className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Book Another
            </button>
            <button
              onClick={onBack}
              className="w-full py-4 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-100"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // PABILI MODE (simple) - Multi-store with items
  // ═══════════════════════════════════════
  if (mode === 'simple') {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-32 sm:pt-24 pb-8">


        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-brand-charcoal uppercase tracking-tighter">
              🛒 Pabili Service
            </h1>
            <p className="text-gray-500 mt-1 font-medium">Tell us what you need and we'll buy it for you</p>
          </div>

          {/* ═══════════ STORE ORDERS ═══════════ */}
          {storeOrders.map((store, storeIndex) => (
            <div key={store.id} className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-4 border-l-4 border-green-400">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  🏪 Store {storeIndex + 1}
                </h2>
                {storeOrders.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStoreOrder(store.id)}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Name *</label>
                  <input
                    type="text"
                    value={store.store_name}
                    onChange={(e) => updateStoreOrder(store.id, 'store_name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    placeholder="e.g., Mercury Drug, 7-Eleven"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
                  <input
                    type="text"
                    value={store.store_address}
                    onChange={(e) => updateStoreOrder(store.id, 'store_address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    placeholder="Store location / branch"
                  />
                </div>
              </div>

              {/* Items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                <div className="space-y-3">
                  {store.items.map((item, itemIndex) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-6 text-center">{itemIndex + 1}.</span>
                      <input
                        type="text"
                        value={item.item_description}
                        onChange={(e) => updateItem(store.id, item.id, 'item_description', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                        placeholder="Item description"
                      />
                      <div className="flex items-center gap-1">
                        <label className="text-xs text-gray-500">Qty:</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(store.id, item.id, 'quantity', Number(e.target.value) || 1)}
                          className="w-16 px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-center"
                          min="1"
                        />
                      </div>
                      {store.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemFromStore(store.id, item.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addItemToStore(store.id)}
                  className="mt-3 flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              </div>
            </div>
          ))}

          {/* Add Store Button */}
          <button
            type="button"
            onClick={addStoreOrder}
            className="w-full py-3 border-2 border-dashed border-green-300 rounded-xl text-green-600 font-medium hover:bg-green-50 hover:border-green-400 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Another Store
          </button>

          {/* ═══════════ CUSTOMER DETAILS ═══════════ */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              👤 Customer Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Receiver's Name *</label>
                <input
                  type="text"
                  value={customerData.receivers_name}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, receivers_name: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="Full name of receiver"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                <input
                  type="tel"
                  value={customerData.contact_number}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, contact_number: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="09XX XXX XXXX"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Delivery Address & Pin Location *</label>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <MultiPointMapPicker
                  pickup={null}
                  dropoff={customerData.pin_lat && customerData.pin_lng ? {
                    lat: parseFloat(customerData.pin_lat),
                    lng: parseFloat(customerData.pin_lng),
                    address: customerData.address
                  } : null}
                  onLocationSelect={(type, lat, lng, addr) => {
                    if (type === 'dropoff') {
                      setCustomerData(prev => ({
                        ...prev,
                        pin_lat: lat.toString(),
                        pin_lng: lng.toString(),
                        address: addr || prev.address
                      }));
                    }
                  }}
                  height="250px"
                />
              </div>

              <div className="relative">
                <textarea
                  value={customerData.address}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, address: e.target.value }))}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent pt-10"
                  placeholder="Enter complete delivery address (House No., Street, Brgy, and Landmark)"
                />
                <div className="absolute top-3 left-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1"
                  >
                    <Navigation className={`h-3 w-3 ${isGettingLocation ? 'animate-spin' : ''}`} />
                    GPS
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Landmark</label>
                  <input
                    type="text"
                    value={customerData.landmark}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, landmark: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                    placeholder="e.g., Near McDonald's"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Lat</label>
                    <input
                      type="text"
                      value={customerData.pin_lat}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-xs"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Lng</label>
                    <input
                      type="text"
                      value={customerData.pin_lng}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message Preview */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Order Preview</h3>
              <button
                type="button"
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${copySuccess ? 'bg-green-500 text-white border-green-500' : 'bg-white text-brand-charcoal hover:bg-gray-100 border border-gray-200'}`}
              >
                {copySuccess ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> COPY DETAILS</>}
              </button>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 font-mono text-xs whitespace-pre-wrap text-gray-600 shadow-inner overflow-x-auto min-h-[100px]">
              {generatePabiliMessage()}
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

          {/* Submit Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={copyToClipboard}
              className="w-full py-3 bg-white border-2 border-brand-primary text-brand-primary rounded-xl font-bold text-sm hover:bg-brand-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-md flex items-center justify-center gap-2"
            >
              <Copy className="h-5 w-5" />
              COPY DETAILS
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="h-5 w-5" />
              {isSubmitting ? 'SUBMITTING...' : 'SEND VIA MESSENGER'}
            </button>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="w-full py-4 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 border border-gray-100"
          >
            <span>BACK TO HOME</span>
          </button>
        </form>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // PADALA MODE (full) - Send items
  // ═══════════════════════════════════════
  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 sm:pt-24 pb-8">


      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-brand-charcoal uppercase tracking-tighter">
            📦 Padala Service
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Send items across the city quickly and safely</p>
        </div>

        {/* Customer Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="customer_name"
                value={padalaData.customer_name}
                onChange={handlePadalaInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
              <input
                type="tel"
                name="contact_number"
                value={padalaData.contact_number}
                onChange={handlePadalaInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Addresses & Map
          </h2>
          <div className="space-y-6">

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
              <MultiPointMapPicker
                pickup={padalaData.pickup_lat && padalaData.pickup_lng ? {
                  lat: parseFloat(padalaData.pickup_lat),
                  lng: parseFloat(padalaData.pickup_lng),
                  address: padalaData.pickup_address
                } : null}
                dropoff={padalaData.delivery_lat && padalaData.delivery_lng ? {
                  lat: parseFloat(padalaData.delivery_lat),
                  lng: parseFloat(padalaData.delivery_lng),
                  address: padalaData.delivery_address
                } : null}
                onLocationSelect={handleLocationSelect}
                height="300px"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  Pickup Address *
                </label>
                <textarea
                  name="pickup_address"
                  value={padalaData.pickup_address}
                  onChange={handlePadalaInputChange}
                  required
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="Complete pickup address"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  Delivery Address *
                </label>
                <textarea
                  name="delivery_address"
                  value={padalaData.delivery_address}
                  onChange={handlePadalaInputChange}
                  onBlur={calculatePadalaFee}
                  required
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="Enter complete delivery address"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Receiver's Name *</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      name="receiver_name"
                      value={padalaData.receiver_name}
                      onChange={handlePadalaInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                      placeholder="Receiver's name"
                    />
                    <button
                      type="button"
                      onClick={() => setPadalaData(prev => ({ ...prev, receiver_name: padalaData.customer_name, receiver_contact: padalaData.contact_number }))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-lg hover:bg-brand-primary/20 transition-all uppercase tracking-tighter"
                    >
                      Same as Sender
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Contact Number *</label>
                  <input
                    type="tel"
                    name="receiver_contact"
                    value={padalaData.receiver_contact}
                    onChange={handlePadalaInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                    placeholder="09XX XXX XXXX"
                  />
                </div>
              </div>

              {isCalculating && (
                <p className="text-xs text-gray-500 mt-1">Calculating distance...</p>
              )}
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Description *</label>
              <textarea
                name="item_description"
                value={padalaData.item_description}
                onChange={handlePadalaInputChange}
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                placeholder="Describe what you are sending"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Weight (optional)</label>
                <input
                  type="text"
                  name="item_weight"
                  value={padalaData.item_weight}
                  onChange={handlePadalaInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="e.g., 1kg, 2kg, light"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Value (optional)</label>
                <input
                  type="number"
                  name="item_value"
                  value={padalaData.item_value}
                  onChange={handlePadalaInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="₱0.00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preferred Schedule */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📅</span>
            Preferred Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
              <input
                type="date"
                name="preferred_date"
                value={padalaData.preferred_date}
                onChange={handlePadalaInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
              <select
                name="preferred_time"
                value={padalaData.preferred_time}
                onChange={handlePadalaInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Any">Any</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions (optional)</label>
          <textarea
            name="special_instructions"
            value={padalaData.special_instructions}
            onChange={handlePadalaInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            placeholder="Any special instructions for delivery"
          />
        </div>

        {/* Delivery Fee Display */}
        {distance !== null && deliveryFee > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estimated Distance</p>
                <p className="text-lg font-semibold text-gray-900">{distance} km</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Delivery Fee</p>
                <p className="text-2xl font-bold text-green-primary">₱{deliveryFee.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Message Preview */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Order Preview</h3>
            <button
              type="button"
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${copySuccess ? 'bg-green-500 text-white border-green-500' : 'bg-white text-brand-charcoal hover:bg-gray-100 border border-gray-200'}`}
            >
              {copySuccess ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> COPY DETAILS</>}
            </button>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 font-mono text-xs whitespace-pre-wrap text-gray-600 shadow-inner overflow-x-auto min-h-[100px]">
            {generatePadalaMessage()}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={copyToClipboard}
            className="w-full py-3 bg-white border-2 border-brand-primary text-brand-primary rounded-xl font-bold text-sm hover:bg-brand-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-md flex items-center justify-center gap-2"
          >
            <Copy className="h-5 w-5" />
            COPY DETAILS
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Check className="h-5 w-5" />
            {isSubmitting ? 'SUBMITTING...' : 'SEND VIA MESSENGER'}
          </button>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="w-full py-4 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 border border-gray-100 mt-4"
        >
          <span>BACK TO HOME</span>
        </button>
      </form>
    </div>
  );
};

export default PadalaBooking;
