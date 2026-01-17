import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    discount_percentage?: number;
    image_url?: string;
    availability?: string; // e.g., "Available", "Booked Out", or date range
    vendor_id: string;
}

export function ServiceEditor() {
    const { user } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState<Partial<Service>>({});
    const [vendorId, setVendorId] = useState<string | null>(null);

    useEffect(() => {
        if (user) fetchVendorAndServices();
    }, [user]);

    const fetchVendorAndServices = async () => {
        if (!user) return;
        try {
            if (!isFirebaseConfigured) {
                // Demo Mode
                setVendorId('mock-v1');
                setServices([
                    {
                        id: 'ms1',
                        name: 'Premium Package',
                        description: 'Full wedding day coverage',
                        price: 2500,
                        discount_percentage: 10,
                        availability: '2026-06-12 to 2026-12-31',
                        image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400',
                        vendor_id: 'mock-v1'
                    },
                    {
                        id: 'ms2',
                        name: 'Engagement Session',
                        description: '2-hour outdoor session',
                        price: 500,
                        availability: 'Always Available',
                        image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400',
                        vendor_id: 'mock-v1'
                    }
                ]);
                setLoading(false);
                return;
            }

            const vendorDocRef = doc(db, 'vendors', user.uid);
            const vendorSnap = await getDoc(vendorDocRef);

            if (vendorSnap.exists()) {
                setVendorId(vendorSnap.id);
                const servicesRef = collection(db, 'services');
                const q = query(servicesRef, where('vendor_id', '==', user.uid));
                const servicesSnap = await getDocs(q);

                setServices(servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vendorId) return;

        if (!isFirebaseConfigured) {
            if (currentService.id) {
                setServices(services.map(s => s.id === currentService.id ? { ...s, ...currentService } as Service : s));
            } else {
                setServices([...services, { ...currentService, id: 'ms' + Date.now(), vendor_id: vendorId } as Service]);
            }
            setIsEditing(false);
            setCurrentService({});
            return;
        }

        try {
            if (currentService.id) {
                const serviceRef = doc(db, 'services', currentService.id);
                await updateDoc(serviceRef, {
                    name: currentService.name,
                    description: currentService.description,
                    price: currentService.price,
                    discount_percentage: currentService.discount_percentage,
                    image_url: currentService.image_url,
                    availability: currentService.availability
                });
            } else {
                await addDoc(collection(db, 'services'), {
                    vendor_id: vendorId,
                    name: currentService.name,
                    description: currentService.description,
                    price: currentService.price,
                    discount_percentage: currentService.discount_percentage,
                    image_url: currentService.image_url,
                    availability: currentService.availability
                });
            }

            setIsEditing(false);
            setCurrentService({});
            fetchVendorAndServices();
        } catch (error) {
            alert('Error saving service');
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this service?')) return;
        if (!isFirebaseConfigured) {
            setServices(services.filter(s => s.id !== id));
            return;
        }
        try {
            await deleteDoc(doc(db, 'services', id));
            fetchVendorAndServices();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading services...</div>;

    if (!vendorId) return (
        <div className="text-center py-12">
            <h3 className="text-lg font-medium text-slate-900">Vendor Profile Not Found</h3>
            <p className="text-slate-500 mt-2">Please complete your vendor profile first.</p>
            <Button className="mt-4" onClick={() => {/* Navigate to profile create */ }}>Create Profile</Button>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-serif">Service Management</h2>
                    <p className="text-slate-500 text-sm mt-1">Add and manage your wedding services and pricing</p>
                </div>
                <Button onClick={() => { setIsEditing(true); setCurrentService({}); }} className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Add New Service
                </Button>
            </div>

            {isEditing && (
                <div className="bg-white p-8 rounded-xl shadow-md border border-slate-100 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        {currentService.id ? 'Edit Service' : 'Create New Service'}
                    </h3>
                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
                            <Input
                                value={currentService.name || ''}
                                onChange={e => setCurrentService({ ...currentService, name: e.target.value })}
                                placeholder="e.g., Full Wedding Photography Package"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea
                                className="w-full rounded-lg border-slate-200 focus:border-primary-500 focus:ring-primary-500 min-h-[100px] transition-shadow duration-200"
                                value={currentService.description || ''}
                                onChange={e => setCurrentService({ ...currentService, description: e.target.value })}
                                placeholder="Describe what you offer in this service..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Base Price ($)</label>
                            <Input
                                type="number"
                                value={currentService.price || ''}
                                onChange={e => setCurrentService({ ...currentService, price: parseFloat(e.target.value) })}
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Discount Percentage (%)</label>
                            <Input
                                type="number"
                                value={currentService.discount_percentage || ''}
                                onChange={e => setCurrentService({ ...currentService, discount_percentage: parseFloat(e.target.value) })}
                                placeholder="0"
                                min="0"
                                max="100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                            <Input
                                type="url"
                                value={currentService.image_url || ''}
                                onChange={e => setCurrentService({ ...currentService, image_url: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Availability</label>
                            <Input
                                type="text"
                                value={currentService.availability || ''}
                                onChange={e => setCurrentService({ ...currentService, availability: e.target.value })}
                                placeholder="e.g., Always Available or Seasonally"
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end space-x-3 pt-4 border-t border-slate-50 mt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button type="submit">
                                {currentService.id ? 'Update Service' : 'Save Service'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map(service => (
                    <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 flex flex-col">
                        <div className="h-48 relative overflow-hidden bg-slate-100">
                            {service.image_url ? (
                                <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                            )}
                            {service.discount_percentage && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                    {service.discount_percentage}% OFF
                                </div>
                            )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{service.name}</h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => { setCurrentService(service); setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <span className="text-2xl font-bold text-primary-600">${service.price}</span>
                                {service.discount_percentage && (
                                    <span className="text-sm text-slate-400 line-through ml-2">
                                        ${(service.price / (1 - service.discount_percentage / 100)).toFixed(0)}
                                    </span>
                                )}
                            </div>

                            <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">{service.description}</p>

                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 border-t border-slate-50 pt-4">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span>{service.availability || 'Always Available'}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {services.length === 0 && !isEditing && (
                    <div className="md:col-span-2 py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No Services Yet</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-1">Start adding services to showcase your expertise to couples.</p>
                        <Button onClick={() => setIsEditing(true)} className="mt-6">Add Your First Service</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
