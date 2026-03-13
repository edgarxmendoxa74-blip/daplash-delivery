import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const fallbackFaqs = [
    {
        q: "How fast is your delivery service?",
        a: "Our average delivery time within Naga City is 25-40 minutes, depending on the service type and traffic conditions."
    },
    {
        q: "What are your operating hours?",
        a: "We currently operate from 8:00 AM to 10:00 PM daily. However, special delivery arrangements can be made via our Facebook Messenger."
    },
    {
        q: "Do you deliver outside Naga City?",
        a: "Yes, we do deliver to neighboring towns like Camaligan, Gainza, and Canaman for a small additional delivery fee."
    },
    {
        q: "How do I pay for the delivery?",
        a: "We primary accept Cash on Delivery (COD). We are also working on integrating digital payment options like GCash soon."
    }
];

const FAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        const fetchFaqs = async () => {
            const { data } = await supabase
                .from('faqs')
                .select('*')
                .order('order_index');

            if (data && data.length > 0) {
                // Map DB keys (question, answer) to UI keys (q, a)
                const mappedFaqs = data.map(f => ({
                    q: f.question,
                    a: f.answer
                }));
                setFaqs(mappedFaqs);
            } else {
                setFaqs(fallbackFaqs);
            }
        };

        fetchFaqs();
    }, []);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    <div className="w-full lg:w-1/3">
                        <div className="lg:sticky lg:top-32 text-center lg:text-left">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-brand-primary mb-6 mx-auto lg:mx-0">
                                <HelpCircle size={32} />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black text-brand-charcoal mb-4 sm:mb-6">
                                ANY <span className="text-brand-primary">QUESTIONS?</span>
                            </h2>
                            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                                Find answers to the most common questions about our services.
                            </p>
                            <a href="https://m.me/100064173395989" target="_blank" rel="noopener noreferrer" className="text-brand-primary font-bold flex items-center justify-center lg:justify-start space-x-2 hover:underline">
                                <span>Still need help? Contact support</span>
                            </a>
                        </div>
                    </div>

                    <div className="w-full lg:w-2/3 space-y-3 sm:space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className={`border-2 rounded-2xl transition-all duration-300 ${activeIndex === i ? 'border-brand-primary bg-blue-50/30' : 'border-gray-100 bg-white'}`}
                            >
                                <button
                                    onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                                    className="w-full px-5 sm:px-8 py-4 sm:py-6 flex items-center justify-between text-left"
                                >
                                    <span className={`text-base sm:text-xl font-bold leading-snug ${activeIndex === i ? 'text-brand-primary' : 'text-brand-charcoal'}`}>
                                        {faq.q}
                                    </span>
                                    <div className={`shrink-0 ml-4 transition-transform ${activeIndex === i ? 'rotate-180' : ''}`}>
                                        {activeIndex === i ? <Minus className="text-brand-primary" /> : <Plus className="text-gray-400" />}
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {activeIndex === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 sm:px-8 pb-6 sm:pb-8 text-gray-500 leading-relaxed text-sm sm:text-lg">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
