import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { Button } from '../components/Button';
import { Link, Navigate } from 'react-router-dom';
import { MOCK_BOOKINGS } from '../lib/mockData';

export function Dashboard() {
    const { user, profile } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await apiFetch('/bookings');
            setBookings(data);
        } catch (err) {
            console.warn('Dashboard fetch failed, showing mock bookings:', err);
            setBookings(MOCK_BOOKINGS.slice(0, 3));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    if (profile?.role === 'admin') return <Navigate to="/admin" replace />;
    if (profile?.role === 'vendor') return <Navigate to="/vendor/dashboard" replace />;

    return (
        <div className="min-h-screen bg-slate-50/50 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-16">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <span className="text-primary-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Workspace</span>
                            <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-tight italic">Bonjour, {profile?.name || 'Planner'}</h1>
                            <p className="text-slate-400 font-medium mt-2">Managing {bookings.length} masterpieces in progress.</p>
                        </div>
                        <Link to="/vendors">
                            <Button className="h-14 px-10 rounded-2xl bg-slate-900 text-white font-bold hover:bg-primary-600 transition-all">+ Curate More</Button>
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Stats Area - Bento Style */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Next Event Card */}
                        <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 text-primary-100 transition-transform group-hover:scale-110">
                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                </svg>
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">Next Milestones</h3>
                            <p className="text-3xl font-bold text-slate-900 mb-2">Venue Tasting</p>
                            <p className="text-primary-600 font-black text-sm">Tomorrow at 2:00 PM</p>
                            <div className="mt-10 pt-8 border-t border-slate-50">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest cursor-pointer hover:text-slate-900 transition-colors">View Itinerary →</span>
                            </div>
                        </div>

                        {/* Budget Card */}
                        <div className="p-10 rounded-[3rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full blur-3xl"></div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">Investment Tracker</h3>
                            <div className="flex items-end space-x-2 mb-2">
                                <span className="text-5xl font-serif font-black">$42,500</span>
                                <span className="text-slate-500 mb-2 font-bold uppercase tracking-tighter text-[10px]">of $60k Budget</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-6">
                                <div className="bg-primary-500 h-full rounded-full w-[70%]"></div>
                            </div>
                            <div className="mt-10 space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent: Ritz Booking ($-15k)</p>
                            </div>
                        </div>

                        {/* Bookings Table/List Area */}
                        <div className="md:col-span-2 p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-12">
                                <h3 className="text-2xl font-serif font-bold text-slate-900">Your Reservations</h3>
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full">Active Artisans</span>
                            </div>

                            <div className="space-y-6">
                                {bookings.length > 0 ? bookings.map((booking: any) => (
                                    <Link to={`/negotiation/${booking.id}`} key={booking.id} className="block">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-3xl bg-slate-50/50 hover:bg-white hover:shadow-lg border border-transparent hover:border-slate-100 transition-all group gap-4">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm overflow-hidden p-1 border border-slate-200">
                                                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-primary-600 font-black text-xl">
                                                        {booking.vendor?.business_name?.charAt(0) || 'V'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-primary-600 transition-colors uppercase tracking-tight">{booking.vendor?.business_name || 'Artisan Portfolio'}</h4>
                                                    <div className="flex items-center gap-2">
                                                        {booking.isEnquiry && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 rounded-full font-bold">INQUIRY</span>}
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{booking.date}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                                                    booking.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                                <button className="text-slate-400 hover:text-primary-600 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="py-20 text-center">
                                        <p className="text-slate-400 italic font-light">"The collection is empty. Let's begin the curation."</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-10">
                        <div className="p-10 rounded-[3rem] bg-primary-600 text-white shadow-2xl group transition-transform hover:-rotate-1 relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary-100 mb-8">Concierge Support</h3>
                            <p className="text-2xl font-serif font-bold mb-6 italic">Need a Personal Planner?</p>
                            <p className="text-primary-100 font-light text-sm mb-10 leading-relaxed">Our elite planners are ready to take your vision to the next level.</p>
                            <Button className="w-full h-14 rounded-2xl bg-white text-primary-600 font-black hover:bg-slate-50 shadow-xl transition-all">Request Advisor</Button>
                        </div>

                        <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">Recent Inquiries</h3>
                            <div className="space-y-8">
                                <div className="flex gap-4 items-start group cursor-pointer">
                                    <div className="h-2 w-2 rounded-full bg-primary-600 mt-2 group-hover:scale-150 transition-transform"></div>
                                    <div>
                                        <p className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">Royal Palace Venue</p>
                                        <p className="text-xs text-slate-400 font-medium tracking-tight">Contract finalized. Reviewing catering menu.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start group cursor-pointer">
                                    <div className="h-2 w-2 rounded-full bg-slate-200 mt-2"></div>
                                    <div>
                                        <p className="font-bold text-slate-600 group-hover:text-primary-600 transition-colors">The Bloom Collective</p>
                                        <p className="text-xs text-slate-400 font-medium tracking-tight">Availability confirmed for June 12th.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                                <Link to="/messages" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 hover:text-slate-900 transition-colors">View All Portfolio Messaging →</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
