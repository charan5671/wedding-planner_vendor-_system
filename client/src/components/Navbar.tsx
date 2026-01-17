import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export function Navbar() {
    const { user, profile, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex justify-between h-20">
                    <div className="flex items-center space-x-12">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <span className="font-serif text-3xl font-black text-primary-600 tracking-tighter group-hover:scale-105 transition-transform duration-300">Bliss</span>
                            <div className="h-2 w-2 rounded-full bg-primary-600 group-hover:animate-pulse"></div>
                        </Link>

                        <div className="hidden lg:flex items-center space-x-8">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/vendors', label: 'Curated Vendors' },
                                { to: '/about', label: 'Our Story' },
                                { to: '/contact', label: 'Support' }
                            ].map(item => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className="text-slate-600 hover:text-primary-600 text-sm font-semibold tracking-wide transition-all duration-300 relative group"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex items-center space-x-4">
                            {!user && (
                                <Link to="/login?role=vendor">
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary-600 cursor-pointer transition-colors">Vendor Portal</span>
                                </Link>
                            )}

                            {user && profile ? (
                                <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                                    <div className="text-right hidden xl:block leading-none">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Welcome back,</p>
                                        <p className="text-sm font-black text-slate-900">{profile.name}</p>
                                    </div>
                                    <div className="relative group">
                                        <button className="h-10 w-10 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-black shadow-sm group-hover:ring-2 group-hover:ring-primary-500 transition-all">
                                            {profile.name?.charAt(0) || 'U'}
                                        </button>

                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-[110]">
                                            <div className="px-4 py-2 border-b border-slate-50 mb-2">
                                                <p className="text-xs font-bold text-slate-400 uppercase">Account</p>
                                                <p className="text-sm font-bold text-slate-900 truncate">{profile.email}</p>
                                            </div>
                                            <Link to="/dashboard" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-600 font-medium">Dashboard</Link>
                                            {profile.role === 'vendor' && <Link to="/vendor/dashboard" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-600 font-medium">Vendor Manager</Link>}
                                            {profile.role === 'admin' && <Link to="/admin" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-600 font-medium">System Admin</Link>}
                                            <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-medium mt-2 border-t border-slate-50 pt-3">Finalize Session</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login">
                                    <Button className="rounded-full px-6 bg-slate-900 text-white hover:bg-primary-600 shadow-lg shadow-slate-200 transition-all duration-500">
                                        Sign In
                                    </Button>
                                </Link>
                            )}
                        </div>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <svg className="w-6 h-6 outline-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 animate-slide-down">
                    <div className="px-6 py-8 space-y-4">
                        {[
                            { to: '/', label: 'Home' },
                            { to: '/vendors', label: 'Curated Vendors' },
                            { to: '/about', label: 'Our Story' },
                            { to: '/contact', label: 'Support' }
                        ].map(item => (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={closeMenu}
                                className="block text-2xl font-serif font-bold text-slate-900 hover:text-primary-600 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="px-6 pb-12 pt-8 border-t border-slate-100">
                        {user && profile ? (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-black">{profile.name?.charAt(0)}</div>
                                    <div>
                                        <p className="font-bold text-slate-900">{profile.name}</p>
                                        <p className="text-xs text-slate-400">{profile.email}</p>
                                    </div>
                                </div>
                                <Link to="/dashboard" onClick={closeMenu} className="block w-full py-3 text-center rounded-xl bg-slate-50 font-bold text-slate-600">Access Dashboard</Link>
                                <button onClick={logout} className="w-full py-3 text-center rounded-xl bg-red-50 font-bold text-red-600">Sign Out</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <Link to="/login" onClick={closeMenu} className="py-4 text-center rounded-2xl bg-slate-900 text-white font-bold">Sign In</Link>
                                <Link to="/login?role=vendor" onClick={closeMenu} className="py-4 text-center rounded-2xl bg-primary-50 text-primary-600 font-bold">Vendor Join</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
