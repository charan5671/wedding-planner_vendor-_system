import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="font-serif text-2xl font-bold text-primary-600">Bliss</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link to="/" className="text-slate-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-500 text-sm font-medium">
                                Home
                            </Link>
                            <Link to="/vendors" className="text-slate-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-500 text-sm font-medium">
                                Find Vendors
                            </Link>
                            {user && (
                                <>
                                    <Link to="/dashboard" className="text-slate-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-500 text-sm font-medium">
                                        Dashboard
                                    </Link>
                                    {user.role === 'vendor' && (
                                        <Link to="/analytics" className="text-slate-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-500 text-sm font-medium">
                                            Analytics
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-sm text-slate-600">Hi, {user.name}</span>
                                <Button variant="ghost" onClick={logout}>Logout</Button>
                            </>
                        ) : (
                            <Link to="/login">
                                <Button>Sign In</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
