import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { apiFetch } from '../lib/api';

interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'vendor' | 'user' | 'couple';
}

interface AuthContextType {
    user: any; // Firebase User or Local User
    profile: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
    loginAsDemoUser: () => Promise<void>;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isFirebaseConfigured) {
            const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                setUser(firebaseUser);
                if (firebaseUser) {
                    await fetchFirebaseProfile(firebaseUser.uid, firebaseUser.email || '');
                } else {
                    setProfile(null);
                    setLoading(false);
                }
            });
            return () => unsubscribe();
        } else {
            // Local Auth persistence
            const savedUser = localStorage.getItem('wedding_user');
            if (savedUser) {
                const parsed = JSON.parse(savedUser);
                setUser(parsed);
                setProfile(parsed);
            }
            setLoading(false);
        }
    }, []);

    const fetchFirebaseProfile = async (userId: string, email: string) => {
        try {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setProfile({
                    id: userId,
                    email: data.email || email,
                    name: data.name || 'User',
                    role: data.role || 'user',
                });
            } else {
                setProfile({ id: userId, email, name: 'User', role: 'user' });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setProfile({ id: userId, email, name: 'User', role: 'user' });
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: any) => {
        if (!isFirebaseConfigured) {
            const response = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });
            setUser(response.user);
            setProfile(response.user);
            localStorage.setItem('wedding_user', JSON.stringify(response.user));
            return;
        }
        // Firebase login is handled in Login.tsx directly via signInWithEmailAndPassword
    };

    const register = async (data: any) => {
        if (!isFirebaseConfigured) {
            const response = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            setUser(response.user);
            setProfile(response.user);
            localStorage.setItem('wedding_user', JSON.stringify(response.user));
            return;
        }
    };

    const logout = async () => {
        if (isFirebaseConfigured) {
            await firebaseSignOut(auth);
        }
        localStorage.removeItem('wedding_user');
        setProfile(null);
        setUser(null);
    };

    const loginAsDemoUser = async () => {
        const demoUser = {
            id: 'demo-user-123',
            uid: 'demo-user-123',
            email: 'demo@example.com',
            name: 'Demo User',
            role: 'vendor',
        };
        setUser(demoUser);
        setProfile(demoUser as any);
        localStorage.setItem('wedding_user', JSON.stringify(demoUser));
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, logout, loginAsDemoUser, login, register }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
