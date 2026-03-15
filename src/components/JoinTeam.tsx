import React, { useState } from 'react';
import { ArrowLeft, User, Phone, MessageSquare, Copy, Target, Eye, Bike, CheckCircle2, Star, MapPin } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface JoinTeamProps {
    onBack: () => void;
}

const JoinTeam: React.FC<JoinTeamProps> = ({ onBack }) => {
    const { siteSettings } = useSiteSettings();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        aboutMe: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateMessageText = () => {
        return `Hi One Click Delivery,

I would like to apply for the Rider position.

Name: ${formData.fullName}
Phone: ${formData.phoneNumber}

About Me:
${formData.aboutMe}`;
    };

    const copyToClipboard = () => {
        const text = generateMessageText();
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const openMessenger = async () => {
        if (!formData.fullName || !formData.phoneNumber || !formData.aboutMe) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const message = generateMessageText();
            const encodedMessage = encodeURIComponent(message);
            const messengerId = siteSettings?.messenger_id || '61558704207383';
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


            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-12">
                <div className="bg-brand-primary p-8 sm:p-12 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <Bike className="w-64 h-64 absolute -bottom-10 -right-10 rotate-12" />
                    </div>
                    <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tighter mb-4 relative z-10 leading-none">Join Our Team</h1>
                    <p className="text-white/90 text-sm sm:text-xl font-medium max-w-2xl mx-auto relative z-10 leading-relaxed uppercase tracking-wider italic">
                        Be part of Naga City's fastest growing delivery service.
                    </p>
                </div>

                <div className="p-8 sm:p-12 space-y-16">
                    {/* Mission & Vision */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                <Target size={32} />
                            </div>
                            <h2 className="text-3xl font-black text-brand-charcoal uppercase tracking-tight">Our Mission</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                To revolutionize delivery services in Naga City by providing fast, reliable, and customer-centric solutions. We empower our riders to be the face of excellence, ensuring every delivery is handled with care and professionalism.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <Eye size={32} />
                            </div>
                            <h2 className="text-3xl font-black text-brand-charcoal uppercase tracking-tight">Our Vision</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                To become the most trusted and preferred delivery service in Bicol, known for our reliability, speed, and exceptional customer service. We aim to create opportunities for our riders to build successful careers while serving our community.
                            </p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Rider Position Info */}
                    <div className="bg-brand-charcoal rounded-[2rem] p-8 sm:p-14 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="inline-flex items-center space-x-2 bg-green-primary/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-green-500/30">
                                <span className="flex h-2 w-2 rounded-full bg-green-primary animate-pulse"></span>
                                <span className="text-xs font-black uppercase tracking-widest text-green-primary">Hiring Now</span>
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black mb-2 uppercase tracking-tight leading-none text-brand-accent">Rider Position</h2>
                            <p className="text-gray-400 text-base sm:text-xl mb-12 italic uppercase tracking-widest font-bold opacity-60">Full-time • Naga City</p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black uppercase text-green-primary tracking-wide">About the Role</h3>
                                    <p className="text-gray-300 leading-relaxed text-lg font-medium">
                                        Join our team as a Rider and be the backbone of One Click Delivery. You'll be responsible for delivering orders quickly and safely across Naga City. We're looking for reliable, professional riders who take pride in their work and are committed to customer satisfaction.
                                    </p>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black uppercase text-green-primary tracking-wide">Requirements</h3>
                                    <ul className="space-y-4">
                                        {[
                                            { icon: <Bike size={20} />, text: "Own Motorcycle: In good working condition" },
                                            { icon: <CheckCircle2 size={20} />, text: "Valid License: Motorcycle driver's license" },
                                            { icon: <MapPin size={20} />, text: "Knowledge of City: Familiar with Naga routes" },
                                            { icon: <Star size={20} />, text: "Reliability: Punctual and committed" }
                                        ].map((item, id) => (
                                            <li key={id} className="flex items-center space-x-4 text-gray-200 text-lg">
                                                <span className="text-green-primary">{item.icon}</span>
                                                <span>{item.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-12 p-8 bg-white/5 rounded-2xl border border-white/10">
                                <h3 className="text-xl font-black uppercase text-brand-accent mb-4">Why Join Us?</h3>
                                <p className="text-gray-300 text-lg">
                                    Competitive compensation, flexible hours, professional support, and the opportunity to be part of a growing company that values its team members.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Application Form */}
                    <div id="apply-now" className="space-y-10 pt-8 text-center sm:text-left">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl font-black text-brand-charcoal uppercase tracking-tight mb-4">Apply Now</h2>
                            <p className="text-gray-500 text-xl font-medium leading-relaxed">
                                Ready to join our team? Fill out the form below and we'll get back to you soon.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3 text-left">
                                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Full Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.25rem] font-bold text-brand-charcoal outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all text-lg shadow-inner"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 text-left">
                                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Phone Number *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.25rem] font-bold text-brand-charcoal outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all text-lg shadow-inner"
                                            placeholder="09XX-XXX-XXXX"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 text-left">
                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Tell us about yourself *</label>
                                <textarea
                                    name="aboutMe"
                                    value={formData.aboutMe}
                                    onChange={handleInputChange}
                                    className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[1.25rem] font-bold text-brand-charcoal outline-none focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:border-brand-primary transition-all text-lg shadow-inner min-h-[180px]"
                                    placeholder="Share your experience, why you want to join us, and what makes you a great rider..."
                                    required
                                />
                            </div>

                            <div className="bg-orange-50 border-2 border-orange-100 rounded-[1.5rem] p-8 text-orange-800 text-center space-y-2">
                                <p className="font-black text-xl">Really sorry — we're a startup. 🚀</p>
                                <p className="text-lg font-medium">Please tap <strong>"Copy application text"</strong>, then <strong>"Open Messenger"</strong>, and paste the message there.</p>
                            </div>

                            <div className="bg-gray-50 rounded-[1.5rem] p-8 border border-gray-100 space-y-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest text-left w-full">Application Preview</h3>
                                    <button
                                        onClick={copyToClipboard}
                                        className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg ${copySuccess ? 'bg-green-500 text-white shadow-green-200' : 'bg-white text-brand-charcoal hover:bg-gray-100 border border-gray-200 shadow-gray-100'}`}
                                    >
                                        {copySuccess ? <span>Copied!</span> : <><Copy className="h-4 w-4" /> Copy application text</>}
                                    </button>
                                </div>
                                <div className="bg-white p-8 rounded-2xl border border-gray-100 font-mono text-lg whitespace-pre-wrap text-gray-600 shadow-inner text-left">
                                    {generateMessageText()}
                                </div>
                                <p className="text-gray-400 text-sm italic font-medium">Paste the copied text into the Messenger chat.</p>
                            </div>

                            {/* Final Actions */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                <button
                                    onClick={copyToClipboard}
                                    className="w-full py-6 bg-white border-2 border-brand-primary text-brand-primary rounded-[1.5rem] font-black text-xl hover:bg-brand-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-xl shadow-brand-primary/10 flex items-center justify-center gap-3"
                                >
                                    <Copy className="h-7 w-7" />
                                    COPY APPLICATION TEXT
                                </button>
                                <button
                                    onClick={openMessenger}
                                    disabled={isSubmitting}
                                    className="w-full py-6 bg-brand-primary text-white rounded-[1.5rem] font-black text-xl hover:bg-green-700 transition-all transform hover:-translate-y-1 shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    <MessageSquare className="h-7 w-7" />
                                    {isSubmitting ? 'PROCESSING...' : 'OPEN MESSENGER'}
                                </button>
                            </div>
                            <p className="text-gray-400 font-bold text-base text-center pt-4">
                                Your information will be sent via Messenger. Copy and paste the previewed text.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinTeam;
