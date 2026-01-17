import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isFirebaseConfigured } from '../../lib/firebase';
import { apiFetch } from '../../lib/api';
import { useSocket } from '../../context/SocketContext';

interface Booking {
    id: string;
    userName: string;
    vendorName: string;
    status: string;
    date: string;
    createdAt: string;
}

export function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        vendors: 0,
        bookings: 0,
        revenue: 0,
        pendingBookings: 0,
        verifiedVendors: 0
    });
    const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();

    useEffect(() => {
        fetchStats();

        if (socket) {
            const handleUpdate = () => {
                fetchStats(); // For simplicity, we re-fetch all stats on any relevant update
            };

            socket.on('booking-updated', handleUpdate);
            socket.on('vendor-status-changed', handleUpdate);
            socket.on('user-status-changed', handleUpdate);
            socket.on('report-updated', handleUpdate);

            return () => {
                socket.off('booking-updated', handleUpdate);
                socket.off('vendor-status-changed', handleUpdate);
                socket.off('user-status-changed', handleUpdate);
                socket.off('report-updated', handleUpdate);
            };
        }
    }, [socket]);

    const fetchStats = async () => {
        try {
            // Only set loading on initial fetch
            if (stats.users === 0) setLoading(true);

            if (!isFirebaseConfigured) {
                const analytics = await apiFetch('/admin/analytics');
                const bookings = await apiFetch('/admin/bookings');
                const users = await apiFetch('/admin/users');
                const vendors = await apiFetch('/admin/vendors');

                setStats({
                    users: users.length || 0,
                    vendors: vendors.length || 0,
                    bookings: bookings.length || 0,
                    revenue: analytics.totalRevenue || (bookings.length * 150),
                    pendingBookings: bookings.filter((b: any) => b.status === 'pending').length,
                    verifiedVendors: vendors.filter((v: any) => v.is_verified || v.verified).length
                });

                setRecentBookings(bookings.slice(-5).reverse());
            }
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    const statCards = [
        { label: 'Total Users', value: stats.users, color: 'blue', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { label: 'Active Vendors', value: stats.vendors, sub: `${stats.verifiedVendors} verified`, color: 'green', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { label: 'Platform Bookings', value: stats.bookings, sub: `${stats.pendingBookings} pending`, color: 'purple', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, color: 'amber', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Platform Overview</h2>
                <p className="text-slate-500 mt-1">Real-time statistics and activities.</p>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2 md:mb-4">
                            <div className={`p-2 md:p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm font-medium text-slate-500">{stat.label}</p>
                            <h3 className="text-lg md:text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                            {stat.sub && <p className="text-[10px] md:text-xs text-slate-400 mt-1">{stat.sub}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                        <Link to="/admin/bookings" className="text-sm text-primary-600 hover:underline font-medium">View All</Link>
                    </div>
                    {recentBookings.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            No recent activity found.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentBookings.map((booking) => (
                                <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 gap-3">
                                    <div className="flex items-center space-x-4 min-w-0">
                                        <div className="h-10 w-10 shrink-0 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary-600 font-bold">
                                            {booking.userName?.[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">
                                                {booking.userName} <span className="text-slate-400 font-normal">booked</span> {booking.vendorName}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(booking.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`self-start sm:self-auto px-2.5 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-xl p-8 text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Admin Quick Start</h3>
                        <p className="text-primary-100 text-sm leading-relaxed">
                            Efficiently manage your platform's users, vendors, and business transactions from this master control center.
                        </p>
                    </div>
                    <div className="space-y-3 mt-8">
                        <Link to="/admin/vendors" className="block w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-center font-medium transition-colors border border-white/20">
                            Verify New Vendors
                        </Link>
                        <Link to="/admin/users" className="block w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-center font-medium transition-colors border border-white/20">
                            Review User Reports
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
