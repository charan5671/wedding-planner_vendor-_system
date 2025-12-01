import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

interface Vendor {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    image: string;
}

export function VendorSearch() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [category, setCategory] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchVendors();
    }, [category]);

    const fetchVendors = async () => {
        const url = category
            ? `http://localhost:3000/api/vendors?category=${category}`
            : 'http://localhost:3000/api/vendors';
        const res = await fetch(url);
        const data = await res.json();
        setVendors(data);
    };

    const handleBook = async (vendorId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        if (!user) return alert('Please login to book');

        // Simple booking for demo - books for "tomorrow"
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const res = await fetch('http://localhost:3000/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                vendorId,
                date: tomorrow.toISOString().split('T')[0],
                time: '14:00'
            })
        });

        if (res.ok) {
            alert('Booking request sent!');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-slate-900">Find Vendors</h1>
                <select
                    className="input w-48"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="Photographer">Photographers</option>
                    <option value="Venue">Venues</option>
                    <option value="Decorator">Decorators</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                    <Card
                        key={vendor.id}
                        className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => navigate(`/vendors/${vendor.id}`)}
                    >
                        <img
                            src={vendor.image}
                            alt={vendor.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900">{vendor.name}</h3>
                                    <p className="text-sm text-primary-600">{vendor.category}</p>
                                </div>
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                                    ${vendor.price}
                                </span>
                            </div>
                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{vendor.description}</p>
                            <Button
                                className="w-full"
                                onClick={(e) => handleBook(vendor.id, e)}
                            >
                                Book Now
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
