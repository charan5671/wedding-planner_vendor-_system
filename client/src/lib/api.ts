export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const savedUser = localStorage.getItem('wedding_user');
    const userRole = savedUser ? JSON.parse(savedUser).role : null;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'X-User-Role': userRole || '',
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An unexpected error occurred' }));
        throw new Error(error.message || response.statusText);
    }

    return response.json();
}
