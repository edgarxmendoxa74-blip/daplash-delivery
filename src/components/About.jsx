import { motion } from 'framer-motion';
import { Target, Users, Clock, Smile } from 'lucide-react';

const About = () => {
    const stats = [
        { label: "Deliveries Today", value: "150+" },
        { label: "Active Riders", value: "25+" },
        { label: "Partner Shops", value: "40+" },
        { label: "Customer Rating", value: "4.9/5" },
    ];

    return (
        <section id="about" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div className="relative z-10 rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-4 sm:border-8 border-white">
                            <img
                                src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=800"
                                alt="Delivery Rider"
                                className="w-full h-auto object-cover aspect-[4/3] sm:aspect-auto"
                            />
                        </div>
                        {/* Decorative dots/shapes */}
                        <div className="absolute -top-6 -left-6 sm:-top-10 sm:-left-10 w-32 h-32 sm:w-40 sm:h-40 bg-daplash-yellow/10 rounded-full blur-2xl -z-10"></div>
                        <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 w-32 h-32 sm:w-40 sm:h-40 bg-daplash-blue/10 rounded-full blur-2xl -z-10"></div>
                    </motion.div>

                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl md:text-5xl font-black text-daplash-dark mb-6 leading-tight"
                        >
                            DRIVEN BY <span className="text-daplash-blue">PASSION</span>, <br />
                            POWERED BY <span className="text-daplash-yellow">SPEED</span>.
                        </motion.h2>
                        <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
                            Daplash Delivery started with a simple mission: to bridge the gap between Naga City businesses and their customers. We believe that delivery isn't just about moving items—it's about <span className="text-daplash-blue font-bold">delivering happiness</span>.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-daplash-blue shrink-0">
                                    <Target size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Our Mission</h4>
                                    <p className="text-gray-500 text-sm">To be the most trusted delivery partner for every household.</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4">
                                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-daplash-yellow shrink-0">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Community First</h4>
                                    <p className="text-gray-500 text-sm">Supporting local restaurants by expanding their reach.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center p-3 sm:p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <p className="text-xl sm:text-2xl font-black text-daplash-blue">{stat.value}</p>
                                    <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
