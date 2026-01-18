import { MOCK_VENDORS, MOCK_BOOKINGS } from './mockData';

const MOCK_DELAY = 600; // Simulate network latency

export const MockBackend = {
    async handleRequest(method: string, endpoint: string, body?: any): Promise<any> {
        await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

        console.log(`[MockBackend] ${method} ${endpoint}`, body);

        // --- AUTH ---
        if (endpoint.startsWith('/auth/login')) {
            const { email } = body || {};
            // Simulate Admin
            if (email === 'admin@bliss.com') {
                return {
                    user: {
                        id: 'admin_mock_id',
                        name: 'Platform Admin',
                        email: 'admin@bliss.com',
                        role: 'admin'
                    }
                };
            }
            // Simulate Vendor
            if (email === 'vendor@bliss.com') {
                return {
                    user: {
                        id: 'vendor_mock_id',
                        name: 'Premium Vendor',
                        email: 'vendor@bliss.com',
                        role: 'vendor'
                    }
                };
            }
            // Default User
            return {
                user: {
                    id: 'mock_user_id',
                    name: 'Demo User',
                    email: email || 'user@example.com',
                    role: 'couple'
                }
            };
        }

        if (endpoint.startsWith('/auth/register')) {
            return {
                user: {
                    id: 'mock_new_user_' + Date.now(),
                    name: body?.name || 'New User',
                    email: body?.email,
                    role: body?.role || 'couple'
                }
            };
        }

        // --- VENDORS ---
        if (endpoint === '/vendors' && method === 'GET') {
            return MOCK_VENDORS;
        }

        if (endpoint.match(/^\/vendors\/[^/]+$/) && method === 'GET') {
            const id = endpoint.split('/').pop();
            const vendor = MOCK_VENDORS.find(v => v.id === id);
            if (!vendor) throw { status: 404, message: 'Vendor not found' };
            return vendor;
        }

        // --- BOOKINGS ---
        if (endpoint === '/bookings' && method === 'GET') {
            return MOCK_BOOKINGS;
        }

        // --- ANALYTICS ---
        if (endpoint.startsWith('/analytics')) {
            return {
                views: 1250,
                inquiries: 45,
                bookings: 12,
                revenue: 15400
            };
        }

        // --- VENDOR ENQUIRIES ---
        if (endpoint.match(/\/enquiries\/vendor\/.*/) && method === 'GET') {
            return [
                {
                    id: 'e1',
                    userName: 'Sarah Jones',
                    userEmail: 'sarah@example.com',
                    message: 'Is your venue available for Sep 15th?',
                    status: 'pending',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'e2',
                    userName: 'Mike Brown',
                    userEmail: 'mike@test.com',
                    message: 'Do you offer vegan catering options?',
                    status: 'read',
                    created_at: new Date(Date.now() - 86400000).toISOString()
                }
            ];
        }

        // Default: 404
        console.warn(`[MockBackend] Unhandled endpoint: ${endpoint}`);
        throw { status: 404, message: 'Resource not found in Mock Backend' };
    }
};
