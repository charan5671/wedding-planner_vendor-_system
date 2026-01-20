import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { supabase } from '../../lib/supabase'; // Use Supabase

interface Report {
    id: string;
    reporter: { full_name: string };
    target_vendor?: { business_name: string };
    target_user?: { full_name: string };
    reason: string;
    description: string;
    status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
    admin_notes: string;
    created_at: string;
}

export function ReportManager() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();

        // --- SUPABASE REALTIME ---
        const channel = supabase
            .channel('admin_reports')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'reports' },
                () => {
                    fetchReports();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const data = await apiFetch('/admin/reports');
            setReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateReportStatus = async (id: string, status: string) => {
        try {
            await apiFetch(`/admin/reports/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });
            // State will be updated via socket listener
        } catch (error) {
            console.error('Error updating report:', error);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading reports...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">User Reports & Moderation</h2>

            <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reporter</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Target</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {reports.map((report) => (
                            <tr key={report.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                    {report.reporter?.full_name || 'Anonymous'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {report.target_vendor?.business_name || report.target_user?.full_name || 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-slate-900">{report.reason}</div>
                                    <div className="text-xs text-slate-500 line-clamp-1">{report.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-slate-100 text-slate-800'
                                        }`}>
                                        {report.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <select
                                        className="text-sm border-slate-200 rounded-md bg-slate-50 px-2 py-1"
                                        value={report.status}
                                        onChange={(e) => updateReportStatus(report.id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="investigating">Investigate</option>
                                        <option value="resolved">Resolve</option>
                                        <option value="dismissed">Dismiss</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reports.length === 0 && (
                    <div className="p-12 text-center text-slate-500">No active reports.</div>
                )}
            </div>
        </div>
    );
}
