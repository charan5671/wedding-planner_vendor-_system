import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Card } from '../components/Card';

interface Booking {
    id: string;
    vendorId: string;
    date: string;
    status: string;
}

export function Dashboard() {
    const { user } = useAuth();
    const socket = useSocket();
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        socket.on('booking-updated', (updatedBooking: Booking) => {
            setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
        });

        socket.on('new-booking', (newBooking: Booking) => {
            if (user?.role === 'vendor') {
                setBookings(prev => [...prev, newBooking]);
            }
        });

        return () => {
            socket.off('booking-updated');
            socket.off('new-booking');
        };
    }, [socket, user]);

    const fetchBookings = async () => {
        if (!user) return;
        const endpoint = user.role === 'vendor'
            ? `/api/bookings/vendor/${user.id}`
            : `/api/bookings/user/${user.id}`;

        const res = await fetch(`http://localhost:3000${endpoint}`);
        const data = await res.json();
        setBookings(data);
    };

    const updateStatus = async (id: string, status: string) => {
        await fetch(`http://localhost:3000/api/bookings/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
    };

    if (!user) return <div>Please login</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">
                {user.role === 'vendor' ? 'Vendor Dashboard' : 'My Wedding Plan'}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {user.role === 'vendor' ? 'Incoming Bookings' : 'My Bookings'}
                        </h2>
                        <div className="space-y-4">
                            {bookings.length === 0 && <p className="text-slate-500">No bookings yet.</p>}
                            {bookings.map((booking) => (
                                <div key={booking.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">Date: {booking.date}</p>
                                        <p className="text-sm text-slate-600">Status: <span className="capitalize">{booking.status}</span></p>
                                    </div>
                                    {user.role === 'vendor' && booking.status === 'pending' && (
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => updateStatus(booking.id, 'confirmed')}
                                                className="text-green-600 hover:text-green-700 font-medium text-sm"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => updateStatus(booking.id, 'rejected')}
                                                className="text-red-600 hover:text-red-700 font-medium text-sm"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Total Bookings</span>
                                <span className="font-medium">{bookings.length}</span>
                            </div>
                            {user.role === 'couple' && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Budget Spent</span>
                                        <span className="font-medium">$0</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Tasks Left</span>
                                        <span className="font-medium">12</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
