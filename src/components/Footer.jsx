import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-daplash-dark text-white pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1 whitespace-nowrap">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-10 h-10 bg-daplash-yellow rounded-full flex items-center justify-center font-bold text-daplash-dark text-xl">D</div>
                            <span className="text-2xl font-bold tracking-tight">DAPLASH <span className="text-daplash-blue">DELIVERY</span></span>
                        </div>
                        <p className="text-gray-400 max-w-xs mb-8">
                            Delivering happiness across Naga City. Fast, reliable, and friendly service for all your delivery needs.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-daplash-blue transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-daplash-blue transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-daplash-blue transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-daplash-yellow transition-colors">Home</a></li>
                            <li><a href="#services" className="hover:text-daplash-yellow transition-colors">Services</a></li>
                            <li><a href="#about" className="hover:text-daplash-yellow transition-colors">About Us</a></li>
                            <li><a href="#contact" className="hover:text-daplash-yellow transition-colors">Contact</a></li>
                            <li><a href="/admin" className="hover:text-daplash-yellow transition-colors opacity-50 hover:opacity-100 text-[10px] font-black uppercase tracking-widest pt-4 block border-t border-white/5 mt-4">Admin Login</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-xl font-bold mb-6">Services</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li>Food Delivery</li>
                            <li>Parcel & Documents</li>
                            <li>Grocery Shopping</li>
                            <li>Pabili Service</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xl font-bold mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start space-x-3">
                                <Phone className="text-daplash-yellow mt-1 shrink-0" size={18} />
                                <span>09XX-XXX-XXXX</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <Mail className="text-daplash-yellow mt-1 shrink-0" size={18} />
                                <span>hello@daplash.com</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPin className="text-daplash-yellow mt-1 shrink-0" size={18} />
                                <span>Naga City, Camarines Sur, Philippines</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} Daplash Delivery. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
