import { motion } from 'framer-motion';
import { Send, User, Phone, MapPin, Package } from 'lucide-react';

const BookingForm = () => {
    return (
        <section id="booking" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="text-center lg:text-left">
                        <h2 className="text-4xl sm:text-5xl font-black text-daplash-dark mb-6 sm:mb-8 leading-tight">
                            READY TO <br />
                            <span className="text-daplash-blue">BOOK A DELIVERY?</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 leading-relaxed">
                            Fill out the form and our team will get back to you instantly. We're ready when you are!
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-12">
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-daplash-blue shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Call Us</h4>
                                    <p className="text-gray-500">09XX-XXX-XXXX</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-daplash-yellow shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Location</h4>
                                    <p className="text-gray-500">Naga City</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-6 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-gray-100"
                    >
                        <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full pl-11 pr-4 py-3 sm:py-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl focus:border-daplash-blue focus:ring-2 focus:ring-daplash-blue/10 outline-none transition-all text-sm sm:text-base"
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        className="w-full pl-11 pr-4 py-3 sm:py-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl focus:border-daplash-blue focus:ring-2 focus:ring-daplash-blue/10 outline-none transition-all text-sm sm:text-base"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Pickup Location"
                                    className="w-full pl-11 pr-4 py-3 sm:py-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl focus:border-daplash-blue focus:ring-2 focus:ring-daplash-blue/10 outline-none transition-all text-sm sm:text-base"
                                />
                            </div>

                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Drop-off Location"
                                    className="w-full pl-11 pr-4 py-3 sm:py-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl focus:border-daplash-blue focus:ring-2 focus:ring-daplash-blue/10 outline-none transition-all text-sm sm:text-base"
                                />
                            </div>

                            <div className="relative">
                                <Package className="absolute left-4 top-4 text-gray-400" size={18} />
                                <textarea
                                    rows="3"
                                    placeholder="Package Details..."
                                    className="w-full pl-11 pr-4 py-3 sm:py-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl focus:border-daplash-blue focus:ring-2 focus:ring-daplash-blue/10 outline-none transition-all resize-none text-sm sm:text-base"
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full btn-secondary flex items-center justify-center space-x-2 py-4 sm:py-5 text-lg">
                                <span>Send Request</span>
                                <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BookingForm;
