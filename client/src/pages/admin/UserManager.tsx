import { useEffect, useState } from 'react';
import { isFirebaseConfigured } from '../../lib/firebase';
import { apiFetch } from '../../lib/api';
import { Button } from '../../components/Button';
import { useSocket } from '../../context/SocketContext';

interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'vendor' | 'couple';
    is_suspended?: boolean;
}

export function UserManager() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const socket = useSocket();

    useEffect(() => {
        fetchUsers();

        if (socket) {
            socket.on('user-status-changed', (data: any) => {
                setUsers(prev => prev.map(u =>
                    u.id === data.userId ? { ...u, ...data } : u
                ));
            });
        }

        return () => {
            if (socket) socket.off('user-status-changed');
        };
    }, [socket]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            if (!isFirebaseConfigured) {
                const data = await apiFetch('/admin/users');
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateRole = async (id: string, newRole: string) => {
        try {
            await apiFetch(`/admin/users/${id}/role`, {
                method: 'PATCH',
                body: JSON.stringify({ role: newRole })
            });
            // Updated via socket
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const toggleSuspension = async (id: string, currentStatus: boolean) => {
        try {
            await apiFetch(`/admin/users/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ is_suspended: !currentStatus })
            });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const deleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
        try {
            await apiFetch(`/admin/users/${id}`, {
                method: 'DELETE'
            });
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-slate-500">Loading users...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-900 font-serif">Manage Platform Users</h2>
                <div className="relative w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="input pl-10 w-full bg-white/50 backdrop-blur-sm focus:bg-white transition-all border-slate-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md shadow-xl border border-white/20 rounded-2xl overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">User Details</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Role & Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Administrative Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className={`h-12 w-12 flex-shrink-0 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' :
                                                user.role === 'vendor' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-rose-100 text-rose-700'
                                            }`}>
                                            {user.full_name?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-semibold text-slate-900">{user.full_name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col gap-2">
                                        <select
                                            className="text-xs font-medium border-slate-200 bg-white rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-500 w-32 shadow-sm"
                                            value={user.role}
                                            onChange={(e) => updateRole(user.id, e.target.value)}
                                        >
                                            <option value="couple">Couple</option>
                                            <option value="vendor">Vendor</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <button
                                            onClick={() => toggleSuspension(user.id, !!user.is_suspended)}
                                            className={`w-32 py-1 px-3 rounded-lg text-[10px] uppercase tracking-tighter font-bold transition-all shadow-sm ${user.is_suspended
                                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                                    : 'bg-green-500 text-white hover:bg-green-600'
                                                }`}
                                        >
                                            {user.is_suspended ? 'Suspended' : 'Active Account'}
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex justify-end items-center gap-3">
                                        <Button
                                            variant="ghost"
                                            className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-xl hover:bg-red-50"
                                            onClick={() => deleteUser(user.id)}
                                            title="Delete User"
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
                {filteredUsers.length === 0 && (
                    <div className="p-16 text-center">
                        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <p className="text-slate-500 font-medium">No members found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
