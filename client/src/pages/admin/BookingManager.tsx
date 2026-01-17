import { useEffect, useState } from 'react';
import { isFirebaseConfigured } from '../../lib/firebase';
import { apiFetch } from '../../lib/api';
import { Button } from '../../components/Button';
import { useSocket } from '../../context/SocketContext';

interface Booking {
    id: string;
    userId: string;
    vendorId: string;
    userName: string;
    vendorName: string;
    date: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
}

export function BookingManager() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const socket = useSocket();

    useEffect(() => {
        fetchBookings();

        if (socket) {
            socket.on('booking-updated', (data: { bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' }) => {
                setBookings(prev => prev.map(b =>
                    b.id === data.bookingId ? { ...b, status: data.status } : b
                ));
            });
        }

        return () => {
            if (socket) socket.off('booking-updated');
        };
    }, [socket]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            if (!isFirebaseConfigured) {
                const data = await apiFetch('/admin/bookings');
                setBookings(data);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await apiFetch(`/admin/bookings/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });
            // State will update via socket listener
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const deleteBooking = async (id: string) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;
        try {
            await apiFetch(`/admin/bookings/${id}`, {
                method: 'DELETE'
            });
            fetchBookings();
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    const filteredBookings = bookings.filter(b =>
        filterStatus === 'all' ? true : b.status === filterStatus
    );

    if (loading) return <div className="p-8 text-center text-slate-500">Loading bookings...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Platform Bookings</h2>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterStatus === status
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Booking ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Couple</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vendor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredBookings.map((booking) => (
                            <tr key={booking.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">
                                    #{booking.id.slice(0, 8)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-900">{booking.userName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-900">{booking.vendorName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-500">{new Date(booking.date).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        {booking.status === 'pending' && (
                                            <>
                                                <Button size="sm" onClick={() => updateStatus(booking.id, 'confirmed')} className="bg-green-600 hover:bg-green-700 text-white">
                                                    Confirm
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => updateStatus(booking.id, 'cancelled')} className="text-red-600 hover:bg-red-50">
                                                    Cancel
                                                </Button>
                                            </>
                                        )}
                                        {booking.status === 'confirmed' && (
                                            <Button size="sm" variant="outline" onClick={() => updateStatus(booking.id, 'cancelled')} className="text-red-600 border-red-200 hover:bg-red-50">
                                                Cancel
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-slate-400 hover:text-red-600"
                                            onClick={() => deleteBooking(booking.id)}
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBookings.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        No bookings found for this status.
                    </div>
                )}
            </div>
        </div>
    );
}
