import { useState, useEffect } from 'react';
import { Menu, X, Phone, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <div className={`bg-brand-charcoal text-white py-2 px-6 transition-all duration-300 ${isScrolled ? 'hidden' : 'block'}`}>
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-brand-accent" />
                            <span>09569414260</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-brand-primary" />
                            <span>Serving Naga City</span>
                        </div>
                    </div>
                    <div className="hidden md:block text-gray-400">
                        Fast & Reliable Delivery Service
                    </div>
                </div>
            </div>

            <div className={`container mx-auto px-6 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
                <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 overflow-hidden rounded-full border-2 border-brand-accent shadow-sm transition-transform group-hover:scale-110">
                        <img
                            src="https://scontent.fcrk4-1.fna.fbcdn.net/v/t39.30808-1/611249515_1271314161684352_3439360183148654677_n.jpg?stp=dst-jpg_tt6&cstp=mx500x500&ctp=s500x500&_nc_cat=108&ccb=1-7&_nc_sid=3ab345&_nc_ohc=Lu49tF-2uEAQ7kNvwFn6e1V&_nc_oc=Adkfb1ss3g3zke8rGta5N1MXz2H6H8nyDxmSchzSikorWCdrsfNXNldC5UZOFauVEX0&_nc_zt=24&_nc_ht=scontent.fcrk4-1.fna&_nc_gid=a_ouJkg1qitpO1Mt6lHnEg&_nc_ss=8&oh=00_AfxHn0IftkPNQI9JTvlWBD3QFVorvRqDyr-_j9PxSFRonw&oe=69B6AA40"
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
                    <a href="https://m.me/100064173395989" target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center space-x-2 px-6 py-2.5 text-sm">
                        <Phone size={16} />
                        <span>Contact Us</span>
                    </a>
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
                    <a
                        href="https://m.me/100064173395989"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-brand-accent text-brand-charcoal p-6 rounded-2xl text-2xl font-black flex items-center justify-center space-x-3 shadow-lg shadow-brand-accent/20"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <Phone size={24} />
                        <span>Contact Us</span>
                    </a>
                    <Link
                        to="/join-team"
                        className="bg-gray-100 text-brand-charcoal p-6 rounded-2xl text-2xl font-black flex items-center justify-center space-x-3"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <Users size={24} />
                        <span>Join Our Team</span>
                    </Link>
                    <div className="mt-auto pb-10 flex border-t pt-10 border-gray-100">
                        <a href="https://m.me/100064173395989" target="_blank" rel="noopener noreferrer" className="flex flex-col space-y-2 group">
                            <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Chat with us on</p>
                            <p className="text-xl font-black text-brand-charcoal group-hover:text-brand-primary transition-colors">FB MESSENGER</p>
                        </a>
                        <a href="/admin" className="ml-auto text-[10px] font-black text-gray-300 hover:text-brand-primary uppercase tracking-widest transition-colors" onClick={() => setMobileMenuOpen(false)}>
                            Admin Login
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
