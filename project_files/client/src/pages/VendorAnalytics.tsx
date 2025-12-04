import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AnalyticsData {
    views: {
        total: number;
        trend: number;
        history: { date: string; count: number }[];
    };
    bookings: {
        total: number;
        pending: number;
        completed: number;
        revenue: number;
    };
    reviews: {
        average: string;
        count: number;
        breakdown: Record<string, number>;
    };
}

export function VendorAnalytics() {
    const { user } = useAuth();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we'd use the logged-in vendor's ID. 
        // For demo, we'll use a mock ID or the user's ID if available.
        const vendorId = user?.id || 'mock-vendor-id';

        fetch(`http://localhost:3000/api/analytics/vendor/${vendorId}`)
            .then(res => res.json())
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) {
        return <div className="p-8 text-center">Loading analytics...</div>;
    }

    if (!data) {
        return <div className="p-8 text-center text-red-500">Failed to load analytics</div>;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-serif font-bold mb-8">Vendor Dashboard</h1>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="card p-6">
                    <h3 className="text-sm font-medium text-slate-500">Total Views</h3>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{data.views.total}</p>
                    <span className={`text-sm ${data.views.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.views.trend > 0 ? '+' : ''}{data.views.trend}% from last month
                    </span>
                </div>
                <div className="card p-6">
                    <h3 className="text-sm font-medium text-slate-500">Total Bookings</h3>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{data.bookings.total}</p>
                    <span className="text-sm text-slate-500">{data.bookings.pending} pending</span>
                </div>
                <div className="card p-6">
                    <h3 className="text-sm font-medium text-slate-500">Total Revenue</h3>
                    <p className="mt-2 text-3xl font-bold text-slate-900">${data.bookings.revenue.toLocaleString()}</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-sm font-medium text-slate-500">Average Rating</h3>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{data.reviews.average}</p>
                    <span className="text-sm text-slate-500">from {data.reviews.count} reviews</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Views History */}
                <div className="card p-6">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Views (Last 7 Days)</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {data.views.history.map((day) => (
                            <div key={day.date} className="flex flex-col items-center flex-1 group">
                                <div
                                    className="w-full bg-primary-100 rounded-t-sm hover:bg-primary-200 transition-colors relative"
                                    style={{ height: `${(day.count / Math.max(...data.views.history.map(d => d.count))) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {day.count}
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500 mt-2 rotate-45 origin-left translate-y-2">{day.date.slice(5)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews Breakdown */}
                <div className="card p-6">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Rating Breakdown</h3>
                    <div className="space-y-4">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center gap-4">
                                <span className="text-sm font-medium text-slate-600 w-8">{star} ★</span>
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400"
                                        style={{ width: `${(data.reviews.breakdown[star] / data.reviews.count) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm text-slate-500 w-12 text-right">
                                    {data.reviews.breakdown[star]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
