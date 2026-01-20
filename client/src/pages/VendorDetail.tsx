import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { MOCK_VENDORS } from '../lib/mockData';

interface Vendor {
    id: string;
    business_name: string;
    category: string;
    description: string;
    location: string;
    price_range: string;
    rating: number;
    images: string[];
}

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    vendor_id: string;
}

export function VendorDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchVendorAndServices(id);
    }, [id]);

    const fetchVendorAndServices = async (vendorId: string) => {
        try {
            setLoading(true);

            // Handle Mock Data specifically
            if (vendorId.startsWith('mock-')) {
                const mockVendor = MOCK_VENDORS.find(v => v.id === vendorId);
                if (mockVendor) {
                    setVendor(mockVendor);
                    setServices([
                        { id: 's1', name: 'Platinum Collection', description: 'Our most comprehensive suite involving full-day coverage and elite post-production.', price: 4500, vendor_id: vendorId },
                        { id: 's2', name: 'Signature Series', description: 'The essential Bliss experience, curated for elegance and impact.', price: 2800, vendor_id: vendorId },
                        { id: 's3', name: 'Bespoke Half-Day', description: 'Tailored excellence for intimate celebrations and micro-weddings.', price: 1800, vendor_id: vendorId }
                    ]);
                    setLoading(false);
                    return;
                }
            }

            const data = await apiFetch(`/vendors/${vendorId}`);
            setVendor(data);
            setServices([
                { id: 's1', name: 'Platinum Collection', description: 'Full comprehensive service with priority support.', price: 4500, vendor_id: vendorId },
                { id: 's2', name: 'Signature Series', description: 'Balanced service for the modern couple.', price: 2800, vendor_id: vendorId }
            ]);
        } catch (error) {
            console.error('Failed to fetch details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        const messageEl = document.getElementById('enquiry-message') as HTMLTextAreaElement;
        const message = messageEl?.value;

        if (!message) {
            alert('Please enter a brief message to start the conversation.');
            return;
        }

        try {
            setLoading(true);
            const response = await apiFetch('/enquiries', {
                method: 'POST',
                body: JSON.stringify({
                    vendorId: vendor?.id,
                    userId: user.uid || user.id,
                    message: message,
                    userName: profile?.name || user.displayName,
                    userEmail: profile?.email
                })
            });

            // Redirect to negotiation room
            navigate(`/negotiation/${response.id}`);
        } catch (error) {
            console.error('Booking error:', error);
            alert('Failed to send inquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    if (!vendor) return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl font-serif italic text-slate-400">Artisan not found in our collection.</h1>
        </div>
    );

    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <button
                    onClick={() => navigate(-1)}
                    className="group mb-12 flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary-600 transition-colors"
                >
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Return to Collection
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Gallery Section */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl">
                            <img
                                src={vendor.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'}
                                alt={vendor.business_name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-8 line-clamp-2">
                            {(vendor.images || []).slice(1, 3).map((img, i) => (
                                <div key={i} className="aspect-square rounded-[2rem] overflow-hidden shadow-xl border border-slate-100">
                                    <img src={img} className="w-full h-full object-cover transition-transform hover:scale-110 duration-700" alt="Work" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-40 space-y-10">
                            <div>
                                <div className="flex items-center space-x-3 mb-6">
                                    <span className="bg-primary-50 text-primary-600 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{vendor.category}</span>
                                    <span className="text-slate-300 font-light">|</span>
                                    <span className="text-slate-900 font-bold text-sm tracking-tighter">{vendor.rating} ★ Rating</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-tight mb-4">{vendor.business_name}</h1>
                                <div className="flex items-center text-slate-400 font-medium">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    {vendor.location}
                                </div>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 italic font-light text-slate-600 leading-relaxed">
                                "{vendor.description}"
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end pb-4 border-b border-slate-100">
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Starting From</span>
                                        <span className="text-4xl font-serif font-black text-slate-900">{vendor.price_range}</span>
                                    </div>

                                    {/* Enquiry Input Logic */}
                                    <div className="space-y-3">
                                        <textarea
                                            className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary-600 outline-none resize-none"
                                            rows={3}
                                            placeholder="Hi, I'm interested in your services for my wedding on..."
                                            id="enquiry-message"
                                        ></textarea>
                                        <Button onClick={handleBook} className="w-full h-14 rounded-full bg-slate-900 text-white font-black text-lg hover:bg-primary-600 shadow-xl transition-all">
                                            Send Inquiry
                                        </Button>
                                    </div>
                                    <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">Connect Directly with Artisan</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Services Section */}
                    {services.length > 0 && (
                        <div className="mt-32">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2 italic">Available Experiences</h2>
                                <div className="w-12 h-1 bg-primary-600 mx-auto"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {services.map(service => (
                                    <div key={service.id} className="group p-10 rounded-[3rem] bg-white border border-slate-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 -mr-16 -mt-16 rounded-full group-hover:scale-[10] transition-transform duration-1000 opacity-20"></div>
                                        <div className="relative z-10">
                                            <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.name}</h3>
                                            <p className="text-slate-500 font-light text-sm mb-10 leading-relaxed">{service.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-serif font-black text-slate-900">${service.price}</span>
                                                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest cursor-pointer hover:underline">Select Service →</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
