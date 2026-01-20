import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../lib/api';
import { supabase } from '../../lib/supabase'; // Use Supabase

interface Booking {
    id: string;
    date: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    vendor_id: string;
    user_id: string;
}

interface Enquiry {
    id: string;
    message: string;
    status: 'unread' | 'read';
    created_at: string;
    vendor_id: string;
}

export function VendorDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        bookings: 0,
        enquiries: 0,
        rating: 0,
        views: 0
    });
    const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
    const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchDashboardData();

        // --- SUPABASE REALTIME ---
        const channel = supabase
            .channel(`vendor_dashboard_${user.uid}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `vendor_id=eq.${user.uid}` }, () => fetchDashboardData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries', filter: `vendor_id=eq.${user.uid}` }, () => fetchDashboardData())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const fetchDashboardData = async () => {
        if (!user) return;
        setLoading(true);

        try {
            // Fetch vendor profile first to get vendor ID
            const vendor = await apiFetch(`/vendors/user/${user.uid}`).catch(() => null);
            const vendorId = vendor ? vendor.id : user.uid;

            // Fetch stats/analytics from Supabase Backend
            const analytics = await apiFetch(`/vendors/${vendorId}/analytics`).catch(() => ({
                totalBookings: 0,
                confirmedBookings: 0,
                pendingBookings: 0,
                totalRevenue: 0,
                averageRating: 0,
                totalReviews: 0
            }));

            // Fetch enquiries
            const enquiries = await apiFetch(`/enquiries/vendor/${vendorId}`).catch(() => []);

            // Fetch bookings
            const bookings = await apiFetch(`/bookings?vendorId=${vendorId}`).catch(() => []);

            setStats({
                bookings: analytics.totalBookings || 0,
                enquiries: enquiries.length || 0,
                rating: analytics.averageRating || 0,
                views: 450 // Mocked
            });

            setRecentEnquiries(enquiries.slice(0, 5).map((e: any) => ({
                id: e.id,
                message: e.message,
                status: e.status === 'pending' ? 'unread' : 'read',
                created_at: e.createdAt,
                vendor_id: e.vendorId
            })));

            setUpcomingBookings(bookings.slice(0, 5).map((b: any) => ({
                id: b.id,
                date: b.date,
                status: b.status,
                vendor_id: b.vendorId,
                user_id: b.userId
            })));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Vendor Dashboard</h2>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Verified Vendor
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium">Active Bookings</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.bookings}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium">New Enquiries</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.enquiries}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium">Average Rating</h3>
                    <p className="text-3xl font-bold text-yellow-500 mt-2">{stats.rating} ★</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium">Profile Views</h3>
                    <p className="text-3xl font-bold text-primary-600 mt-2">{stats.views}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Enquiries</h3>
                    {recentEnquiries.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No new enquiries.</p>
                    ) : (
                        <div className="space-y-4">
                            {recentEnquiries.map(enquiry => (
                                <div key={enquiry.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm text-slate-900 font-medium truncate">{enquiry.message}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${enquiry.status === 'unread' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {enquiry.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-xs text-slate-500">{new Date(enquiry.created_at).toLocaleDateString()}</p>
                                        <Link
                                            to={`/negotiation/${enquiry.id}`}
                                            className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded hover:bg-primary-100 font-medium transition-colors"
                                        >
                                            Negotiate
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Upcoming Bookings</h3>
                    {upcomingBookings.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No upcoming bookings.</p>
                    ) : (
                        <div className="space-y-4">
                            {upcomingBookings.map(booking => (
                                <div key={booking.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-900">Booking #{booking.id.slice(0, 8)}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'
                                            }`}>{booking.status}</span>
                                    </div>
                                    <div className="flex justify-between mt-1 text-sm text-slate-600 items-center">
                                        <span>Date: {new Date(booking.date).toLocaleDateString()}</span>
                                        <Link
                                            to={`/negotiation/${booking.id}`}
                                            className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                                        >
                                            Negotiate
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
