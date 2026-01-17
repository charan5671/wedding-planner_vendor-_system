import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { BackButton } from '../components/BackButton';

export function VendorLayout() {
    const { profile, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && (!profile || profile.role !== 'vendor')) {
            navigate('/');
        }
    }, [profile, loading, navigate]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Vendor Portal...</div>;

    const navItems = [
        { to: '/vendor/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { to: '/vendor/services', label: 'My Services', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { to: '/vendor/enquiries', label: 'Enquiries', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
        { to: '/vendor/bookings', label: 'Bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { to: '/vendor/profile', label: 'Profile Settings', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-slate-50 relative overflow-hidden">
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-40 shadow-sm">
                <div className="flex items-center space-x-2">
                    <span className="font-serif text-xl font-bold text-primary-600">Bliss</span>
                    <span className="text-[10px] bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Vendor</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </header>

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 shadow-xl transition-all duration-300 ease-in-out md:translate-x-0 md:relative md:shadow-none
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-slate-100 hidden md:block">
                    <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-bold font-serif text-primary-600 tracking-tight">Bliss</h1>
                        <span className="text-[10px] bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Vendor</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-bold">Workspace Manager</p>
                </div>

                <div className="md:hidden p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold shadow-soft">
                            {profile?.name?.[0] || 'V'}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-sm leading-tight">{profile?.name || 'Vendor'}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{profile?.email}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.to;
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${isActive
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <svg className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                </svg>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50 relative pt-16 md:pt-0">
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 hidden md:flex justify-between items-center">
                    <h2 className="text-slate-900 font-bold uppercase tracking-widest text-xs">
                        {navItems.find(i => i.to === location.pathname)?.label || 'Vendor Panel'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                {profile?.name?.[0] || 'V'}
                            </div>
                            <div className="hidden lg:block text-left">
                                <p className="text-[11px] font-bold text-slate-800 leading-none">{profile?.name || 'Vendor Partner'}</p>
                                <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Verified Vendor</p>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-h-full">
                    <Outlet />
                </div>
                <BackButton />
            </main>
        </div>
    );
}
