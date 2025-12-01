import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

interface Vendor {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    image: string;
    email?: string;
    phone?: string;
    location?: string;
    rating?: number;
    reviewCount?: number;
}

export function VendorDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVendor();
    }, [id]);

    const fetchVendor = async () => {
        try {
            const res = await fetch(`/api/vendors/${id}`);
            const data = await res.json();
            setVendor(data);
        } catch (error) {
            console.error('Failed to fetch vendor:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async () => {
        if (!user) {
            alert('Please login to book');
            navigate('/login');
            return;
        }

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                vendorId: id,
                date: tomorrow.toISOString().split('T')[0],
                time: '14:00'
            })
        });

        if (res.ok) {
            alert('Booking request sent!');
            navigate('/dashboard');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!vendor) {
        return <div className="flex justify-center items-center min-h-screen">Vendor not found</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-primary-600 hover:text-primary-700 flex items-center gap-2"
            >
                ← Back to Vendors
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="space-y-4">
                    <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-96 object-cover rounded-lg shadow-lg"
                    />
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-4xl font-serif font-bold text-slate-900">{vendor.name}</h1>
                            {vendor.rating && (
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-500">★</span>
                                    <span className="font-semibold">{vendor.rating}</span>
                                    <span className="text-slate-500 text-sm">({vendor.reviewCount} reviews)</span>
                                </div>
                            )}
                        </div>
                        <p className="text-lg text-primary-600">{vendor.category}</p>
                    </div>

                    <div className="border-t border-b border-slate-200 py-4">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-600">Starting Price</span>
                            <span className="text-3xl font-bold text-slate-900">${vendor.price}</span>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3">About</h2>
                        <p className="text-slate-600 leading-relaxed">{vendor.description}</p>
                    </div>

                    {(vendor.location || vendor.phone || vendor.email) && (
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
                            {vendor.location && (
                                <div className="flex items-center gap-2 text-slate-600">
                                    <span className="font-medium">Location:</span>
                                    <span>{vendor.location}</span>
                                </div>
                            )}
                            {vendor.phone && (
                                <div className="flex items-center gap-2 text-slate-600">
                                    <span className="font-medium">Phone:</span>
                                    <span>{vendor.phone}</span>
                                </div>
                            )}
                            {vendor.email && (
                                <div className="flex items-center gap-2 text-slate-600">
                                    <span className="font-medium">Email:</span>
                                    <span>{vendor.email}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-6">
                        <Button onClick={handleBook} className="w-full py-3 text-lg">
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
