import { useState, useEffect } from 'react';
import { Menu, X, Phone, MapPin, Users, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettings } from '../hooks/useSiteSettings';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [contactModalOpen, setContactModalOpen] = useState(false);
    const { siteSettings } = useSiteSettings();

    const contactPhone = siteSettings?.contact_phone || '09569414260';
    const contactEmail = siteSettings?.contact_email || 'support@daplash.com';
    const messengerLink = `https://m.me/${siteSettings?.messenger_id || '100064173395989'}`;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-transparent'}`}>
            {/* Top Bar */}
            <div className={`bg-brand-primary text-white py-2 px-6 transition-all duration-300 ${isScrolled ? 'hidden' : 'block'}`}>
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-brand-accent" />
                            <span>{contactPhone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-brand-accent">
                            <MapPin size={12} />
                            <span>📍 Naga City</span>
                        </div>
                    </div>
                    <div className="hidden md:block text-white">
                        Fast & Reliable Delivery Service
                    </div>
                </div>
            </div>

            <div className={`container mx-auto px-6 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
                <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 overflow-hidden rounded-full border-2 border-brand-accent shadow-sm transition-transform group-hover:scale-110">
                        <img
                            src={siteSettings?.site_logo || '/daplash-logo.jpg'}
                            alt="Daplash Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-base sm:text-xl font-black tracking-tight text-brand-charcoal whitespace-nowrap">
                        DAPLASH <span className="text-brand-primary">DELIVERY</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link to="/join-team" className="text-sm font-bold text-gray-600 hover:text-brand-primary transition-colors">
                        Join Our Team
                    </Link>
                    <button onClick={() => setContactModalOpen(true)} className="btn-primary flex items-center space-x-2 px-6 py-2.5 text-sm">
                        <Phone size={16} />
                        <span>Contact Us</span>
                    </button>
                </nav>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center">
                    <button className="p-2 text-brand-charcoal" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-white z-[60] py-20 px-6 flex flex-col space-y-6">
                    <button className="absolute top-5 right-6 p-2 text-brand-charcoal" onClick={() => setMobileMenuOpen(false)}>
                        <X size={32} />
                    </button>
                    <button
                        onClick={() => {
                            setContactModalOpen(true);
                            setMobileMenuOpen(false);
                        }}
                        className="bg-brand-accent text-brand-charcoal p-6 rounded-2xl text-2xl font-black flex items-center justify-center space-x-3 shadow-lg shadow-brand-accent/20"
                    >
                        <Phone size={24} />
                        <span>Contact Us</span>
                    </button>
                    <Link
                        to="/join-team"
                        className="bg-gray-100 text-brand-charcoal p-6 rounded-2xl text-2xl font-black flex items-center justify-center space-x-3"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <Users size={24} />
                        <span>Join Our Team</span>
                    </Link>
                    <div className="mt-auto pb-10 flex border-t pt-10 border-gray-100">
                    </div>
                </div>
            )}

            {/* Contact Details Modal */}
            <AnimatePresence>
                {contactModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setContactModalOpen(false)}
                            className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 text-brand-charcoal"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">GET IN TOUCH</h3>
                                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">We're here to help you</p>
                                </div>
                                <button
                                    onClick={() => setContactModalOpen(false)}
                                    className="p-2 bg-gray-50 text-gray-400 hover:text-brand-charcoal rounded-full transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <a
                                    href={`tel:${contactPhone}`}
                                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100/50 hover:bg-brand-primary hover:text-white hover:scale-[1.02] transition-all group"
                                >
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-primary group-hover:bg-white/20 group-hover:text-white transition-colors">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Call Us Directly</p>
                                        <p className="text-lg font-black">{contactPhone}</p>
                                    </div>
                                </a>

                                <a
                                    href={`mailto:${contactEmail}`}
                                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100/50 hover:bg-brand-accent hover:text-brand-charcoal hover:scale-[1.02] transition-all group"
                                >
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-accent group-hover:bg-white/20 group-hover:text-brand-charcoal transition-colors">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Send an Email</p>
                                        <p className="text-lg font-black break-all">{contactEmail}</p>
                                    </div>
                                </a>

                                <a
                                    href={messengerLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100/50 hover:bg-blue-600 hover:text-white hover:scale-[1.02] transition-all group"
                                >
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                        <MessageSquare size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Chat on Messenger</p>
                                        <p className="text-lg font-black">Official FB Page</p>
                                    </div>
                                </a>
                            </div>

                            <div className="mt-8 flex justify-center">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] text-center">
                                    AVAILABLE 24/7 FOR YOUR NEEDS
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
