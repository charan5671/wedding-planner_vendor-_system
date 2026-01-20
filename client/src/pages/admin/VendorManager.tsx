import React, { useState, useEffect } from 'react';
import { isFirebaseConfigured } from '../../lib/firebase';
import { apiFetch } from '../../lib/api';
import { supabase } from '../../lib/supabase'; // Use Supabase
import { Button } from '../../components/Button';

interface Vendor {
    id: string;
    business_name: string;
    category: string;
    location: string;
    is_verified: boolean;
    price_range?: string;
    is_suspended?: boolean;
}

export function VendorManager() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

    useEffect(() => {
        fetchVendors();

        // --- SUPABASE REALTIME ---
        const channel = supabase
            .channel('admin_vendors')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'vendors' },
                () => {
                    fetchVendors();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchVendors = async () => {
        try {
            setLoading(true);
            if (!isFirebaseConfigured) {
                const data = await apiFetch('/admin/vendors');
                setVendors(data);
            }
        } catch (error) {
            console.error('Error fetching vendors:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleVerification = async (id: string, currentStatus: boolean) => {
        try {
            await apiFetch(`/admin/vendors/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ is_verified: !currentStatus })
            });
            // Updated via socket
        } catch (error) {
            console.error('Error updating vendor:', error);
        }
    };

    const toggleSuspension = async (id: string, currentStatus: boolean) => {
        try {
            await apiFetch(`/admin/vendors/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ is_suspended: !currentStatus })
            });
        } catch (error) {
            console.error('Error suspending vendor:', error);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingVendor) return;
        try {
            await apiFetch(`/admin/vendors/${editingVendor.id}`, {
                method: 'PATCH',
                body: JSON.stringify(editingVendor)
            });
            setEditingVendor(null);
        } catch (error) {
            console.error('Error updating vendor:', error);
        }
    };

    const deleteVendor = async (id: string) => {
        if (!confirm('Are you sure you want to delete this vendor?')) return;
        try {
            await apiFetch(`/admin/vendors/${id}`, {
                method: 'DELETE'
            });
            fetchVendors();
        } catch (error) {
            console.error('Error deleting vendor:', error);
        }
    };

    const filteredVendors = vendors.filter(v =>
        v.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-slate-500">Loading vendors...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Manage Vendors</h2>
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search vendors..."
                        className="input pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Business</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredVendors.map((vendor) => (
                            <tr key={vendor.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-900">{vendor.business_name}</div>
                                    <div className="text-xs text-slate-500">{vendor.location}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                                        {vendor.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                    <button
                                        onClick={() => toggleVerification(vendor.id, !!vendor.is_verified)}
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${vendor.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                    >
                                        {vendor.is_verified ? 'Verified' : 'Pending'}
                                    </button>
                                    <button
                                        onClick={() => toggleSuspension(vendor.id, !!vendor.is_suspended)}
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${vendor.is_suspended ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}
                                    >
                                        {vendor.is_suspended ? 'Suspended' : 'Active'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        className="text-primary-600 hover:text-primary-900"
                                        onClick={() => setEditingVendor(vendor)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-900"
                                        onClick={() => deleteVendor(vendor.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredVendors.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        No vendors matched your search.
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingVendor && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Edit Vendor</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="label">Business Name</label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    value={editingVendor.business_name}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, business_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">Category</label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    value={editingVendor.category}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, category: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">Location</label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    value={editingVendor.location}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, location: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4 mt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setEditingVendor(null)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1">
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
