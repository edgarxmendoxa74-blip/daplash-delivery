import React, { useState } from 'react';
import { X } from 'lucide-react';
import FAQ from './FAQ';
import Hero from './Hero';

interface ServiceSelectionProps {
  onServiceSelect: (service: 'food' | 'pabili' | 'padala' | 'pasakay' | 'paybills' | 'custom_order') => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onServiceSelect }) => {
  const [showGuide, setShowGuide] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partnerData, setPartnerData] = useState({
    businessName: '',
    businessAddress: '',
    contactPerson: '',
    operatingHours: '',
    menuLink: '',
    paymentMode: 'COD & GCash'
  });

  const services = [
    {
      id: 'food' as const,
      name: 'Stores',
      icon: '🏪',
      description: 'Order from your favorite local shops',
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      id: 'pabili' as const,
      name: 'Pabili',
      icon: '🛒',
      description: 'Personal grocery & errands runner',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'custom_order' as const,
      name: 'Custom Order',
      icon: '🛍️',
      description: 'Request specific items you need',
      color: 'bg-pink-50 hover:bg-pink-100 border-pink-200',
      iconColor: 'text-pink-600'
    },
    {
      id: 'paybills' as const,
      name: 'Pay Bills',
      icon: '💰',
      description: 'Fast & convenient bills payment service',
      color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
      iconColor: 'text-yellow-600'
    },
    {
      id: 'padala' as const,
      name: 'Padala',
      icon: '📦',
      description: 'Fast & secure item delivery service',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      id: 'pasakay' as const,
      name: 'Pasakay',
      icon: '🏍️',
      description: 'Safe & fast motorcycle ride service',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600'
    }
  ];

  const handleServiceClick = (serviceId: 'food' | 'pabili' | 'padala' | 'pasakay' | 'paybills' | 'custom_order') => {
    onServiceSelect(serviceId);
  };

  const steps = [
    {
      icon: '1️⃣',
      title: 'Choose a Service',
      description: 'Pick from Food Delivery, Pabili, or Padala depending on what you need.'
    },
    {
      icon: '2️⃣',
      title: 'Select a Store / Enter Details',
      description: 'For Food — browse stores and add items to your cart. For Pabili — tell us the store and items you want us to buy. For Padala — enter pickup & delivery details.'
    },
    {
      icon: '3️⃣',
      title: 'Fill in Your Details',
      description: 'Enter your name, contact number, delivery address, and landmark so our rider can find you easily.'
    },
    {
      icon: '4️⃣',
      title: 'Choose Payment',
      description: 'Pay via Cash on Delivery (COD) or cashless options like GCash and Maya. If cashless, scan the QR code or send to the account shown.'
    },
    {
      icon: '5️⃣',
      title: 'Confirm via Messenger',
      description: 'Your order will be sent to our Messenger page for confirmation. Attach your payment screenshot if paying cashless.'
    },
    {
      icon: '6️⃣',
      title: 'Relax & Wait',
      description: 'Our rider will pick up your order and deliver it right to your doorstep. Track updates through Messenger!'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-light/30 pt-32 sm:pt-28 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Simple Page Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-brand font-extrabold text-brand-charcoal tracking-tight mb-2 uppercase">
            What can we do for you?
          </h1>
          <p className="text-gray-500 text-base sm:text-lg font-medium italic opacity-80 uppercase tracking-widest">Select a service to get started</p>
        </div>

        {/* Services Grid - 2 on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              className="group bg-white border-b-4 border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:border-brand-primary focus:outline-none ring-offset-2 focus:ring-4 focus:ring-brand-primary/20"
            >
              <div className="text-center">
                <div className="text-3xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                  {service.icon}
                </div>
                <h2 className="text-lg md:text-xl font-black text-brand-charcoal mb-1 uppercase tracking-tight group-hover:text-brand-primary transition-colors">
                  {service.name}
                </h2>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mb-4 group-hover:text-gray-600 transition-colors line-clamp-2">
                  {service.description}
                </p>
                <div className="w-12 h-1 bg-brand-accent/30 mx-auto rounded-full group-hover:w-20 group-hover:bg-brand-accent transition-all duration-300"></div>
              </div>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-16 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 max-w-4xl mx-auto">
            {/* How to Use Button */}
            <div className="flex flex-col items-center w-full sm:w-auto">
              <button
                onClick={() => setShowGuide(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-brand-primary text-brand-primary rounded-full text-lg font-semibold shadow-lg shadow-brand-primary/10 hover:bg-brand-primary hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <span className="text-2xl">📖</span>
                How to Use
              </button>
              <p className="text-gray-400 text-xs sm:text-sm mt-3 font-medium">New here? Learn how Daplash works</p>
            </div>

            {/* Be Our Partner Button */}
            <div className="flex flex-col items-center w-full sm:w-auto">
              <button
                onClick={() => setShowPartnerModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-accent border-2 border-brand-accent text-brand-charcoal rounded-full text-lg font-bold shadow-lg shadow-brand-accent/20 hover:bg-brand-charcoal hover:text-brand-accent hover:border-brand-charcoal transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <span className="text-2xl">🤝</span>
                Be Our Partner
              </button>
              <p className="text-brand-primary text-xs sm:text-sm font-black mt-3 italic">
                Libre po ang partnership! Walang bayad, no hidden fees.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Hero />
      <FAQ />

      {/* ═══════════ PARTNERSHIP MODAL ═══════════ */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPartnerModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between z-20">
              <div>
                <h2 className="text-2xl font-brand font-bold text-brand-charcoal flex items-center gap-2">🤝 Partner with Us</h2>
                <p className="text-sm text-green-600 font-bold">100% FREE! No hidden fees.</p>
              </div>
              <button onClick={() => setShowPartnerModal(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600" aria-label="Close partnership modal">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-brand-primary/5 p-4 rounded-2xl border border-brand-primary/10">
                  <h3 className="font-bold text-brand-primary flex items-center gap-2 mb-2 italic">📦 Delivery Arrangement</h3>
                  <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4 font-medium">
                    <li>Kami ang bahala sa pickup at delivery ng orders.</li>
                    <li>Customer-based ang delivery fee (si customer ang magbabayad, unless merchant wants to shoulder it).</li>
                  </ul>
                </div>
                <div className="bg-brand-accent/10 p-4 rounded-2xl border border-brand-accent/20">
                  <h3 className="font-bold text-brand-charcoal flex items-center gap-2 mb-2 italic">📣 Marketing Support</h3>
                  <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4 font-medium">
                    <li>Pwede naming i-feature ang negosyo ninyo sa FB page namin.</li>
                    <li>Pwede kayong magpadala ng promo or discount para mas ma-promote.</li>
                  </ul>
                </div>
              </div>

              {/* Form Section */}
              <div className="space-y-4 pt-4 border-t border-dashed border-gray-200">
                <h3 className="text-lg font-black text-brand-charcoal uppercase tracking-wider text-center">Merchant Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Business Name</label>
                    <input
                      type="text"
                      placeholder="Enter Business Name"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl outline-none transition-all text-sm font-medium"
                      value={partnerData.businessName}
                      onChange={(e) => setPartnerData({ ...partnerData, businessName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Contact Person & Number</label>
                    <input
                      type="text"
                      placeholder="e.g. Juan Dela Cruz - 09123456789"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl outline-none transition-all text-sm font-medium"
                      value={partnerData.contactPerson}
                      onChange={(e) => setPartnerData({ ...partnerData, contactPerson: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Business Address / Pickup Location</label>
                  <input
                    type="text"
                    placeholder="Brgy. Concepcion Pequena, Naga City"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl outline-none transition-all text-sm font-medium"
                    value={partnerData.businessAddress}
                    onChange={(e) => setPartnerData({ ...partnerData, businessAddress: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Operating Hours</label>
                    <input
                      type="text"
                      placeholder="e.g. 8:00 AM - 9:00 PM"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl outline-none transition-all text-sm font-medium"
                      value={partnerData.operatingHours}
                      onChange={(e) => setPartnerData({ ...partnerData, operatingHours: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Preferred Mode of Payment</label>
                    <select
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl outline-none transition-all text-sm font-medium appearance-none"
                      value={partnerData.paymentMode}
                      onChange={(e) => setPartnerData({ ...partnerData, paymentMode: e.target.value })}
                    >
                      <option value="COD & GCash">COD & GCash (Recommended)</option>
                      <option value="COD Only">COD Only</option>
                      <option value="GCash Only">GCash Only</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Menu or Product List (Link)</label>
                  <input
                    type="text"
                    placeholder="Google Drive, Facebook Menu, or Website Link"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl outline-none transition-all text-sm font-medium"
                    value={partnerData.menuLink}
                    onChange={(e) => setPartnerData({ ...partnerData, menuLink: e.target.value })}
                  />
                </div>
              </div>

              {/* Terms Section */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-black text-brand-charcoal flex items-center gap-2 mb-3 text-sm uppercase tracking-widest italic">📌 Terms & Conditions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
                    No exclusive lock-in.
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
                    Walang kontrata — trust-based.
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
                    Open sa feedback and adjustments.
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-5">
              <button
                onClick={() => {
                  const message = `Mga Kailangan mula sa Merchant:

Business Name: ${partnerData.businessName}
Business Address / Pickup Location: ${partnerData.businessAddress}
Contact Person & Number: ${partnerData.contactPerson}
Operating Hours: ${partnerData.operatingHours}
Menu or Product List: ${partnerData.menuLink}
Preferred Mode of Payment: ${partnerData.paymentMode}

Delivery Arrangement:
Kami ang bahala sa pickup at delivery ng orders.
Customer-based ang delivery fee (si customer ang magbabayad, unless merchant wants to shoulder it).

📣 Marketing Support:
Pwede naming i-feature ang negosyo ninyo sa FB page namin.
Pwede kayong magpadala ng promo or discount para mas ma-promote.

📌 Terms:
No exclusive lock-in.
Walang kontrata — trust-based partnership.
Open sa feedback and adjustments.`;

                  const encodedMessage = encodeURIComponent(message);
                  window.open(`https://m.me/100064173395989?text=${encodedMessage}`, '_blank');
                  setShowPartnerModal(false);
                }}
                disabled={!partnerData.businessName || !partnerData.contactPerson}
                className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-lg hover:bg-green-700 transition-all active:scale-[0.98] transform shadow-xl shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest"
              >
                Submit Inquiry via Messenger 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ HOW TO USE MODAL ═══════════ */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowGuide(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-brand font-bold text-brand-charcoal">📖 How to Use</h2>
                <p className="text-sm text-gray-500 mt-0.5">Daplash Delivery in 6 simple steps</p>
              </div>
              <button onClick={() => setShowGuide(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600" aria-label="Close guide">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Steps */}
            <div className="px-6 py-6 space-y-1">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4 py-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-2xl shadow-sm">
                    {step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-brand-charcoal mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => setShowGuide(false)}
                className="w-full py-3 bg-brand-primary text-white rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors active:scale-[0.98] transform shadow-lg shadow-brand-primary/20"
              >
                Got it! Let's go 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
