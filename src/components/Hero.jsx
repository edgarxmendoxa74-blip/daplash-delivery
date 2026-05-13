import { motion } from 'framer-motion';
import { Package, Zap } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative flex items-center py-16 sm:py-24 overflow-hidden bg-gradient-to-br from-green-50 via-brand-light to-green-100">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-primary/10 rounded-full blur-3xl -mr-64 -mt-24" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-accent/10 rounded-full blur-3xl -ml-48 -mb-24" />

            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="order-1 lg:order-1 text-center lg:text-left pt-10 lg:pt-0"
                >
                    <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur shadow-sm px-4 py-2 rounded-full mb-6 border border-green-100">
                        <span className="flex h-2 w-2 rounded-full bg-green-primary animate-pulse"></span>
                        <span className="text-xs sm:text-sm font-bold text-brand-charcoal uppercase tracking-wider">Open for Orders in Naga City</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-brand-charcoal leading-[0.9] mb-4 tracking-tighter uppercase">
                        WE DELIVER <br />
                        <span className="text-green-primary">HAPPINESS.</span>
                    </h1>

                    <p className="text-sm sm:text-lg text-gray-600 mb-8 sm:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                        Your satisfaction is our priority. Fastest and most reliable delivery service in Naga City.
                    </p>


                    <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-sm">
                                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-brand-charcoal font-extrabold text-xs sm:text-base">2,300+ Happy Clients</p>
                            <div className="flex justify-center sm:justify-start text-brand-accent text-[10px] sm:text-sm">
                                {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="order-2 lg:order-2 relative flex items-center justify-center mt-10 lg:mt-0"
                >
                    {/* Main Logo Image */}
                    <div className="relative w-full max-w-[260px] sm:max-w-sm">
                        <div className="absolute inset-0 bg-green-primary/20 rounded-3xl rotate-3 sm:rotate-6 -z-10 blur-sm"></div>
                        <img
                            src="https://scontent.fcrk4-1.fna.fbcdn.net/v/t39.30808-1/611249515_1271314161684352_3439360183148654677_n.jpg?stp=dst-jpg_tt6&cstp=mx500x500&ctp=s500x500&_nc_cat=108&ccb=1-7&_nc_sid=3ab345&_nc_ohc=Lu49tF-2uEAQ7kNvwFn6e1V&_nc_oc=Adkfb1ss3g3zke8rGta5N1MXz2H6H8nyDxmSchzSikorWCdrsfNXNldC5UZOFauVEX0&_nc_zt=24&_nc_ht=scontent.fcrk4-1.fna&_nc_gid=a_ouJkg1qitpO1Mt6lHnEg&_nc_ss=8&oh=00_AfxHn0IftkPNQI9JTvlWBD3QFVorvRqDyr-_j9PxSFRonw&oe=69B6AA40"
                            alt="Daplash Delivery Logo"
                            className="w-full h-auto rounded-3xl shadow-2xl"
                        />

                        {/* Floating elements - adjusted for mobile */}
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-4 -right-2 sm:-top-12 sm:-right-12 bg-white/90 backdrop-blur-md p-2 sm:p-5 rounded-xl sm:rounded-3xl shadow-2xl flex items-center space-x-2 sm:space-x-4 border border-white/50 z-20 scale-90 sm:scale-100"
                        >
                            <div className="w-8 h-8 sm:w-14 sm:h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-primary shadow-inner relative overflow-hidden">
                                <div className="absolute inset-0 bg-green-100/50 scale-110 rotate-12"></div>
                                <Package size={18} className="relative z-10 sm:w-8 sm:h-8" />
                            </div>
                            <div>
                                <p className="text-[8px] sm:text-xs text-brand-secondary font-bold uppercase tracking-[0.15em]">Fast Delivery</p>
                                <p className="text-xs sm:text-lg text-brand-charcoal font-black tracking-tight">20 - 30 minutes</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-4 -left-2 sm:-bottom-12 sm:-left-12 bg-white/90 backdrop-blur-md p-2 sm:p-5 rounded-xl sm:rounded-3xl shadow-2xl flex items-center space-x-2 sm:space-x-4 border border-white/50 z-20 scale-90 sm:scale-100"
                        >
                            <div className="w-8 h-8 sm:w-14 sm:h-14 bg-yellow-50 rounded-xl flex items-center justify-center text-brand-accent shadow-inner relative overflow-hidden">
                                <div className="absolute inset-0 bg-yellow-100/50 scale-110 -rotate-12"></div>
                                <Zap size={18} className="relative z-10 sm:w-8 sm:h-8 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-[8px] sm:text-xs text-brand-secondary font-bold uppercase tracking-[0.15em]">Trusted by</p>
                                <p className="text-xs sm:text-lg text-brand-charcoal font-black tracking-tight">LOCAL SHOPS</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
