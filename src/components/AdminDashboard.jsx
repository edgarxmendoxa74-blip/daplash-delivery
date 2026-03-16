import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageSquare,
    Truck,
    LogOut,
    Menu,
    X,
    Plus,
    Edit3,
    Trash2,
    Check,
    AlertCircle,
    Save,
    UtensilsCrossed,
    Image,
    DollarSign,
    ClipboardList,
    ShoppingCart,
    Package,
    Eye,
    RefreshCw,
    Store,
    Zap,
    Utensils,
    Settings,
    Globe,
    Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './ImageUpload';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('stores');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Data states
    const [faqs, setFaqs] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [foodOrders, setFoodOrders] = useState([]);
    const [manualOrders, setManualOrders] = useState([]);
    const [pasakayBookings, setPasakayBookings] = useState([]);
    const [stores, setStores] = useState([]);
    const [requests, setRequests] = useState([]);
    const [siteSettings, setSiteSettings] = useState([]);

    // Edit Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemType, setItemType] = useState('stores'); // 'stores' or 'faq'

    // Booking detail modal
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookingFilter, setBookingFilter] = useState('all'); // 'all', 'pending', 'confirmed', 'completed'

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/admin');
            } else {
                setUser(user);
                fetchData();
            }
            setLoading(false);
        };

        checkUser();
    }, [navigate]);

    const fetchData = async () => {
        const { data: faqsData } = await supabase.from('faqs').select('*').order('order_index');
        const { data: bookingsData } = await supabase.from('padala_bookings').select('*').order('created_at', { ascending: false });
        const { data: foodData } = await supabase.from('food_orders').select('*').order('created_at', { ascending: false });
        const { data: manualData } = await supabase.from('manual_orders').select('*').order('created_at', { ascending: false });
        const { data: pasakayData } = await supabase.from('pasakay_bookings').select('*').order('created_at', { ascending: false });
        const { data: storesData } = await supabase.from('stores').select('*').order('order_index');
        const { data: requestsData } = await supabase.from('requests').select('*').order('created_at', { ascending: false });
        const { data: settingsData } = await supabase.from('site_settings').select('*').order('id');

        setFaqs(faqsData || []);
        setBookings(bookingsData || []);
        setFoodOrders(foodData || []);
        setManualOrders(manualData || []);
        setPasakayBookings(pasakayData || []);
        setStores(storesData || []);
        setRequests(requestsData || []);
        setSiteSettings(settingsData || []);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin');
    };

    const handleDelete = async (id, table) => {
        if (!window.confirm('Are you sure you want to delete this?')) return;
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (!error) fetchData();
    };

    const handleUpdateBookingStatus = async (id, table, newStatus) => {
        const { error } = await supabase.from(table).update({ status: newStatus }).eq('id', id);
        if (!error) fetchData();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        let table;
        if (itemType === 'menu') table = 'menu_items';
        else if (itemType === 'faq') table = 'faqs';
        else if (itemType === 'stores') table = 'stores';

        let error;
        if (editingItem.id) {
            ({ error } = await supabase.from(table).update(editingItem).eq('id', editingItem.id));
        } else {
            ({ error } = await supabase.from(table).insert([editingItem]));
        }

        if (!error) {
            setIsEditModalOpen(false);
            fetchData();
        } else {
            alert(error.message);
        }
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'confirmed': case 'resolved': return 'bg-blue-100 text-blue-700';
            case 'in_transit': case 'in transit': case 'in_progress': return 'bg-purple-100 text-purple-700';
            case 'completed': case 'delivered': case 'closed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Determine booking type label
    const getBookingType = (booking) => {
        if (booking.item_description?.includes('[') && booking.item_description?.includes('•')) return 'Pabili';
        return 'Padala';
    };

    // Filter bookings
    const filteredBookings = bookings.filter(b => {
        if (bookingFilter === 'all') return true;
        return b.status?.toLowerCase() === bookingFilter;
    });

    const filteredFoodOrders = foodOrders.filter(o => {
        if (bookingFilter === 'all') return true;
        return o.status?.toLowerCase() === bookingFilter;
    });

    // Get header title based on active tab
    const getHeaderTitle = () => {
        switch (activeTab) {
            case 'menu': return 'Manage Product Menu';
            case 'faqs': return 'Manage FAQs';
            case 'bookings': return 'Pabili & Padala Bookings';
            case 'food_orders': return 'Product Orders';
            case 'manual_orders': return 'Manual Orders';
            case 'pasakay': return 'Pasakay Bookings';
            case 'stores': return 'Stores Management';
            case 'requests': return 'Support Requests';
            case 'settings': return 'Site Settings';
            default: return 'Dashboard';
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FC] flex font-outfit">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-gray-100 p-8 pt-10">
                <div className="flex items-center space-x-4 mb-12 ml-2">
                    <div className="w-12 h-12 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-charcoal shadow-lg shadow-brand-accent/20">
                        <Truck size={24} />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-black text-brand-charcoal truncate">Administrator</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Master Control</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarLink icon={<Store size={20} />} label="Stores" active={activeTab === 'stores'} onClick={() => setActiveTab('stores')} />
                    <SidebarLink icon={<ShoppingCart size={20} />} label="Product Orders" active={activeTab === 'food_orders'} onClick={() => setActiveTab('food_orders')} />
                    <SidebarLink icon={<Plus size={20} />} label="Manual Orders" active={activeTab === 'manual_orders'} onClick={() => setActiveTab('manual_orders')} />
                    <SidebarLink icon={<ClipboardList size={20} />} label="Pabili / Padala" active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
                    <SidebarLink icon={<Zap size={20} />} label="Pasakay" active={activeTab === 'pasakay'} onClick={() => setActiveTab('pasakay')} />
                    <SidebarLink icon={<MessageSquare size={20} />} label="FAQs" active={activeTab === 'faqs'} onClick={() => setActiveTab('faqs')} />
                    <SidebarLink icon={<Mail size={20} />} label="Requests" active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
                    <SidebarLink icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </nav>

                <div className="mt-auto pt-8 border-t border-gray-100">
                    <button onClick={handleLogout} className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl flex items-center justify-center space-x-3">
                        <LogOut size={20} />
                        <span>LOGOUT</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-[200] lg:hidden">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="absolute inset-y-0 left-0 w-80 bg-white p-8 flex flex-col" >
                            <div className="flex justify-between items-center mb-10">
                                <h1 className="text-xl font-black text-brand-charcoal tracking-tight">DAPLASH <span className="text-brand-primary">ADMIN</span></h1>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400"><X size={24} /></button>
                            </div>
                            <nav className="space-y-2 mb-auto">
                                <SidebarLink icon={<Store size={20} />} label="Stores" active={activeTab === 'stores'} onClick={() => { setActiveTab('stores'); setMobileMenuOpen(false); }} />
                                <SidebarLink icon={<ShoppingCart size={20} />} label="Product Orders" active={activeTab === 'food_orders'} onClick={() => { setActiveTab('food_orders'); setMobileMenuOpen(false); }} />
                                <SidebarLink icon={<Plus size={20} />} label="Manual Orders" active={activeTab === 'manual_orders'} onClick={() => { setActiveTab('manual_orders'); setMobileMenuOpen(false); }} />
                                <SidebarLink icon={<ClipboardList size={20} />} label="Pabili / Padala" active={activeTab === 'bookings'} onClick={() => { setActiveTab('bookings'); setMobileMenuOpen(false); }} />
                                <SidebarLink icon={<Zap size={20} />} label="Pasakay" active={activeTab === 'pasakay'} onClick={() => { setActiveTab('pasakay'); setMobileMenuOpen(false); }} />
                                <SidebarLink icon={<MessageSquare size={20} />} label="FAQs" active={activeTab === 'faqs'} onClick={() => { setActiveTab('faqs'); setMobileMenuOpen(false); }} />
                                <SidebarLink icon={<Mail size={20} />} label="Requests" active={activeTab === 'requests'} onClick={() => { setActiveTab('requests'); setMobileMenuOpen(false); }} />
                                <SidebarLink icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }} />
                            </nav>
                            <button onClick={handleLogout} className="mt-10 py-4 bg-red-50 text-red-600 font-bold rounded-2xl flex items-center justify-center space-x-3">
                                <LogOut size={20} /> <span>LOGOUT</span>
                            </button>
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-[100]">
                    <div className="flex items-center">
                        <button onClick={() => setMobileMenuOpen(true)} className="p-2 lg:hidden mr-4"><Menu size={24} /></button>
                        <h2 className="text-xl font-black text-brand-charcoal uppercase">{getHeaderTitle()}</h2>
                    </div>
                    <div className="flex items-center space-x-3">
                        {(activeTab === 'bookings' || activeTab === 'food_orders' || activeTab === 'manual_orders' || activeTab === 'pasakay' || activeTab === 'stores') && (
                            <button onClick={fetchData} className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors" title="Refresh">
                                <RefreshCw size={18} />
                            </button>
                        )}
                        {(activeTab === 'faqs' || activeTab === 'stores') && (
                            <button
                                onClick={() => {
                                    setItemType(activeTab);
                                    if (activeTab === 'faqs') {
                                        setEditingItem({ question: '', answer: '', order_index: faqs.length });
                                    } else if (activeTab === 'stores') {
                                        setEditingItem({ name: '', description: '', image_url: '', menu_image_url: '', location: '', contact: '', is_active: true, order_index: stores.length });
                                    }
                                    setIsEditModalOpen(true);
                                }}
                                className="px-6 py-3 bg-brand-charcoal text-white font-black rounded-xl text-sm flex items-center space-x-2 hover:bg-brand-primary transition-colors"
                            >
                                <Plus size={18} />
                                <span>NEW {activeTab === 'faqs' ? 'FAQ' : 'STORE'}</span>
                            </button>
                        )}
                    </div>
                </header>

                <div className="p-6 lg:p-12">

                    {/* ═══════════ FAQS TAB ═══════════ */}
                    {activeTab === 'faqs' && (
                        <div className="space-y-4 max-w-4xl">
                            {faqs.map(f => (
                                <div key={f.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-start group">
                                    <div className="pr-4">
                                        <h4 className="font-bold text-brand-charcoal">{f.question}</h4>
                                        <p className="text-gray-500 text-sm mt-1">{f.answer}</p>
                                    </div>
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setItemType('faq'); setEditingItem(f); setIsEditModalOpen(true); }} className="p-2 text-brand-primary hover:bg-blue-50 rounded-lg"><Edit3 size={18} /></button>
                                        <button onClick={() => handleDelete(f.id, 'faqs')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ═══════════ STORES TAB ═══════════ */}
                    {activeTab === 'stores' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {stores.map(store => (
                                <ItemCard
                                    key={store.id}
                                    title={store.name}
                                    description={`${store.location || 'Local Area'}\n\n${store.description || ''}`}
                                    onEdit={() => { setItemType('stores'); setEditingItem(store); setIsEditModalOpen(true); }}
                                    onDelete={() => handleDelete(store.id, 'stores')}
                                />
                            ))}
                        </div>
                    )}

                    {/* ═══════════ FOOD ORDERS TAB ═══════════ */}
                    {activeTab === 'food_orders' && (
                        <div>
                            {/* Status Filters */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setBookingFilter(status)}
                                        className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${bookingFilter === status ? 'bg-brand-charcoal text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-100'}`}
                                    >
                                        {status} {status === 'all' ? `(${foodOrders.length})` : `(${foodOrders.filter(o => o.status?.toLowerCase() === status).length})`}
                                    </button>
                                ))}
                            </div>

                            {filteredFoodOrders.length === 0 ? (
                                <div className="text-center py-24">
                                    <ShoppingCart size={48} className="mx-auto text-gray-200 mb-4" />
                                    <h4 className="text-xl font-bold text-gray-400">No food orders yet</h4>
                                    <p className="text-gray-400 text-sm">Food orders will appear here when customers place them.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredFoodOrders.map(order => (
                                        <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-black uppercase">
                                                            <UtensilsCrossed size={12} /> Food
                                                        </span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(order.status)}`}>
                                                            {order.status || 'pending'}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-bold text-brand-charcoal text-lg">{order.item_name}</h4>
                                                    <p className="text-gray-500 text-sm">
                                                        👤 {order.customer_name} • 📞 {order.contact_number}
                                                    </p>
                                                    <p className="text-gray-500 text-sm">📍 {order.address}</p>
                                                    <p className="text-gray-400 text-xs mt-1">
                                                        Qty: {order.quantity} • Total: ₱{order.total_price}
                                                        {order.instructions && ` • Note: ${order.instructions}`}
                                                    </p>
                                                    <p className="text-gray-300 text-[10px] mt-2 uppercase tracking-widest">
                                                        {new Date(order.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <select
                                                        value={order.status || 'pending'}
                                                        onChange={(e) => handleUpdateBookingStatus(order.id, 'food_orders', e.target.value)}
                                                        className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-gray-50 focus:ring-2 focus:ring-brand-primary outline-none"
                                                        aria-label="Update status"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="in_transit">In Transit</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handleDelete(order.id, 'food_orders')}
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══════════ MANUAL ORDERS TAB ═══════════ */}
                    {activeTab === 'manual_orders' && (
                        <div>
                            {/* Status Filters */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setBookingFilter(status)}
                                        className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${bookingFilter === status ? 'bg-brand-charcoal text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-100'}`}
                                    >
                                        {status} {status === 'all' ? `(${manualOrders.length})` : `(${manualOrders.filter(o => o.status?.toLowerCase() === status).length})`}
                                    </button>
                                ))}
                            </div>

                            {manualOrders.filter(o => bookingFilter === 'all' || o.status?.toLowerCase() === bookingFilter).length === 0 ? (
                                <div className="text-center py-24">
                                    <MessageSquare size={48} className="mx-auto text-gray-200 mb-4" />
                                    <h4 className="text-xl font-bold text-gray-400">No manual orders found</h4>
                                    <p className="text-gray-400 text-sm">Manual orders will appear here when customers submit the form.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {manualOrders
                                        .filter(o => bookingFilter === 'all' || o.status?.toLowerCase() === bookingFilter)
                                        .map(order => (
                                            <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-brand-accent/20 text-brand-charcoal rounded-full text-xs font-black uppercase">
                                                                <Utensils size={12} /> Manual
                                                            </span>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(order.status)}`}>
                                                                {order.status || 'pending'}
                                                            </span>
                                                        </div>
                                                        <h4 className="font-bold text-brand-charcoal text-lg">{order.customer_name}</h4>
                                                        <p className="text-gray-500 text-sm">
                                                            📞 {order.contact_number} • 📍 {order.address}
                                                        </p>
                                                        <div className="mt-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order Details</p>
                                                            <p className="text-brand-charcoal text-sm whitespace-pre-wrap">{order.order_details}</p>
                                                        </div>
                                                        <p className="text-gray-300 text-[10px] mt-2 uppercase tracking-widest">
                                                            {new Date(order.created_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <select
                                                            value={order.status || 'pending'}
                                                            onChange={(e) => handleUpdateBookingStatus(order.id, 'manual_orders', e.target.value)}
                                                            className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-gray-50 focus:ring-2 focus:ring-brand-primary outline-none"
                                                            aria-label="Update status"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="confirmed">Confirmed</option>
                                                            <option value="in_transit">In Transit</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                        <button
                                                            onClick={() => handleDelete(order.id, 'manual_orders')}
                                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══════════ PABILI / PADALA BOOKINGS TAB ═══════════ */}
                    {activeTab === 'bookings' && (
                        <div>
                            {/* Status Filters */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setBookingFilter(status)}
                                        className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${bookingFilter === status ? 'bg-brand-charcoal text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-100'}`}
                                    >
                                        {status} {status === 'all' ? `(${bookings.length})` : `(${bookings.filter(b => b.status?.toLowerCase() === status).length})`}
                                    </button>
                                ))}
                            </div>

                            {filteredBookings.length === 0 ? (
                                <div className="text-center py-24">
                                    <Package size={48} className="mx-auto text-gray-200 mb-4" />
                                    <h4 className="text-xl font-bold text-gray-400">No bookings found</h4>
                                    <p className="text-gray-400 text-sm">Pabili and Padala bookings will appear here.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredBookings.map(booking => (
                                        <div key={booking.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase ${getBookingType(booking) === 'Pabili' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                            {getBookingType(booking) === 'Pabili' ? <ShoppingCart size={12} /> : <Package size={12} />}
                                                            {getBookingType(booking)}
                                                        </span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(booking.status)}`}>
                                                            {booking.status || 'pending'}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-bold text-brand-charcoal text-lg">{booking.customer_name}</h4>
                                                    <p className="text-gray-500 text-sm">
                                                        📞 {booking.contact_number}
                                                        {booking.delivery_fee && ` • 💰 ₱${booking.delivery_fee}`}
                                                        {booking.distance_km && ` • 📏 ${booking.distance_km} km`}
                                                    </p>
                                                    <p className="text-gray-400 text-xs mt-1">
                                                        📍 Pickup: {booking.pickup_address?.substring(0, 60)}{booking.pickup_address?.length > 60 ? '...' : ''}
                                                    </p>
                                                    <p className="text-gray-400 text-xs">
                                                        📍 Delivery: {booking.delivery_address?.substring(0, 60)}{booking.delivery_address?.length > 60 ? '...' : ''}
                                                    </p>
                                                    <p className="text-gray-300 text-[10px] mt-2 uppercase tracking-widest">
                                                        {new Date(booking.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button
                                                        onClick={() => setSelectedBooking(booking)}
                                                        className="p-2 text-brand-primary hover:bg-blue-50 rounded-xl transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <select
                                                        value={booking.status || 'pending'}
                                                        onChange={(e) => handleUpdateBookingStatus(booking.id, 'padala_bookings', e.target.value)}
                                                        className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-gray-50 focus:ring-2 focus:ring-brand-primary outline-none"
                                                        aria-label="Update status"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="in_transit">In Transit</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handleDelete(booking.id, 'padala_bookings')}
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══════════ PASAKAY BOOKINGS TAB ═══════════ */}
                    {activeTab === 'pasakay' && (
                        <div>
                            {/* Status Filters */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setBookingFilter(status)}
                                        className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${bookingFilter === status ? 'bg-brand-charcoal text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-100'}`}
                                    >
                                        {status} {status === 'all' ? `(${pasakayBookings.length})` : `(${pasakayBookings.filter(b => b.status?.toLowerCase() === status).length})`}
                                    </button>
                                ))}
                            </div>

                            {pasakayBookings.filter(b => bookingFilter === 'all' || b.status?.toLowerCase() === bookingFilter).length === 0 ? (
                                <div className="text-center py-24">
                                    <Zap size={48} className="mx-auto text-gray-200 mb-4" />
                                    <h4 className="text-xl font-bold text-gray-400">No pasakay bookings found</h4>
                                    <p className="text-gray-400 text-sm">Pasakay requests will appear here when customers submit the form.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pasakayBookings
                                        .filter(b => bookingFilter === 'all' || b.status?.toLowerCase() === bookingFilter)
                                        .map(booking => (
                                            <div key={booking.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black uppercase">
                                                                <Truck size={12} /> Pasakay
                                                            </span>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(booking.status)}`}>
                                                                {booking.status || 'pending'}
                                                            </span>
                                                        </div>
                                                        <h4 className="font-bold text-brand-charcoal text-lg">{booking.customer_name}</h4>
                                                        <p className="text-gray-500 text-sm">
                                                            📞 {booking.contact_number} • 👥 {booking.passengers} pax • 🧳 {booking.has_baggage ? 'With Baggage' : 'No Baggage'}
                                                        </p>
                                                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pickup</p>
                                                                <p className="text-brand-charcoal text-sm">{booking.pickup_location}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Destination</p>
                                                                <p className="text-brand-charcoal text-sm">{booking.destination}</p>
                                                            </div>
                                                        </div>
                                                        {booking.notes && (
                                                            <div className="mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Notes</p>
                                                                <p className="text-gray-600 text-sm italic">"{booking.notes}"</p>
                                                            </div>
                                                        )}
                                                        <p className="text-gray-300 text-[10px] mt-2 uppercase tracking-widest">
                                                            {new Date(booking.created_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <select
                                                            value={booking.status || 'pending'}
                                                            onChange={(e) => handleUpdateBookingStatus(booking.id, 'pasakay_bookings', e.target.value)}
                                                            className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-gray-50 focus:ring-2 focus:ring-brand-primary outline-none"
                                                            aria-label="Update status"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="confirmed">Confirmed</option>
                                                            <option value="in_transit">In Transit</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                        <button
                                                            onClick={() => handleDelete(booking.id, 'pasakay_bookings')}
                                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══════════ SUPPORT REQUESTS TAB ═══════════ */}
                    {activeTab === 'requests' && (
                        <div className="space-y-4 max-w-4xl">
                            {requests.length === 0 ? (
                                <div className="text-center py-24">
                                    <Mail size={48} className="mx-auto text-gray-200 mb-4" />
                                    <h4 className="text-xl font-bold text-gray-400">No support requests yet</h4>
                                    <p className="text-gray-400 text-sm">Requests from the contact form will appear here.</p>
                                </div>
                            ) : (
                                requests.map(req => (
                                    <div key={req.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start group gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-widest">
                                                    {req.request_type || 'General'}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${getStatusColor(req.status)}`}>
                                                    {req.status || 'pending'}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-brand-charcoal leading-tight">{req.subject}</h4>
                                            <p className="text-gray-500 text-sm mt-1 whitespace-pre-wrap">{req.description}</p>
                                            <div className="mt-4 flex flex-wrap gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><User size={12} /> {req.customer_name}</span>
                                                <span className="flex items-center gap-1.5"><Phone size={12} /> {req.contact_number}</span>
                                                {req.address && <span className="flex items-center gap-1.5"><MapPin size={12} /> {req.address}</span>}
                                                <span>{new Date(req.created_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={req.status || 'pending'}
                                                onChange={(e) => handleUpdateBookingStatus(req.id, 'requests', e.target.value)}
                                                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold bg-gray-50 outline-none"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                            <button onClick={() => handleDelete(req.id, 'requests')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ═══════════ SITE SETTINGS TAB ═══════════ */}
                    {activeTab === 'settings' && (
                        <div className="max-w-4xl bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                                <h3 className="text-lg font-black text-brand-charcoal uppercase tracking-tight">System Configuration</h3>
                                <p className="text-sm text-gray-400">Global settings for the application. These changes take effect immediately.</p>
                            </div>
                            <div className="p-8">
                                <div className="space-y-6">
                                    {siteSettings.length === 0 ? (
                                        <p className="text-center py-12 text-gray-400 italic">No settings found in the database.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-6">
                                            {siteSettings.map(setting => (
                                                <div key={setting.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-colors group">
                                                    <div className="flex-1">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{setting.id.replace(/_/g, ' ')}</p>
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="text"
                                                                defaultValue={setting.value}
                                                                onBlur={async (e) => {
                                                                    if (e.target.value !== setting.value) {
                                                                        const { error } = await supabase.from('site_settings').update({ value: e.target.value }).eq('id', setting.id);
                                                                        if (!error) fetchData();
                                                                        else alert(error.message);
                                                                    }
                                                                }}
                                                                className="w-full bg-transparent font-bold text-brand-charcoal outline-none border-b-2 border-transparent focus:border-brand-primary py-1 transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-tighter bg-blue-50 px-2 py-1 rounded">Auto-saves on blur</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══════════ SECURITY TAB ═══════════ */}
                    {activeTab === 'security' && <SecurityTab />}
                </div>
            </main>

            {/* ═══════════ BOOKING DETAIL MODAL ═══════════ */}
            <AnimatePresence>
                {selectedBooking && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBooking(null)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                <div>
                                    <h3 className="text-2xl font-black text-brand-charcoal uppercase">Booking Details</h3>
                                    <p className="text-sm text-gray-400">{getBookingType(selectedBooking)} • {new Date(selectedBooking.created_at).toLocaleString()}</p>
                                </div>
                                <button onClick={() => setSelectedBooking(null)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full"><X size={24} /></button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Customer Name</p>
                                        <p className="font-bold text-brand-charcoal">{selectedBooking.customer_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Contact</p>
                                        <p className="font-bold text-brand-charcoal">{selectedBooking.contact_number}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pickup Address</p>
                                    <p className="text-brand-charcoal">{selectedBooking.pickup_address || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Address</p>
                                    <p className="text-brand-charcoal">{selectedBooking.delivery_address || 'N/A'}</p>
                                </div>
                                {selectedBooking.item_description && (
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Items / Description</p>
                                        <pre className="text-brand-charcoal text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100">{selectedBooking.item_description}</pre>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {selectedBooking.distance_km && (
                                        <div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Distance</p>
                                            <p className="font-bold text-brand-charcoal">{selectedBooking.distance_km} km</p>
                                        </div>
                                    )}
                                    {selectedBooking.delivery_fee && (
                                        <div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Fee</p>
                                            <p className="font-bold text-brand-primary text-xl">₱{selectedBooking.delivery_fee}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(selectedBooking.status)}`}>
                                            {selectedBooking.status || 'pending'}
                                        </span>
                                    </div>
                                </div>
                                {selectedBooking.notes && (
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Notes</p>
                                        <p className="text-brand-charcoal">{selectedBooking.notes}</p>
                                    </div>
                                )}
                                {selectedBooking.special_instructions && (
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Special Instructions</p>
                                        <p className="text-brand-charcoal">{selectedBooking.special_instructions}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ═══════════ EDIT MODAL (Menu / FAQ) ═══════════ */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 text-outfit">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
                            <form onSubmit={handleSave}>
                                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                                    <h3 className="text-2xl font-black text-brand-charcoal uppercase">{editingItem.id ? 'Edit' : 'New'} {itemType}</h3>
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full"><X size={24} /></button>
                                </div>
                                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                    {itemType === 'menu' ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Dish Name</label>
                                                    <input required value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-brand-accent transition-all" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Store</label>
                                                    <select required value={editingItem.store_id} onChange={e => setEditingItem({ ...editingItem, store_id: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-brand-accent transition-all">
                                                        <option value="">Select a Store</option>
                                                        {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                                    <select value={editingItem.category} onChange={e => setEditingItem({ ...editingItem, category: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-brand-accent transition-all">
                                                        <option value="Pizza">Pizza</option>
                                                        <option value="Burgers">Burgers</option>
                                                        <option value="Pasta">Pasta</option>
                                                        <option value="Rice Meals">Rice Meals</option>
                                                        <option value="Drinks">Drinks</option>
                                                        <option value="Desserts">Desserts</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Price (₱)</label>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                        <input type="number" step="0.01" required value={editingItem.price} onChange={e => {
                                                            const val = parseFloat(e.target.value);
                                                            setEditingItem({ ...editingItem, price: val, base_price: val });
                                                        }} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-brand-accent transition-all" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <ImageUpload
                                                    value={editingItem.image_url}
                                                    onChange={url => setEditingItem({ ...editingItem, image_url: url })}
                                                    label="Product Image"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Short Description</label>
                                                <textarea required value={editingItem.description} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-brand-accent transition-all h-24" />
                                            </div>
                                        </>
                                    ) : itemType === 'stores' ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Store Name</label>
                                                    <input required value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-brand-accent transition-all" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Location</label>
                                                    <input value={editingItem.location} onChange={e => setEditingItem({ ...editingItem, location: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-brand-accent transition-all" placeholder="e.g. Downtown" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Contact</label>
                                                    <input value={editingItem.contact} onChange={e => setEditingItem({ ...editingItem, contact: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-brand-accent transition-all" placeholder="e.g. 0912..." />
                                                </div>
                                                <div>
                                                    <ImageUpload
                                                        value={editingItem.image_url}
                                                        onChange={url => setEditingItem({ ...editingItem, image_url: url })}
                                                        label="Store Logo / Cover"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                                <textarea required value={editingItem.description} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-brand-accent transition-all h-24" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Question</label>
                                                <input required value={editingItem.question} onChange={e => setEditingItem({ ...editingItem, question: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-brand-accent transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Answer</label>
                                                <textarea required value={editingItem.answer} onChange={e => setEditingItem({ ...editingItem, answer: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-brand-accent transition-all h-32" />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="p-8 bg-gray-50 flex justify-end space-x-4">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-8 py-4 font-bold text-gray-400 uppercase">Cancel</button>
                                    <button type="submit" className="px-10 py-4 bg-brand-primary text-white font-black rounded-2xl shadow-lg shadow-blue-200 flex items-center space-x-3 hover:bg-brand-secondary transition-all">
                                        <Save size={20} />
                                        <span>SAVE CHANGES</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

const SidebarLink = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-black transition-all ${active ? 'bg-brand-charcoal text-white ring-4 ring-white shadow-xl shadow-gray-200' : 'text-gray-400 hover:text-brand-charcoal hover:bg-gray-50'}`}>
        {icon} <span className="uppercase text-sm tracking-tight">{label}</span>
    </button>
);

const ItemCard = ({ title, description, onEdit, onDelete }) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
        <h4 className="text-xl font-black text-brand-charcoal mb-2 tracking-tight uppercase">{title}</h4>
        <p className="text-gray-500 text-sm mb-6 line-clamp-3 font-medium">{description}</p>
        <div className="flex space-x-3">
            <button onClick={onEdit} className="flex-1 py-3 bg-blue-50 text-brand-primary font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-100 transition-colors">
                <Edit3 size={16} /> <span className="uppercase text-xs tracking-widest">Edit</span>
            </button>
            <button onClick={onDelete} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                <Trash2 size={20} />
            </button>
        </div>
    </div>
);

export default AdminDashboard;
