import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Bike, Package, CheckCircle2, X, Phone, Star } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

// Custom Icons
const riderIcon = new L.DivIcon({
    html: `<div class="w-10 h-10 bg-daplash-blue rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
           </div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

const destinationIcon = new L.DivIcon({
    html: `<div class="w-10 h-10 bg-daplash-yellow rounded-full border-4 border-white flex items-center justify-center text-daplash-dark shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
           </div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

// Component to handle map center updates
const ChangeView = ({ center }) => {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
};

const RiderTracking = ({ isOpen, onClose, bookingData }) => {
    const startPos = [14.5995, 120.9842]; // Manila center as default start
    const endPos = [14.6042, 121.0503]; // A bit further for demo

    const [riderPos, setRiderPos] = useState(startPos);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Preparing Order");
    const [eta, setEta] = useState(25);

    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setStatus("Arrived at Destination");
                    setEta(0);
                    return 100;
                }

                const next = prev + 1;

                // Update status based on progress
                if (next < 20) setStatus("Preparing your order...");
                else if (next < 40) setStatus("Rider is picking up...");
                else if (next < 90) setStatus("Rider is on the way!");
                else setStatus("Rider is arriving soon!");

                // Update ETA
                setEta(Math.max(0, Math.floor(25 * (1 - next / 100))));

                // Calculate intermediate coordinates
                const lat = startPos[LatIndex] + (endPos[LatIndex] - startPos[LatIndex]) * (next / 100);
                const lng = startPos[LngIndex] + (endPos[LngIndex] - startPos[LngIndex]) * (next / 100);
                setRiderPos([lat, lng]);

                return next;
            });
        }, 800);

        return () => clearInterval(interval);
    }, [isOpen]);

    const LatIndex = 0;
    const LngIndex = 1;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[150] bg-white flex flex-col md:flex-row h-screen">
                {/* Close Button Mobile */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[160] p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg md:hidden"
                >
                    <X size={24} className="text-daplash-dark" />
                </button>

                {/* Left Side: Map */}
                <div className="flex-1 relative h-[40vh] md:h-full">
                    <MapContainer
                        center={startPos}
                        zoom={13}
                        className="w-full h-full"
                        zoomControl={false}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <ChangeView center={riderPos} />
                        <Marker position={riderPos} icon={riderIcon}>
                            <Popup className="font-bold">Daplash Rider is here</Popup>
                        </Marker>
                        <Marker position={endPos} icon={destinationIcon}>
                            <Popup className="font-bold">Delivery Address</Popup>
                        </Marker>
                    </MapContainer>

                    {/* Map Legend/Status Overlay */}
                    <div className="absolute top-6 left-6 z-[160] hidden md:block">
                        <div className="bg-white/90 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/50 max-w-sm">
                            <h2 className="text-2xl font-black text-daplash-dark mb-4 tracking-tight uppercase">
                                TRACKING <span className="text-daplash-blue">RIDER</span>
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-daplash-yellow rounded-2xl flex items-center justify-center text-daplash-dark">
                                        <Navigation size={24} className="animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Status</p>
                                        <p className="text-lg font-black text-daplash-dark">{status}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-daplash-blue">
                                        <Bike size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">ETA</p>
                                        <p className="text-lg font-black text-daplash-dark">{eta} Minutes</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Tracking Details / Dashboard */}
                <div className="w-full md:w-[450px] bg-gray-50 flex flex-col h-[60vh] md:h-full overflow-y-auto">
                    {/* Header Desktop */}
                    <div className="hidden md:flex p-8 justify-between items-center bg-white border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-daplash-yellow rounded-xl flex items-center justify-center text-daplash-dark">
                                <Package size={20} />
                            </div>
                            <span className="font-black text-xl tracking-tight">DAPLASH TRACK</span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                        {/* Progress Tracker */}
                        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black text-lg text-daplash-dark uppercase tracking-tight">Delivery Status</h3>
                                <span className="bg-daplash-blue/10 text-daplash-blue px-3 py-1 rounded-full text-xs font-black uppercase">{progress}% Done</span>
                            </div>

                            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-daplash-yellow to-daplash-blue rounded-full shadow-lg"
                                />
                            </div>

                            <div className="space-y-6">
                                <StatusItem active={progress >= 20} done={progress > 20} title="Order Confirmed" icon={<CheckCircle2 size={18} />} />
                                <StatusItem active={progress >= 40 && progress < 90} done={progress >= 90} title="At Restaurant/Store" icon={<Utensils size={18} />} />
                                <StatusItem active={progress >= 90 && progress < 100} done={progress >= 100} title="Rider is Arriving" icon={<Bike size={18} />} />
                                <StatusItem active={progress >= 100} done={false} title="Successfully Delivered" icon={<ShoppingBag size={18} />} />
                            </div>
                        </div>

                        {/* Rider Profile Card */}
                        <div className="bg-daplash-dark text-white p-6 sm:p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Your Rider</p>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-3xl overflow-hidden border-2 border-daplash-yellow relative">
                                            <img
                                                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop"
                                                alt="Rider"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xl font-black">MARK RIVERA</p>
                                            <div className="flex items-center space-x-1 text-daplash-yellow">
                                                <Star size={14} fill="currentColor" />
                                                <span className="text-sm font-bold">4.9 (2k+ Deliveries)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <a href="https://m.me/100064173395989" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center text-daplash-yellow transition-colors">
                                        <Phone size={24} />
                                    </a>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-400 text-sm font-bold bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <Bike size={18} />
                                    <span>Riding: Black Honda Click (XXX-123)</span>
                                </div>
                            </div>
                        </div>

                        {/* Help Button */}
                        <button className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 font-black rounded-2xl hover:border-daplash-blue hover:text-daplash-blue transition-all">
                            HELP & SUPPORT
                        </button>
                    </div>
                </div>
            </div>
        </AnimatePresence>
    );
};

const StatusItem = ({ active, done, title, icon }) => (
    <div className={`flex items-center space-x-4 transition-colors duration-500 ${active || done ? 'text-daplash-dark' : 'text-gray-300'}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${done ? 'bg-green-500 text-white shadow-lg shadow-green-200' : active ? 'bg-daplash-yellow text-daplash-dark shadow-lg shadow-daplash-yellow/30 scale-110' : 'bg-gray-50 text-gray-300'}`}>
            {done ? <CheckCircle2 size={24} /> : icon}
        </div>
        <div>
            <p className={`font-black uppercase tracking-tight ${active ? 'text-base' : 'text-sm'}`}>{title}</p>
            {active && <p className="text-[10px] text-daplash-blue font-bold uppercase tracking-widest mt-0.5 animate-pulse italic">In Progress...</p>}
        </div>
    </div>
);

export default RiderTracking;
