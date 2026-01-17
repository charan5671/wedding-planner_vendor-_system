import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { apiFetch } from '../lib/api';
import { MOCK_VENDORS, Vendor } from '../lib/mockData';

export function VendorSearch() {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVendors();
    }, [category]);

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (category) params.append('category', category);

            const data = await apiFetch(`/vendors?${params.toString()}`);
            setVendors(data);
        } catch (err) {
            console.warn('API failed, showing curated mocks:', err);
            let filteredMocks = MOCK_VENDORS;
            if (category) {
                filteredMocks = MOCK_VENDORS.filter(v => v.category === category);
            }
            setVendors(filteredMocks);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pt-24 sm:pt-32 pb-24 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-8">
                    <div className="max-w-xl">
                        <span className="text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-3 sm:mb-4 block">Discovery</span>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-tight">Elite Artisans</h1>
                        <p className="text-base sm:text-lg text-slate-500 font-light mt-4 italic">"Curating the world's most exceptional wedding professionals, just for you."</p>
                    </div>

                    <div className="w-full md:w-auto">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Filter by Expertise</label>
                        <select
                            className="w-full md:w-72 h-14 pl-6 pr-12 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-primary-500 focus:border-primary-500 font-bold text-slate-900 transition-all appearance-none cursor-pointer"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">All Masterpieces</option>
                            <option value="Photographer">Photographers</option>
                            <option value="Venue">Venues</option>
                            <option value="Decorator">Decorators</option>
                            <option value="Caterer">Caterers</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Bridal Wear">Bridal Wear</option>
                            <option value="Wedding Planner">Wedding Planners</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                        {vendors.map((vendor) => (
                            <div
                                key={vendor.id}
                                className="group relative bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 hover:border-primary-100 hover:shadow-2xl transition-all duration-700 cursor-pointer"
                                onClick={() => navigate(`/vendors/${vendor.id}`)}
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={vendor.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'}
                                        alt={vendor.business_name}
                                        className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-6 left-6 flex space-x-2">
                                        <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-600 shadow-sm">
                                            {vendor.category}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 right-6 text-white text-lg font-serif italic drop-shadow-lg">
                                        {vendor.rating} ★
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6">
                                    <div className="flex justify-between items-start mb-6 gap-4">
                                        <h3 className="text-lg font-serif font-bold text-slate-900 leading-tight group-hover:text-primary-600 transition-colors line-clamp-1">
                                            {vendor.business_name}
                                        </h3>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Starts At</p>
                                            <p className="text-xs font-bold text-slate-900">{vendor.price_range || 'Inquire'}</p>
                                        </div>
                                    </div>

                                    <p className="text-slate-500 font-light text-xs line-clamp-2 mb-6 leading-relaxed">
                                        {vendor.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className="flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {vendor.location}
                                        </div>
                                        <span className="text-primary-600 font-black text-xs uppercase tracking-tighter group-hover:translate-x-1 transition-transform">View Collection →</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && vendors.length === 0 && (
                    <div className="py-40 text-center">
                        <div className="text-6xl mb-6">✧</div>
                        <h2 className="text-2xl font-serif italic text-slate-400">No artisans found in this category.</h2>
                        <Button
                            className="mt-8 rounded-full px-10 border-slate-200 text-slate-500 hover:text-slate-900"
                            variant="outline"
                            onClick={() => setCategory('')}
                        >
                            Reset Collection
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
