import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';
import { supabase } from '../../lib/supabase'; // Use Supabase

interface Enquiry {
    id: string;
    message: string;
    status: 'pending' | 'responded' | 'confirmed';
    created_at: string;
    user_name: string;
    user_email: string;
    vendor_id: string;
}

export function InquiryList() {
    const { user } = useAuth();
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchEnquiries();

        // --- SUPABASE REALTIME ---
        const channel = supabase
            .channel(`vendor_enquiries_${user.uid}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries', filter: `vendor_id=eq.${user.uid}` }, () => fetchEnquiries())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const fetchEnquiries = async () => {
        if (!user) return;
        try {
            // Fetch enquiries from Supabase Backend
            const data = await apiFetch(`/enquiries/vendor/${user.uid}`).catch(() => []);
            setEnquiries(data.map((e: any) => ({
                id: e.id,
                message: e.message,
                status: e.status || 'pending',
                created_at: e.createdAt,
                user_name: e.userName || 'Anonymous',
                user_email: e.userEmail || '',
                vendor_id: e.vendorId
            })));
        } catch (error) {
            console.error('Error fetching enquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading enquiries...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-serif">Customer Enquiries</h2>
                <p className="text-slate-500 text-sm mt-1">Manage and respond to your latest business opportunities</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Inquiry</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {enquiries.map((enq) => (
                                <tr key={enq.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-lg">
                                                {enq.user_name[0]}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-slate-900">{enq.user_name}</div>
                                                <div className="text-xs text-slate-500">{enq.user_email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600 line-clamp-1 max-w-xs">{enq.message}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(enq.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${enq.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            enq.status === 'responded' ? 'bg-blue-100 text-blue-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                            {enq.status.charAt(0).toUpperCase() + enq.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a
                                            href={`/negotiation/${enq.id}`}
                                            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                                        >
                                            Negotiate
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {enquiries.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No Inquiries Found</h3>
                        <p className="text-slate-500 mt-1">When couples contact you, their messages will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
