import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<'couple' | 'vendor'>('couple');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { loginAsDemoUser, login, register } = useAuth();
    const navigate = useNavigate();

    const handleDemoLogin = async () => {
        try {
            await loginAsDemoUser();
            navigate('/');
        } catch (err) {
            console.error('Demo login failed:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isFirebaseConfigured) {
                if (isLogin) {
                    await signInWithEmailAndPassword(auth, email, password);
                    navigate('/');
                } else {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;

                    // Create user profile in Firestore
                    await setDoc(doc(db, 'users', user.uid), {
                        email: user.email,
                        name: name,
                        role: role,
                        created_at: new Date().toISOString()
                    });

                    // If vendor, create an empty vendor profile too
                    if (role === 'vendor') {
                        await setDoc(doc(db, 'vendors', user.uid), { // using same UID for vendor ID for simplicity
                            business_name: name, // Default to using name
                            category: 'Uncategorized',
                            user_id: user.uid,
                            created_at: new Date().toISOString()
                        });
                    }

                    navigate('/');
                }
            } else {
                // Local Backend
                if (isLogin) {
                    await login({ email, password });
                } else {
                    await register({ name, email, password, role });
                }

                // Fetch updated profile to check role for redirection
                const savedUser = JSON.parse(localStorage.getItem('wedding_user') || '{}');
                if (savedUser.role === 'admin') {
                    navigate('/admin');
                } else if (savedUser.role === 'vendor') {
                    navigate('/vendor/dashboard');
                } else {
                    navigate('/');
                }
            }
        } catch (error: any) {
            console.error(error);
            // Improve error message readability
            let msg = error.message;
            if (error.code === 'auth/api-key-not-valid' || error.message.includes('api-key-not-valid')) {
                msg = 'Invalid Firebase API Key. Please update your client/.env file.';
            } else if (error.code === 'auth/invalid-email') {
                msg = 'Invalid email address.';
            } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                msg = 'Invalid email or password.';
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 animate-fade-in">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-serif font-bold text-slate-900">
                        {isLogin ? 'Sign in to your account' : 'Create your account'}
                    </h2>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl relative text-sm animate-shake" role="alert">
                        <span className="block sm:inline">{error}</span>
                        {(error.includes('API Key') || error.includes('api-key-not-valid') || error.includes('unexpected')) && (
                            <div className="mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full text-xs py-2 border-red-200 hover:bg-red-100 text-red-700 rounded-xl transition-all"
                                    onClick={() => handleDemoLogin()}
                                >
                                    Login as Demo User (Bypass)
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {!isLogin && (
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    required
                                    placeholder="Full Name / Business Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <Input
                                type="email"
                                required
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                type="password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {!isLogin && (
                            <div className="mb-4">
                                <select
                                    className="input"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as 'couple' | 'vendor')}
                                >
                                    <option value="couple">Couple</option>
                                    <option value="vendor">Vendor</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
                        </Button>
                    </div>
                </form>
                <div className="text-center">
                    <button
                        className="text-sm font-medium text-primary-600 hover:text-primary-500 hover:underline"
                        onClick={() => { setIsLogin(!isLogin); setError(null); }}
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
}
