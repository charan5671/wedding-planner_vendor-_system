import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface Booking {
    id: string;
    userName: string;
    serviceName: string;
    date: string;
    price: number;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
    createdAt: string;
}

export function VendorBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const { } = useAuth();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await apiFetch('/vendors/bookings');
            setBookings(data || []);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await apiFetch(`/vendors/bookings/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });
            fetchBookings();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500">Loading bookings...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold font-serif text-slate-900">Bookings</h1>
                    <p className="text-slate-500 mt-1">Manage your wedding reservations and client deals</p>
                </div>
                <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-bold">
                    {bookings.length} Total Bookings
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Client</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Service</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Event Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400 italic">No bookings found</td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                                                    {booking.userName?.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-slate-800">{booking.userName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">{booking.serviceName}</td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">
                                            {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-900 font-bold">${booking.price}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    booking.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link to={`/negotiation/${booking.id}`}>
                                                    <Button variant="ghost" size="sm">Chat</Button>
                                                </Link>
                                                {booking.status === 'pending' && (
                                                    <>
                                                        <Button size="sm" onClick={() => updateStatus(booking.id, 'confirmed')}>Accept</Button>
                                                        <Button variant="outline" size="sm" onClick={() => updateStatus(booking.id, 'rejected')}>Reject</Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
