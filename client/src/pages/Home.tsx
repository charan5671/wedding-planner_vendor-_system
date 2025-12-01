import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export function Home() {
    return (
        <div className="relative">
            {/* Hero Section */}
            <div className="relative h-[600px] flex items-center justify-center text-center">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative z-10 max-w-3xl px-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
                        Plan Your Dream Wedding
                    </h1>
                    <p className="text-xl text-white/90 mb-8">
                        Find the perfect vendors, manage your budget, and organize your special day all in one place.
                    </p>
                    <Link to="/vendors">
                        <Button className="text-lg px-8 py-3 bg-white text-slate-900 hover:bg-slate-100">
                            Start Planning
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-slate-900">Everything You Need</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Find Vendors</h3>
                            <p className="text-slate-600">Browse top-rated photographers, venues, and more.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Manage Tasks</h3>
                            <p className="text-slate-600">Keep track of your to-do list and never miss a deadline.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Track Budget</h3>
                            <p className="text-slate-600">Stay on budget with our easy-to-use expense tracker.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
