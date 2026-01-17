import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { apiFetch } from '../../lib/api';

export function VendorProfile() {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        businessName: '',
        email: '',
        phone: '',
        description: '',
        location: '',
        category: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                businessName: (profile as any).business_name || '',
                email: profile.email || '',
                phone: (profile as any).phone || '',
                description: (profile as any).description || '',
                location: (profile as any).location || '',
                category: (profile as any).category || ''
            });
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await apiFetch('/vendors/profile', {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-serif text-slate-900">Profile Settings</h1>
                <p className="text-slate-500 mt-2">Manage your business profile and contact information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-slate-900">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                        <h2 className="font-bold text-slate-800">Business Information</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Business Name</label>
                            <input
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                required
                            >
                                <option value="">Select a category</option>
                                <option value="Photography">Photography</option>
                                <option value="Venue">Venue</option>
                                <option value="Catering">Catering</option>
                                <option value="Florist">Florist</option>
                                <option value="Music">Music</option>
                                <option value="Decor">Decor</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all outline-none resize-none"
                                placeholder="Tell couples about your services..."
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-slate-900">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                        <h2 className="font-bold text-slate-800">Contact & Location</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Contact Person</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                                disabled
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Location</label>
                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                placeholder="e.g. New York, NY"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm border border-green-100">
                        Profile updated successfully!
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <Button type="submit" loading={loading} className="px-10">
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
