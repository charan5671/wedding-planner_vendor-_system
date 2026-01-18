import { MockBackend } from './mockBackend';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const savedUser = localStorage.getItem('wedding_user');
    const userRole = savedUser ? JSON.parse(savedUser).role : null;

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'X-User-Role': userRole || '',
                ...(options.headers || {}),
            },
        });

        if (!response.ok) {
            // If 404 or Server Error, try Mock
            if (response.status >= 500 || response.status === 404) {
                console.warn(`[API] Fallback to Mock for ${endpoint} (Status: ${response.status})`);
                return await MockBackend.handleRequest(options.method || 'GET', endpoint, options.body ? JSON.parse(options.body as string) : undefined);
            }

            const error = await response.json().catch(() => ({ message: 'An unexpected error occurred' }));
            throw new Error(error.message || response.statusText);
        }

        return await response.json();
    } catch (error) {
        console.warn(`[API] Network Error for ${endpoint}. Switching to Mock Backend.`);
        // Network Error (e.g., Backend not deployed/reachable) -> Mock Fallback
        return await MockBackend.handleRequest(options.method || 'GET', endpoint, options.body ? JSON.parse(options.body as string) : undefined);
    }
}
