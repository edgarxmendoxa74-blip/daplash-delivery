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
    DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('menu');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Data states
    const [menuItems, setMenuItems] = useState([]);
    const [faqs, setFaqs] = useState([]);

    // Edit Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemType, setItemType] = useState('menu'); // 'menu' or 'faq'

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
        const { data: menuData } = await supabase.from('menu_items').select('*').order('order_index');
        const { data: faqsData } = await supabase.from('faqs').select('*').order('order_index');

        setMenuItems(menuData || []);
        setFaqs(faqsData || []);
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

    const handleSave = async (e) => {
        e.preventDefault();
        const table = itemType === 'menu' ? 'menu_items' : 'faqs';

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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-daplash-yellow border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FC] flex font-outfit">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-gray-100 p-8 pt-10">
                <div className="flex items-center space-x-4 mb-12 ml-2">
                    <div className="w-12 h-12 bg-daplash-yellow rounded-2xl flex items-center justify-center text-daplash-dark shadow-lg shadow-daplash-yellow/20">
                        <Truck size={24} />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-black text-daplash-dark truncate">Administrator</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Master Control</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarLink icon={<UtensilsCrossed size={20} />} label="Food Menu" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
                    <SidebarLink icon={<MessageSquare size={20} />} label="FAQs" active={activeTab === 'faqs'} onClick={() => setActiveTab('faqs')} />
                </nav>

                <div className="mt-auto pt-8 border-t border-gray-100">
                    <button onClick={handleLogout} className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl flex items-center justify-center space-x-3">
                        <LogOut size={20} />
                        <span>LOGOUT</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Menu logic remains same but switch labels... */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-[200] lg:hidden">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="absolute inset-y-0 left-0 w-80 bg-white p-8 flex flex-col" >
                            <div className="flex justify-between items-center mb-10">
                                <h1 className="text-xl font-black text-daplash-dark tracking-tight">DAPLASH <span className="text-daplash-blue">ADMIN</span></h1>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400"><X size={24} /></button>
                            </div>
                            <nav className="space-y-2 mb-auto">
                                <SidebarLink icon={<UtensilsCrossed size={20} />} label="Menu" active={activeTab === 'menu'} onClick={() => { setActiveTab('menu'); setMobileMenuOpen(false); }} />
                                <SidebarLink icon={<MessageSquare size={20} />} label="FAQs" active={activeTab === 'faqs'} onClick={() => { setActiveTab('faqs'); setMobileMenuOpen(false); }} />
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
                        <h2 className="text-xl font-black text-daplash-dark uppercase">{activeTab === 'menu' ? 'Manage Food Menu' : 'Manage FAQs'}</h2>
                    </div>
                    <button
                        onClick={() => {
                            setItemType(activeTab === 'menu' ? 'menu' : 'faq');
                            setEditingItem(activeTab === 'menu' ? { name: '', description: '', price: 0, category: 'Main Course', image_url: '', order_index: menuItems.length } : { question: '', answer: '', order_index: faqs.length });
                            setIsEditModalOpen(true);
                        }}
                        className="px-6 py-3 bg-daplash-dark text-white font-black rounded-xl text-sm flex items-center space-x-2 hover:bg-daplash-blue transition-colors"
                    >
                        <Plus size={18} />
                        <span>NEW {activeTab === 'menu' ? 'MENU ITEM' : 'FAQ'}</span>
                    </button>
                </header>

                <div className="p-6 lg:p-12">
                    {activeTab === 'menu' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {menuItems.map(item => (
                                <ItemCard
                                    key={item.id}
                                    title={item.name}
                                    description={`${item.category} • ₱${item.price}`}
                                    onEdit={() => { setItemType('menu'); setEditingItem(item); setIsEditModalOpen(true); }}
                                    onDelete={() => handleDelete(item.id, 'menu_items')}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4 max-w-4xl">
                            {faqs.map(f => (
                                <div key={f.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-start group">
                                    <div className="pr-4">
                                        <h4 className="font-bold text-daplash-dark">{f.question}</h4>
                                        <p className="text-gray-500 text-sm mt-1">{f.answer}</p>
                                    </div>
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setItemType('faq'); setEditingItem(f); setIsEditModalOpen(true); }} className="p-2 text-daplash-blue hover:bg-blue-50 rounded-lg"><Edit3 size={18} /></button>
                                        <button onClick={() => handleDelete(f.id, 'faqs')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 text-outfit">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-daplash-dark/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
                            <form onSubmit={handleSave}>
                                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                                    <h3 className="text-2xl font-black text-daplash-dark uppercase">{editingItem.id ? 'Edit' : 'New'} {itemType}</h3>
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full"><X size={24} /></button>
                                </div>
                                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                    {itemType === 'menu' ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Dish Name</label>
                                                    <input required value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-daplash-yellow transition-all" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                                    <select value={editingItem.category} onChange={e => setEditingItem({ ...editingItem, category: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-daplash-yellow transition-all">
                                                        <option value="Pizza">Pizza</option>
                                                        <option value="Burgers">Burgers</option>
                                                        <option value="Pasta">Pasta</option>
                                                        <option value="Rice Meals">Rice Meals</option>
                                                        <option value="Drinks">Drinks</option>
                                                        <option value="Desserts">Desserts</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Price (₱)</label>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                        <input type="number" step="0.01" required value={editingItem.price} onChange={e => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-daplash-yellow transition-all" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Image URL</label>
                                                    <div className="relative">
                                                        <Image className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                        <input value={editingItem.image_url} onChange={e => setEditingItem({ ...editingItem, image_url: e.target.value })} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-daplash-yellow transition-all" placeholder="https://..." />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Short Description</label>
                                                <textarea required value={editingItem.description} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-daplash-yellow transition-all h-24" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Question</label>
                                                <input required value={editingItem.question} onChange={e => setEditingItem({ ...editingItem, question: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-daplash-yellow transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Answer</label>
                                                <textarea required value={editingItem.answer} onChange={e => setEditingItem({ ...editingItem, answer: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-daplash-yellow transition-all h-32" />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="p-8 bg-gray-50 flex justify-end space-x-4">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-8 py-4 font-bold text-gray-400 uppercase">Cancel</button>
                                    <button type="submit" className="px-10 py-4 bg-daplash-blue text-white font-black rounded-2xl shadow-lg shadow-blue-200 flex items-center space-x-3 hover:bg-daplash-dark transition-all">
                                        <Save size={20} />
                                        <span>SAVE CHANGES</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SidebarLink = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-black transition-all ${active ? 'bg-daplash-dark text-white ring-4 ring-white shadow-xl shadow-gray-200' : 'text-gray-400 hover:text-daplash-dark hover:bg-gray-50'}`}>
        {icon} <span className="uppercase text-sm tracking-tight">{label}</span>
    </button>
);

const ItemCard = ({ title, description, onEdit, onDelete }) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
        <h4 className="text-xl font-black text-daplash-dark mb-2 tracking-tight uppercase">{title}</h4>
        <p className="text-gray-500 text-sm mb-6 line-clamp-3 font-medium">{description}</p>
        <div className="flex space-x-3">
            <button onClick={onEdit} className="flex-1 py-3 bg-blue-50 text-daplash-blue font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-100 transition-colors">
                <Edit3 size={16} /> <span className="uppercase text-xs tracking-widest">Edit</span>
            </button>
            <button onClick={onDelete} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                <Trash2 size={20} />
            </button>
        </div>
    </div>
);

export default AdminDashboard;
