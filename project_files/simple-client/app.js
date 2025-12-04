const API_URL = 'http://localhost:3000'; // Will use mock data fallback in production

// --- Mock Data for Demo (Fallback) ---
const MOCK_VENDORS = [
    { id: 'v1', name: 'Elegant Moments Photography', category: 'Photographer', location: 'New York, NY', price: 1500, rating: 4.8, description: 'Capturing your special moments with style and elegance. Award-winning photography team with 10+ years experience.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v2', name: 'Grand Ballroom Venue', category: 'Venue', location: 'Los Angeles, CA', price: 5000, rating: 4.9, description: 'A luxurious venue for your dream wedding with stunning architecture and world-class amenities.', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v3', name: 'Floral Fantasies', category: 'Decorator', location: 'Chicago, IL', price: 800, rating: 4.7, description: 'Beautiful floral arrangements for any theme. Creating magical atmospheres with fresh flowers.', image: 'https://images.unsplash.com/photo-1522673607200-1645062cd495?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1522673607200-1645062cd495?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v4', name: 'Gourmet Delights Catering', category: 'Caterer', location: 'San Francisco, CA', price: 3500, rating: 4.9, description: 'Exquisite cuisine crafted by award-winning chefs. Farm-to-table ingredients and custom menus.', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v5', name: 'Melody Makers Live Band', category: 'Entertainment', location: 'Nashville, TN', price: 2000, rating: 4.8, description: 'Professional live band specializing in weddings. From jazz to pop, we play it all!', image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v6', name: 'Luxe Bridal Boutique', category: 'Bridal Wear', location: 'Miami, FL', price: 2500, rating: 4.9, description: 'Designer wedding gowns and custom alterations. Find your perfect dress with our expert stylists.', image: 'https://images.unsplash.com/photo-1594552072238-6d7b8e6f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1594552072238-6d7b8e6f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v7', name: 'Cinematic Weddings Videography', category: 'Videographer', location: 'Austin, TX', price: 1800, rating: 4.8, description: 'Cinematic wedding films that tell your love story. 4K quality with drone footage included.', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v8', name: 'Sweet Celebrations Bakery', category: 'Cake Designer', location: 'Portland, OR', price: 600, rating: 4.7, description: 'Custom wedding cakes that taste as amazing as they look. Gluten-free and vegan options available.', image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1535254973040-607b474cb50d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v9', name: 'Garden Paradise Venue', category: 'Venue', location: 'Seattle, WA', price: 4200, rating: 4.9, description: 'Enchanting outdoor garden venue with waterfall and gazebo. Perfect for romantic ceremonies.', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v10', name: 'Artisan Invitations Studio', category: 'Stationery', location: 'Boston, MA', price: 450, rating: 4.6, description: 'Handcrafted wedding invitations and paper goods. Eco-friendly materials and custom designs.', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v11', name: 'Elite Transportation Services', category: 'Transportation', location: 'Las Vegas, NV', price: 900, rating: 4.8, description: 'Luxury wedding transportation with vintage and modern vehicles. Professional chauffeurs included.', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v12', name: 'Glamour Hair & Makeup Studio', category: 'Hair & Makeup', location: 'Atlanta, GA', price: 550, rating: 4.9, description: 'Professional bridal hair and makeup artists. On-site services and trial sessions available.', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v13', name: 'Timeless Moments Photography', category: 'Photographer', location: 'Denver, CO', price: 2200, rating: 4.9, description: 'Documentary-style wedding photography capturing authentic emotions. Two photographers included.', image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v14', name: 'Enchanted Events Planning', category: 'Wedding Planner', location: 'Phoenix, AZ', price: 3000, rating: 4.8, description: 'Full-service wedding planning and coordination. Stress-free planning from start to finish.', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v15', name: 'Rustic Barn Venue', category: 'Venue', location: 'Nashville, TN', price: 3200, rating: 4.7, description: 'Charming rustic barn venue with countryside views. Perfect for bohemian and country weddings.', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v16', name: 'Sparkle & Shine DJ Services', category: 'Entertainment', location: 'Orlando, FL', price: 1200, rating: 4.7, description: 'Professional DJ services with state-of-the-art equipment and extensive music library.', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v17', name: 'Coastal Elegance Decor', category: 'Decorator', location: 'San Diego, CA', price: 1100, rating: 4.8, description: 'Sophisticated event decoration with beach and coastal themes. Custom centerpieces and backdrops.', image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1478146896981-b80fe463b330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v18', name: 'Vintage Charm Rentals', category: 'Rentals', location: 'Charleston, SC', price: 750, rating: 4.6, description: 'Unique vintage furniture and decor rentals. From antique chairs to rustic tables.', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v19', name: 'Blissful Spa & Beauty', category: 'Hair & Makeup', location: 'Scottsdale, AZ', price: 680, rating: 4.8, description: 'Luxury spa services and bridal beauty packages. Relax and get pampered before your big day.', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v20', name: 'Skyline Rooftop Venue', category: 'Venue', location: 'New York, NY', price: 6000, rating: 4.9, description: 'Modern rooftop venue with panoramic city views. Perfect for contemporary urban weddings.', image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1478146896981-b80fe463b330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v21', name: 'Tropical Paradise Catering', category: 'Caterer', location: 'Honolulu, HI', price: 2800, rating: 4.7, description: 'Island-inspired cuisine with fresh seafood and tropical flavors. Perfect for beach weddings.', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v22', name: 'Classic Strings Quartet', category: 'Entertainment', location: 'Philadelphia, PA', price: 1500, rating: 4.9, description: 'Elegant string quartet for ceremonies and cocktail hours. Classical and contemporary repertoire.', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] },
    { id: 'v23', name: 'Memories Forever Videography', category: 'Videographer', location: 'Dallas, TX', price: 1600, rating: 4.8, description: 'Artistic wedding videography with same-day highlights. Capturing every precious moment in HD.', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', gallery: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] }
];
let currentUser = null;
let socket = null;
let isLoginMode = true;
let userWishlist = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check for stored user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUI();
        if (currentUser.role === 'couple') {
            loadWishlist();
        }
    }

    // Initialize socket (only works locally)
    if (typeof io !== 'undefined') {
        try {
            socket = io(API_URL);

            socket.on('new-booking', (booking) => {
                if (currentUser && currentUser.role === 'vendor') {
                    loadDashboard();
                    showNotification('New Booking', 'You have a new booking request!');
                }
            });

            socket.on('booking-updated', (booking) => {
                loadDashboard();
            });

            socket.on(`notification-${currentUser?.id}`, (notification) => {
                showNotification(notification.title, notification.message);
                updateNotificationBadge();
            });
        } catch (e) {
            console.log('Socket.io not available');
        }
    }

    // Event listeners
    document.getElementById('loginBtn').addEventListener('click', () => {
        document.getElementById('loginModal').style.display = 'block';
    });

    document.getElementById('logoutBtn').addEventListener('click', logout);

    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('loginModal').style.display = 'none';
    });

    document.getElementById('toggleAuth').addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        updateAuthForm();
    });

    document.getElementById('authForm').addEventListener('submit', handleAuth);

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('href').substring(1);
            loadPage(page);

            // Close mobile menu if open
            document.querySelector('.nav-links').classList.remove('active');
            document.querySelector('.mobile-menu-btn').classList.remove('active');
        });
    });

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }

    // Check for deep linking
    const urlParams = new URLSearchParams(window.location.search);
    const vendorId = urlParams.get('vendorId');

    if (vendorId) {
        loadVendorDetails(vendorId);
    } else {
        loadPage('home');
    }
});

function updateAuthForm() {
    const nameField = document.getElementById('nameField');
    const roleField = document.getElementById('roleField');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.querySelector('#authForm button');
    const toggleLink = document.getElementById('toggleAuth');

    if (isLoginMode) {
        nameField.style.display = 'none';
        roleField.style.display = 'none';
        modalTitle.textContent = 'Sign in to your account';
        submitBtn.textContent = 'Sign in';
        toggleLink.textContent = "Don't have an account? Sign up";
    } else {
        nameField.style.display = 'block';
        roleField.style.display = 'block';
        modalTitle.textContent = 'Create your account';
        submitBtn.textContent = 'Sign up';
        toggleLink.textContent = 'Already have an account? Sign in';
    }
}

async function handleAuth(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;

    // Check for admin login
    const endpoint = (role === 'admin' || email === 'admin@bliss.com') ? '/api/admin/login' :
        (isLoginMode ? '/api/auth/login' : '/api/auth/register');
    const body = isLoginMode ? { email, password } : { name, email, password, role };

    try {
        const res = await fetch(API_URL + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (res.ok) {
            currentUser = data.user || data.admin;
            if (data.admin) currentUser.role = 'admin';
            localStorage.setItem('user', JSON.stringify(currentUser));
            document.getElementById('loginModal').style.display = 'none';
            updateUI();
            if (currentUser.role === 'couple') {
                loadWishlist();
            }
            loadPage('home');
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.warn('⚠️ Backend offline, using mock login for demo:', error);
        // Mock Login Fallback
        const mockUser = {
            id: 'demo-user-1',
            name: name || 'Demo User',
            email: email || 'demo@example.com',
            role: role || 'couple'
        };
        
        currentUser = mockUser;
        localStorage.setItem('user', JSON.stringify(currentUser));
        document.getElementById('loginModal').style.display = 'none';
        updateUI();
        
        if (currentUser.role === 'couple') {
            // Initialize mock data for demo user
            userWishlist = [
                { id: 'w1', vendorId: 'v1', vendor: MOCK_VENDORS[0] },
                { id: 'w2', vendorId: 'v2', vendor: MOCK_VENDORS[1] }
            ];
        }
        
        loadPage('home');
        
        // Show demo banner if not already there
        if (!document.getElementById('demoBanner')) {
            const banner = document.createElement('div');
            banner.id = 'demoBanner';
            banner.style.cssText = 'background:#fef3c7; color:#92400e; padding:0.75rem; text-align:center; font-size:0.875rem; border-bottom:1px solid #fcd34d; position:sticky; top:0; z-index:999;';
            banner.innerHTML = '⚠️ <b>Demo Mode:</b> Backend is offline. You are logged in as a Demo User. <button onclick="this.parentElement.remove()" style="margin-left:1rem; background:#92400e; color:#fef3c7; border:none; padding:0.25rem 0.75rem; border-radius:4px; cursor:pointer;">Dismiss</button>';
            document.body.prepend(banner);
        }
        
        alert('✅ (Demo Mode) Logged in successfully!');
    }
}

function logout() {
    currentUser = null;
    userWishlist = [];
    localStorage.removeItem('user');
    updateUI();
    loadPage('home');
}

function updateUI() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userGreeting = document.getElementById('userGreeting');
    const dashboardLink = document.getElementById('dashboardLink');
    const wishlistLink = document.getElementById('wishlistLink');
    const budgetLink = document.getElementById('budgetLink');
    const adminLink = document.getElementById('adminLink');
    const notificationBell = document.getElementById('notificationBell');

    if (currentUser) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        userGreeting.style.display = 'block';
        userGreeting.textContent = `Hi, ${currentUser.name}`;
        dashboardLink.style.display = 'block';
        notificationBell.style.display = 'block';

        if (currentUser.role === 'couple') {
            wishlistLink.style.display = 'block';
            budgetLink.style.display = 'block';
        }

        if (currentUser.role === 'admin') {
            adminLink.style.display = 'block';
        }
    } else {
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        userGreeting.style.display = 'none';
        dashboardLink.style.display = 'none';
        wishlistLink.style.display = 'none';
        budgetLink.style.display = 'none';
        adminLink.style.display = 'none';
        notificationBell.style.display = 'none';
    }
}

function loadPage(page) {
    const mainContent = document.getElementById('mainContent');

    switch (page) {
        case 'home':
            mainContent.innerHTML = getHomePage();
            break;
        case 'vendors':
            loadVendorsPage();
            break;
        case 'wishlist':
            if (!currentUser) {
                alert('Please login first');
                return;
            }
            loadWishlistPage();
            break;
        case 'budget':
            if (!currentUser) {
                alert('Please login first');
                return;
            }
            loadBudgetPage();
            break;
        case 'dashboard':
            if (!currentUser) {
                alert('Please login first');
                return;
            }
            loadDashboardPage();
            break;
        case 'admin':
            if (!currentUser || currentUser.role !== 'admin') {
                alert('Admin access required');
                return;
            }
            loadAdminPage();
            break;
        case 'about':
            loadAboutPage();
            break;
        case 'contact':
            loadContactPage();
            break;
    }
}

function getHomePage() {
    // Get top 6 vendors sorted by rating
    const topVendors = [...MOCK_VENDORS].sort((a, b) => b.rating - a.rating).slice(0, 6);

    return `
        <div class="hero">
            <div class="hero-content">
                <h1>Plan Your Dream Wedding</h1>
                <p>Find the perfect vendors, manage your budget, and organize your special day all in one place.</p>
                <button class="btn" onclick="loadPage('vendors')">Start Planning</button>
            </div>
        </div>
        
        <!-- Top Vendors Section -->
        <div class="container" style="padding:4rem 0;">
            <div style="text-align:center; margin-bottom:3rem;">
                <h2 style="font-size:2.5rem; margin-bottom:1rem;">⭐ Top Rated Vendors</h2>
                <p style="color:#64748b; font-size:1.1rem;">Discover our most highly-rated wedding professionals</p>
            </div>
            <div class="vendors-grid">
                ${topVendors.map(vendor => `
                    <a href="?vendorId=${vendor.id}" target="_blank" class="card vendor-card-clickable" style="text-decoration:none; color:inherit; display:block;">
                        <img src="${vendor.image}" alt="${vendor.name}" style="width:100%; height:200px; object-fit:cover; border-radius:8px 8px 0 0;">
                        <div class="card-content">
                            <div class="card-header">
                                <div>
                                    <h3>${vendor.name}</h3>
                                    <p class="category">${vendor.category}</p>
                                    ${vendor.location ? `<p style="font-size:0.75rem; color:#64748b;">📍 ${vendor.location}</p>` : ''}
                                </div>
                                <span class="price">$${vendor.price}</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.5rem;">
                                <span style="color:#fbbf24;">⭐</span>
                                <span style="font-weight:600;">${vendor.rating}</span>
                                <span style="color:#64748b; font-size:0.875rem;">(Highly Rated)</span>
                            </div>
                        </div>
                    </a>
                `).join('')}
            </div>
            <div style="text-align:center; margin-top:2rem;">
                <button class="btn btn-primary" onclick="loadPage('vendors')">View All ${MOCK_VENDORS.length} Vendors →</button>
            </div>
        </div>
        
        <div class="features">
            <div class="container">
                <h2>Everything You Need</h2>
                <div class="features-grid">
                    <div class="feature">
                        <div class="feature-icon">🔍</div>
                        <h3>Find Vendors</h3>
                        <p>Browse ${MOCK_VENDORS.length}+ top-rated photographers, venues, and more.</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">📋</div>
                        <h3>Manage Tasks</h3>
                        <p>Keep track of your to-do list and never miss a deadline.</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">💰</div>
                        <h3>Track Budget</h3>
                        <p>Stay on budget with our easy-to-use expense tracker.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadAboutPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="container" style="padding:3rem 0;">
            <h1 style="text-align:center; margin-bottom:2rem; font-size:2.5rem;">About Bliss</h1>
            <div style="max-width:800px; margin:0 auto;">
                <div style="background:white; padding:2.5rem; border-radius:1rem; box-shadow:0 1px 3px rgba(0,0,0,0.1); margin-bottom:2rem;">
                    <h2 style="color:#db2777; margin-bottom:1rem;">Our Story</h2>
                    <p style="color:#64748b; line-height:1.8; margin-bottom:1rem;">
                        Bliss was founded with a simple mission: to make wedding planning stress-free and enjoyable. 
                        We understand that planning your special day can be overwhelming, which is why we've created 
                        a platform that brings everything you need into one beautiful, easy-to-use space.
                    </p>
                    <p style="color:#64748b; line-height:1.8;">
                        From finding the perfect vendors to managing your budget and tracking every detail, 
                        Bliss is your trusted partner in creating the wedding of your dreams.
                    </p>
                </div>

                <div style="background:white; padding:2.5rem; border-radius:1rem; box-shadow:0 1px 3px rgba(0,0,0,0.1); margin-bottom:2rem;">
                    <h2 style="color:#db2777; margin-bottom:1rem;">What We Offer</h2>
                    <ul style="color:#64748b; line-height:2; list-style:none; padding:0;">
                        <li>✓ Curated vendor directory with verified professionals</li>
                        <li>✓ Smart budget tracking and expense management</li>
                        <li>✓ Personalized wishlist to save your favorites</li>
                        <li>✓ Real-time notifications and updates</li>
                        <li>✓ Secure booking and payment processing</li>
                        <li>✓ Expert support every step of the way</li>
                    </ul>
                </div>

                <div style="background:white; padding:2.5rem; border-radius:1rem; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                    <h2 style="color:#db2777; margin-bottom:1rem;">Our Values</h2>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.5rem;">
                        <div>
                            <h3 style="font-size:1.125rem; margin-bottom:0.5rem;">💎 Quality</h3>
                            <p style="color:#64748b; font-size:0.875rem;">We work only with the best vendors who share our commitment to excellence.</p>
                        </div>
                        <div>
                            <h3 style="font-size:1.125rem; margin-bottom:0.5rem;">🤝 Trust</h3>
                            <p style="color:#64748b; font-size:0.875rem;">Your wedding is precious. We ensure every vendor and service is verified and reliable.</p>
                        </div>
                        <div>
                            <h3 style="font-size:1.125rem; margin-bottom:0.5rem;">💡 Innovation</h3>
                            <p style="color:#64748b; font-size:0.875rem;">We constantly improve our platform to give you the best planning experience.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadContactPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="container" style="padding:3rem 0;">
            <h1 style="text-align:center; margin-bottom:2rem; font-size:2.5rem;">Contact Us</h1>
            <div style="max-width:800px; margin:0 auto;">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem; margin-bottom:2rem;">
                    <div style="background:white; padding:2rem; border-radius:1rem; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                        <h3 style="color:#db2777; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
                            📧 Email Us
                        </h3>
                        <p style="color:#64748b;">hello@bliss.com</p>
                        <p style="color:#64748b;">support@bliss.com</p>
                    </div>
                    <div style="background:white; padding:2rem; border-radius:1rem; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                        <h3 style="color:#db2777; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
                            📞 Call Us
                        </h3>
                        <p style="color:#64748b;">+1 (555) 123-4567</p>
                        <p style="color:#94a3b8; font-size:0.875rem;">Mon-Fri: 9AM - 6PM EST</p>
                    </div>
                </div>

                <div style="background:white; padding:2.5rem; border-radius:1rem; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                    <h2 style="color:#db2777; margin-bottom:1.5rem;">Send Us a Message</h2>
                    <form id="contactForm" onsubmit="handleContactSubmit(event)">
                        <div class="input-group">
                            <label>Your Name *</label>
                            <input type="text" class="input" required>
                        </div>
                        <div class="input-group">
                            <label>Email Address *</label>
                            <input type="email" class="input" required>
                        </div>
                        <div class="input-group">
                            <label>Subject *</label>
                            <input type="text" class="input" required>
                        </div>
                        <div class="input-group">
                            <label>Message *</label>
                            <textarea class="input" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">Send Message</button>
                    </form>
                </div>

                <div style="background:#f8fafc; padding:2rem; border-radius:1rem; margin-top:2rem; text-align:center;">
                    <h3 style="margin-bottom:1rem;">Follow Us</h3>
                    <div style="display:flex; justify-content:center; gap:1.5rem;">
                        <a href="#" style="color:#db2777; text-decoration:none; font-size:1.125rem;">📷 Instagram</a>
                        <a href="#" style="color:#db2777; text-decoration:none; font-size:1.125rem;">👍 Facebook</a>
                        <a href="#" style="color:#db2777; text-decoration:none; font-size:1.125rem;">🐦 Twitter</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function handleContactSubmit(e) {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    e.target.reset();
}

function loadVendorsPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="container vendors">
            <div class="vendors-header">
                <h1>Find Vendors</h1>
            </div>
            <div class="filter-panel">
                <div class="filter-grid">
                    <div class="filter-group">
                        <label>Category</label>
                        <select id="categoryFilter" class="input">
                            <option value="">All Categories</option>
                            <option value="Photographer">Photographers</option>
                            <option value="Venue">Venues</option>
                            <option value="Decorator">Decorators</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Location</label>
                        <input type="text" id="locationFilter" class="input" placeholder="Enter location">
                    </div>
                    <div class="filter-group">
                        <label>Min Price</label>
                        <input type="number" id="minPriceFilter" class="input" placeholder="$0">
                    </div>
                    <div class="filter-group">
                        <label>Max Price</label>
                        <input type="number" id="maxPriceFilter" class="input" placeholder="$10000">
                    </div>
                    <div class="filter-group">
                        <label>Min Rating</label>
                        <select id="ratingFilter" class="input">
                            <option value="">Any Rating</option>
                            <option value="4.5">4.5+ Stars</option>
                            <option value="4.0">4.0+ Stars</option>
                            <option value="3.5">3.5+ Stars</option>
                        </select>
                    </div>
                    <div class="filter-group" style="display:flex; align-items:flex-end;">
                        <button class="btn btn-primary" onclick="loadVendors()">Apply Filters</button>
                    </div>
                </div>
            </div>
            <div class="vendors-grid" id="vendorsGrid"></div>
        </div>
    `;
    loadVendors();
}

async function loadVendors() {
    const category = document.getElementById('categoryFilter')?.value || '';
    const location = document.getElementById('locationFilter')?.value || '';
    const minPrice = document.getElementById('minPriceFilter')?.value || '';
    const maxPrice = document.getElementById('maxPriceFilter')?.value || '';
    const minRating = document.getElementById('ratingFilter')?.value || '';

    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (location) params.append('location', location);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (minRating) params.append('minRating', minRating);

    const url = `${API_URL}/api/vendors?${params.toString()}`;

    let vendors = [];
    let usingMockData = false;

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(5000) // 5 second timeout
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        vendors = await res.json();
        console.log('✅ Loaded vendors from backend:', vendors.length);
    } catch (error) {
        console.warn('⚠️ Backend offline or error, using mock data:', error.message);
        usingMockData = true;

        // Apply filters to mock data
        vendors = MOCK_VENDORS.filter(vendor => {
            if (category && vendor.category !== category) return false;
            if (location && !vendor.location?.toLowerCase().includes(location.toLowerCase())) return false;
            if (minPrice && vendor.price < parseInt(minPrice)) return false;
            if (maxPrice && vendor.price > parseInt(maxPrice)) return false;
            if (minRating && vendor.rating < parseFloat(minRating)) return false;
            return true;
        });

        console.log('📊 Filtered mock vendors:', vendors.length);
    }

    const grid = document.getElementById('vendorsGrid');

    if (!grid) {
        console.error('❌ Vendors grid element not found!');
        return;
    }

    if (vendors.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:3rem;">
                <h3 style="color:#64748b; margin-bottom:1rem;">No vendors found</h3>
                <p style="color:#94a3b8;">Try adjusting your filters or <a href="#" onclick="loadPage('vendors'); return false;" style="color:#3b82f6;">view all vendors</a></p>
            </div>
        `;
        return;
    }

    grid.innerHTML = vendors.map(vendor => {
        const isInWishlist = userWishlist.some(w => w.vendorId === vendor.id);
        return `
            <div class="card vendor-card-clickable" style="position:relative;">
                ${currentUser && currentUser.role === 'couple' ? `
                    <div class="wishlist-badge ${isInWishlist ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist('${vendor.id}')" style="z-index:2; cursor:pointer;">
                        ${isInWishlist ? '❤️' : '🤍'}
                    </div>
                ` : ''}
                <a href="?vendorId=${vendor.id}" target="_blank" style="text-decoration:none; color:inherit; display:block;">
                    <img src="${vendor.image}" alt="${vendor.name}">
                    <div class="card-content">
                        <div class="card-header">
                            <div>
                                <h3>${vendor.name}</h3>
                                <p class="category">${vendor.category}</p>
                                ${vendor.location ? `<p style="font-size:0.75rem; color:#64748b;">📍 ${vendor.location}</p>` : ''}
                            </div>
                            <span class="price">$${vendor.price}</span>
                        </div>
                        <p>${vendor.description}</p>
                        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem;">
                            <span style="color:#fbbf24;">⭐</span>
                            <span style="font-weight:600;">${vendor.rating || 0}</span>
                        </div>
                    </div>
                </div>
                <div class="card-content" style="padding-top:0;">
                    <button class="btn btn-primary btn-full" onclick="event.stopPropagation(); bookVendor('${vendor.id}')">Book Now</button>
                </div>
            </div>
        `;
    }).join('');

    // Add demo mode banner if using mock data
    if (usingMockData) {
        const existingBanner = document.getElementById('demoBanner');
        if (existingBanner) {
            existingBanner.remove();
        }

        const banner = document.createElement('div');
        banner.id = 'demoBanner';
        banner.style.cssText = 'background:#fef3c7; color:#92400e; padding:0.75rem; text-align:center; font-size:0.875rem; border-bottom:1px solid #fcd34d; position:sticky; top:0; z-index:999;';
        banner.innerHTML = '⚠️ <b>Demo Mode:</b> Backend is offline. Showing sample data. <button onclick="this.parentElement.remove()" style="margin-left:1rem; background:#92400e; color:#fef3c7; border:none; padding:0.25rem 0.75rem; border-radius:4px; cursor:pointer;">Dismiss</button>';
        document.body.prepend(banner);
    } else {
        // Remove demo banner if backend is working
        const existingBanner = document.getElementById('demoBanner');
        if (existingBanner) {
            existingBanner.remove();
        }
    }
}

// Load Vendor Details Page
async function loadVendorDetails(vendorId) {
    console.log('🔍 Loading vendor details for ID:', vendorId);

    if (!vendorId) {
        console.error('❌ No vendor ID provided');
        alert('Invalid vendor ID');
        loadPage('vendors');
        return;
    }

    let vendor = null;
    let reviews = [];
    let usingMockData = false;

    try {
        // Try to fetch from backend with timeout
        const vendorRes = await fetch(`${API_URL}/api/vendors/${vendorId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(5000)
        });

        if (!vendorRes.ok) {
            throw new Error(`HTTP error! status: ${vendorRes.status}`);
        }

        vendor = await vendorRes.json();
        console.log('✅ Loaded vendor from backend:', vendor.name);

        // Try to fetch reviews
        try {
            const reviewsRes = await fetch(`${API_URL}/api/reviews?vendorId=${vendorId}`, {
                signal: AbortSignal.timeout(3000)
            });
            if (reviewsRes.ok) {
                reviews = await reviewsRes.json();
                console.log('✅ Loaded reviews:', reviews.length);
            }
        } catch (e) {
            console.warn('⚠️ Could not load reviews:', e.message);
            reviews = [];
        }
    } catch (error) {
        console.warn('⚠️ Backend offline or error, using mock data:', error.message);
        usingMockData = true;

        // Find vendor in mock data
        vendor = MOCK_VENDORS.find(v => v.id === vendorId);

        if (!vendor) {
            console.error('❌ Vendor not found in mock data:', vendorId);
            const mainContent = document.getElementById('mainContent');
            mainContent.innerHTML = `
                <div class="container" style="text-align:center; padding:4rem 0;">
                    <h2 style="color:#64748b; margin-bottom:1rem;">Vendor Not Found</h2>
                    <p style="color:#94a3b8; margin-bottom:2rem;">The vendor you're looking for doesn't exist or has been removed.</p>
                    <button class="btn btn-primary" onclick="loadPage('vendors')">← Back to Vendors</button>
                </div>
            `;
            return;
        }

        console.log('📊 Using mock vendor:', vendor.name);
        reviews = []; // No reviews in mock data
    }

    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="container vendor-details">
            <button class="btn btn-ghost" onclick="loadPage('vendors')" style="margin-bottom:1rem;">
                ← Back to Vendors
            </button>

            <div class="vendor-details-grid">
                <div class="vendor-details-main">
                    <!-- Image Gallery -->
                    <div class="vendor-gallery">
                        <img src="${vendor.image}" alt="${vendor.name}" class="vendor-main-image" style="width:100%; height:400px; object-fit:cover; border-radius:12px; margin-bottom:1rem;">
                        ${vendor.gallery && vendor.gallery.length > 0 ? `
                            <div class="vendor-gallery-thumbs" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:0.5rem;">
                                ${vendor.gallery.slice(0, 4).map(img => `
                                    <img src="${img}" alt="Gallery image" class="gallery-thumb" style="width:100%; height:100px; object-fit:cover; border-radius:8px; cursor:pointer;">
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Vendor Info -->
                    <div class="vendor-info-section" style="margin-top:2rem;">
                        <div class="vendor-header" style="display:flex; justify-content:space-between; align-items:start; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
                            <div>
                                <h1 style="font-size:2.5rem; margin-bottom:0.5rem;">${vendor.name}</h1>
                                <p class="vendor-category" style="color:#3b82f6; font-size:1.1rem; margin-bottom:0.5rem;">${vendor.category}</p>
                                ${vendor.location ? `<p class="vendor-location" style="color:#64748b;">📍 ${vendor.location}</p>` : ''}
                            </div>
                            <div class="vendor-price-badge" style="text-align:right;">
                                <span class="vendor-price" style="font-size:2rem; font-weight:700; color:#3b82f6; display:block;">$${vendor.price}</span>
                                <span class="vendor-price-label" style="color:#64748b; font-size:0.875rem;">Starting Price</span>
                            </div>
                        </div>

                        <div class="vendor-rating" style="display:flex; align-items:center; gap:0.5rem; margin-bottom:2rem; padding:1rem; background:#f8fafc; border-radius:8px;">
                            <span class="rating-stars" style="font-size:1.5rem;">
                                ${'⭐'.repeat(Math.floor(vendor.rating || 0))}${'☆'.repeat(5 - Math.floor(vendor.rating || 0))}
                            </span>
                            <span class="rating-text" style="font-weight:600; font-size:1.1rem;">${vendor.rating || 0}</span>
                            <span style="color:#64748b;">(${reviews.length} reviews)</span>
                        </div>

                        <div class="vendor-description" style="margin-bottom:2rem;">
                            <h3 style="font-size:1.5rem; margin-bottom:1rem;">About ${vendor.name}</h3>
                            <p style="line-height:1.8; color:#475569;">${vendor.description}</p>
                        </div>

                        ${vendor.services && vendor.services.length > 0 ? `
                            <div class="vendor-services" style="margin-bottom:2rem;">
                                <h3 style="font-size:1.5rem; margin-bottom:1rem;">Services Offered</h3>
                                <ul class="services-list" style="list-style:none; padding:0; display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem;">
                                    ${vendor.services.map(service => `
                                        <li style="padding:0.75rem; background:#f0f9ff; border-left:3px solid #3b82f6; border-radius:4px;">
                                            <span style="color:#3b82f6; margin-right:0.5rem;">✓</span>${service}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        ` : ''}

                        ${vendor.availability && vendor.availability.length > 0 ? `
                            <div class="vendor-availability" style="margin-bottom:2rem;">
                                <h3 style="font-size:1.5rem; margin-bottom:1rem;">Available Dates</h3>
                                <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
                                    ${vendor.availability.slice(0, 5).map(date => `
                                        <span style="padding:0.5rem 1rem; background:#dcfce7; color:#166534; border-radius:20px; font-size:0.875rem;">
                                            📅 ${new Date(date).toLocaleDateString()}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="vendor-sidebar">
                    <div class="vendor-booking-card" style="position:sticky; top:1rem;">
                        <div class="card" style="padding:1.5rem;">
                            <h3 style="margin-bottom:1rem;">Book This Vendor</h3>
                            <div class="booking-card-price" style="margin-bottom:1.5rem; padding:1rem; background:#f0f9ff; border-radius:8px; text-align:center;">
                                <span style="font-size:2rem; font-weight:700; color:#3b82f6; display:block;">$${vendor.price}</span>
                                <span class="price-subtext" style="color:#64748b; font-size:0.875rem;">per event</span>
                            </div>
                                    ${userWishlist.some(w => w.vendorId === vendor.id) ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
                                </button>
                            ` : ''
}
                        </div >

    <div class="card" style="padding:1.5rem; margin-top:1rem;">
        <h3 style="margin-bottom:1rem;">Contact Information</h3>
        <p style="margin-bottom:0.5rem;"><strong>Email:</strong> contact@${vendor.name.toLowerCase().replace(/\s+/g, '')}.com</p>
        <p style="margin-bottom:0.5rem;"><strong>Phone:</strong> +1 (555) 123-4567</p>
        ${vendor.verified ? '<p class="verified-badge" style="color:#16a34a; margin-top:1rem;">✓ Verified Vendor</p>' : ''}
    </div>
                    </div >
                </div >
            </div >

            < !--Reviews Section-- >
    <div class="vendor-reviews-section" style="margin-top:3rem;">
        <h2 style="font-size:2rem; margin-bottom:1.5rem;">Customer Reviews</h2>
        ${reviews.length > 0 ? `
                    <div class="reviews-list" style="display:grid; gap:1rem;">
                        ${reviews.map(review => `
                            <div class="review-card card" style="padding:1.5rem;">
                                <div class="review-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                                    <strong style="font-size:1.1rem;">${review.userName || 'Anonymous'}</strong>
                                    <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
                                </div>
                                <p class="review-text" style="color:#475569; line-height:1.6; margin-bottom:0.5rem;">${review.comment}</p>
                                <p class="review-date" style="color:#94a3b8; font-size:0.875rem;">${new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="no-reviews" style="text-align:center; padding:3rem; background:#f8fafc; border-radius:12px;">
                        <p style="color:#64748b; font-size:1.1rem;">No reviews yet. Be the first to review!</p>
                    </div>
                `}
    </div>
        </div >
    `;

    // Add demo mode banner if using mock data
    if (usingMockData) {
        const existingBanner = document.getElementById('demoBanner');
        if (existingBanner) {
            existingBanner.remove();
        }

        const banner = document.createElement('div');
        banner.id = 'demoBanner';
        banner.style.cssText = 'background:#fef3c7; color:#92400e; padding:0.75rem; text-align:center; font-size:0.875rem; border-bottom:1px solid #fcd34d; position:sticky; top:0; z-index:999;';
        banner.innerHTML = '⚠️ <b>Demo Mode:</b> Backend is offline. Showing sample data. <button onclick="this.parentElement.remove()" style="margin-left:1rem; background:#92400e; color:#fef3c7; border:none; padding:0.25rem 0.75rem; border-radius:4px; cursor:pointer;">Dismiss</button>';
        document.body.prepend(banner);
    } else {
        // Remove demo banner if backend is working
        const existingBanner = document.getElementById('demoBanner');
        if (existingBanner) {
            existingBanner.remove();
        }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


async function toggleWishlist(vendorId) {
    if (!currentUser) {
        alert('Please login to add to wishlist');
        return;
    }

    const existingItem = userWishlist.find(w => w.vendorId === vendorId);

    try {
        if (existingItem) {
            await fetch(`${ API_URL } /api/wishlist / ${ existingItem.id } `, { method: 'DELETE' });
            userWishlist = userWishlist.filter(w => w.id !== existingItem.id);
        } else {
            const res = await fetch(`${ API_URL } /api/wishlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id, vendorId })
            });
            const newItem = await res.json();
            userWishlist.push(newItem);
        }
        loadVendors(); // Reload to update heart icons
    } catch (error) {
        console.warn('⚠️ Backend offline, using mock wishlist update:', error);
        // Mock Wishlist Update
        if (existingItem) {
            userWishlist = userWishlist.filter(w => w.id !== existingItem.id);
        } else {
            const vendor = MOCK_VENDORS.find(v => v.id === vendorId);
            if (vendor) {
                userWishlist.push({ id: `w${Date.now()}`, vendorId, vendor });
            }
        }
        loadVendors();
        alert('✅ (Demo Mode) Wishlist updated!');
    }
}

async function loadWishlist() {
    if (!currentUser) return;
    try {
        const res = await fetch(`${ API_URL } /api/wishlist / user / ${ currentUser.id } `);
        userWishlist = await res.json();
    } catch (error) {
        console.warn('⚠️ Backend offline, using mock wishlist:', error);
        // Mock Wishlist Fallback
        userWishlist = [
            { id: 'w1', vendorId: 'v1', vendor: MOCK_VENDORS[0] },
            { id: 'w2', vendorId: 'v2', vendor: MOCK_VENDORS[1] }
        ];
    }
}

function loadWishlistPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
    < div class="container" style = "padding:2rem 0;" >
            <h1 style="font-size:2.25rem; margin-bottom:2rem;">My Wishlist</h1>
            <div class="wishlist-grid" id="wishlistGrid"></div>
        </div >
    `;
    displayWishlist();
}

async function displayWishlist() {
    const grid = document.getElementById('wishlistGrid');

    if (userWishlist.length === 0) {
        grid.innerHTML = '<p style="color:#64748b;">No vendors in your wishlist yet.</p>';
        return;
    }

    grid.innerHTML = userWishlist.map(item => {
        const vendor = item.vendor;
        if (!vendor) return '';
        return `
    < div class="card" >
        <img src="${vendor.image}" alt="${vendor.name}">
            <div class="card-content">
                <div class="card-header">
                    <div>
                        <h3>${vendor.name}</h3>
                        <p class="category">${vendor.category}</p>
                    </div>
                    <span class="price">$${vendor.price}</span>
                </div>
                <p>${vendor.description}</p>
                <div style="display:flex; gap:0.5rem;">
                    <button class="btn btn-primary" style="flex:1;" onclick="bookVendor('${vendor.id}')">Book Now</button>
                    <button class="btn btn-ghost" onclick="toggleWishlist('${vendor.id}')">Remove</button>
                </div>
            </div>
        </div>
`;
    }).join('');
}

function loadBudgetPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
    < div class="container" style = "padding:2rem 0;" >
            <div class="budget-header">
                <h1>Budget Tracker</h1>
                <button class="btn btn-primary" onclick="showAddExpenseModal()">Add Expense</button>
            </div>
            <div class="budget-summary" id="budgetSummary"></div>
            <div class="expense-list">
                <h2 style="margin-bottom:1rem;">Expenses</h2>
                <div id="expensesList"></div>
            </div>
        </div >
    `;
    loadBudget();
}

async function loadBudget() {
    if (!currentUser) return;

    try {
        const res = await fetch(`${ API_URL } /api/budget / user / ${ currentUser.id } `);
        const expenses = await res.json();

        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalBudget = 10000; // Default budget
        const remaining = totalBudget - totalSpent;
        const percentage = (totalSpent / totalBudget) * 100;

        const summaryDiv = document.getElementById('budgetSummary');
        summaryDiv.innerHTML = `
    < div class="budget-card" >
                <h3>Total Budget</h3>
                <div class="amount">$${totalBudget.toLocaleString()}</div>
            </div >
            <div class="budget-card">
                <h3>Spent</h3>
                <div class="amount" style="color:#db2777;">$${totalSpent.toLocaleString()}</div>
                <div class="budget-progress">
                    <div class="budget-progress-bar" style="width:${percentage}%"></div>
                </div>
            </div>
            <div class="budget-card">
                <h3>Remaining</h3>
                <div class="amount" style="color:#059669;">$${remaining.toLocaleString()}</div>
            </div>
`;

        const expensesList = document.getElementById('expensesList');
        if (expenses.length === 0) {
            expensesList.innerHTML = '<p style="color:#64748b;">No expenses yet.</p>';
        } else {
            expensesList.innerHTML = expenses.map(exp => `
    < div class="expense-item" >
                    <div>
                        <p style="font-weight:600;">${exp.category || 'Expense'}</p>
                        <p style="font-size:0.875rem; color:#64748b;">${exp.description || ''}</p>
                    </div>
                    <div class="expense-actions">
                        <span style="font-weight:600; margin-right:1rem;">$${exp.amount}</span>
                        <button class="btn-icon" onclick="deleteExpense('${exp.id}')">🗑️</button>
    const description = prompt('Description (optional):');

    addExpense({ category, amount: parseFloat(amount), description });
}

async function addExpense(data) {
    try {
        await fetch(`${ API_URL } /api/budget`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, userId: currentUser.id })
        });
        loadBudget();
    } catch (error) {
        alert('Error adding expense');
    }
}

async function deleteExpense(id) {
    if (!confirm('Delete this expense?')) return;

    try {
        await fetch(`${ API_URL } /api/budget / ${ id } `, { method: 'DELETE' });
        loadBudget();
    } catch (error) {
        alert('Error deleting expense');
    }
}

async function bookVendor(vendorId) {
    if (!currentUser) {
        alert('Please login to book');
        return;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
        const res = await fetch(`${ API_URL } /api/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id,
                vendorId,
                date: tomorrow.toISOString().split('T')[0],
                time: '14:00'
            })
        });

        if (res.ok) {
            alert('Booking request sent!');
        }
    } catch (error) {
        alert('Error creating booking');
    }
}

function loadDashboardPage() {
    const mainContent = document.getElementById('mainContent');

    if (currentUser.role === 'vendor') {
        mainContent.innerHTML = `
    < div class="container dashboard" >
                <div class="dashboard-header">
                    <h1>Vendor Dashboard</h1>
                    <div class="dashboard-tabs">
                        <button class="admin-tab active" onclick="switchVendorTab('bookings')">Bookings</button>
                        <button class="admin-tab" onclick="switchVendorTab('profile')">My Profile</button>
                        <button class="admin-tab" onclick="switchVendorTab('enquiries')">Enquiries</button>
                        <button class="admin-tab" onclick="switchVendorTab('calendar')">Calendar</button>
                        <button class="admin-tab" onclick="switchVendorTab('analytics')">Analytics</button>
                    </div>
                </div>
                <div id="vendorTabContent"></div>
            </div >
    `;
        loadVendorBookings();
    } else {
        mainContent.innerHTML = `
    < div class="container dashboard" >
                <h1>My Wedding Plan</h1>
                <div class="dashboard-grid">
                    <div class="card" style="padding: 1.5rem;">
                        <h2 style="margin-bottom: 1rem;">My Bookings</h2>
                        <div id="bookingsList"></div>
                    </div>
                    <div class="card" style="padding: 1.5rem;">
                        <h2 style="margin-bottom: 1rem;">Quick Stats</h2>
                        <div id="statsContent"></div>
                    </div>
                </div>
            </div >
    `;
        loadDashboard();
    }
}

function switchVendorTab(tab) {
    // Update active tab styling
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    const content = document.getElementById('vendorTabContent');

    switch (tab) {
        case 'bookings':
            content.innerHTML = `
    < div class="dashboard-grid" >
                    <div class="card" style="padding: 1.5rem;">
                        <h2 style="margin-bottom: 1rem;">Incoming Bookings</h2>
                        <div id="bookingsList"></div>
                    </div>
                    <div class="card" style="padding: 1.5rem;">
                        <h2 style="margin-bottom: 1rem;">Quick Stats</h2>
                        <div id="statsContent"></div>
                    </div>
                </div >
    `;
            loadVendorBookings();
            break;
        case 'profile':
            loadVendorProfile(content);
            break;
        case 'enquiries':
            loadVendorEnquiries(content);
            break;
        case 'calendar':
            loadVendorCalendar(content);
            break;
        case 'analytics':
            loadVendorAnalytics(content);
            break;
    }
}

async function loadVendorBookings() {
    // Re-use existing loadDashboard logic but scoped
    await loadDashboard();
}

async function loadDashboard() {
    if (!currentUser) return;

    const endpoint = currentUser.role === 'vendor'
        ? `/ api / bookings / vendor / ${ currentUser.id } `
        : `/ api / bookings / user / ${ currentUser.id } `;

    try {
        const res = await fetch(API_URL + endpoint);
        const bookings = await res.json();

        const bookingsList = document.getElementById('bookingsList');
        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p style="color: #64748b;">No bookings yet.</p>';
        } else {
            bookingsList.innerHTML = bookings.map(booking => `
    < div class="booking-item" >
        <div>
            <p style="font-weight: 600;">Date: ${booking.date}</p>
            <p style="font-size: 0.875rem; color: #64748b;">Status: <span style="text-transform: capitalize;" class="status-badge status-${booking.status}">${booking.status}</span></p>
        </div>
                    ${
    currentUser.role === 'vendor' && booking.status === 'pending' ? `
                        <div class="booking-actions">
                            <button class="btn-accept" onclick="updateBookingStatus('${booking.id}', 'confirmed')">Accept</button>
                            <button class="btn-reject" onclick="updateBookingStatus('${booking.id}', 'rejected')">Reject</button>
                        </div>
                    ` : ''
}
                    ${
    currentUser.role === 'couple' && booking.status === 'confirmed' ? `
                        <button class="btn btn-primary" style="padding:0.25rem 0.75rem; font-size:0.75rem;" onclick="showPaymentModal('${booking.id}')">Pay Now</button>
                    ` : ''
}
                </div >
    `).join('');
        }

        const statsContent = document.getElementById('statsContent');
        statsContent.innerHTML = `
    < div class="stats-item" >
                <span>Total Bookings</span>
                <span>${bookings.length}</span>
            </div >
    ${
        currentUser.role === 'couple' ? `
                <div class="stats-item">
                    <span>Wishlist Items</span>
                    <span>${userWishlist.length}</span>
                </div>
            ` : `
                <div class="stats-item">
                    <span>Revenue</span>
                    <span>$${bookings.filter(b => b.status === 'paid').length * 500}</span>
                </div>
                <div style="margin-top:1rem;">
                    <canvas id="vendorChart"></canvas>
                </div>
            `}
`;

        if (currentUser.role === 'vendor') {
            renderVendorChart(bookings);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function updateBookingStatus(bookingId, status) {
    try {
        await fetch(`${ API_URL } /api/bookings / ${ bookingId } `, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        loadDashboard();
    } catch (error) {
        alert('Error updating booking');
    }
}

// Payment Functions
let currentBookingId = null;

function showPaymentModal(bookingId, amount) {
    currentBookingId = bookingId;
    document.getElementById('paymentModal').style.display = 'block';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
    currentBookingId = null;
}

document.getElementById('paymentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentBookingId) return;

    // Simulate payment processing
    const btn = e.target.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Processing...';
    btn.disabled = true;

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
        await updateBookingStatus(currentBookingId, 'paid');
        alert('Payment successful! Booking confirmed.');
        closePaymentModal();
        loadDashboard();
    } catch (error) {
        alert('Payment failed');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
});

// Analytics Chart
function renderVendorChart(bookings) {
    const ctx = document.getElementById('vendorChart');
    if (!ctx) return;

    // Group bookings by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = new Array(12).fill(0);

    bookings.forEach(b => {
        const date = new Date(b.date);
        data[date.getMonth()]++;
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Monthly Bookings',
                data: data,
                backgroundColor: '#db2777',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
        }
    });
}

function loadAdminPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
    < div class="container" style = "padding:2rem 0;" >
            <h1 style="margin-bottom:2rem;">Admin Panel</h1>
            <div class="admin-tabs">
                <button class="admin-tab active" onclick="switchAdminTab('users', this)">Users</button>
                <button class="admin-tab" onclick="switchAdminTab('vendors', this)">Vendors</button>
                <button class="admin-tab" onclick="switchAdminTab('bookings', this)">Bookings</button>
                <button class="admin-tab" onclick="switchAdminTab('analytics', this)">Analytics</button>
            </div>
            <div id="adminContent"></div>
        </div >
    `;
    switchAdminTab('users');
}

async function switchAdminTab(tab, button) {
    // Update active tab
    document.querySelectorAll('.admin-tab').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');

    const content = document.getElementById('adminContent');

    try {
        switch (tab) {
            case 'users':
                const usersRes = await fetch(`${ API_URL } /api/admin / users`);
                const users = await usersRes.json();
                content.innerHTML = `
    < div class="admin-table" >
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                                    <tr>
                                        <td>${user.name}</td>
                                        <td>${user.email}</td>
                                        <td><span class="status-badge status-${user.role}">${user.role}</span></td>
                                        <td>-</td>
                                    </tr>
                                `).join('')}
            </tbody>
        </table>
                    </div >
    `;
                break;

            case 'vendors':
                const vendorsRes = await fetch(`${ API_URL } /api/vendors`);
                const vendors = await vendorsRes.json();
                content.innerHTML = `
    < div style = "margin-bottom:2rem;" >
        <button class="btn btn-primary" onclick="showAddVendorModal()">+ Add New Vendor</button>
                    </div >
    <div class="admin-table">
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Visible</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${vendors.map(vendor => `
                                    <tr>
                                        <td>${vendor.name}</td>
                                        <td>${vendor.category}</td>
                                        <td>$${vendor.price}</td>
                                        <td>${vendor.location || '-'}</td>
                                        <td><span class="status-badge ${vendor.verified ? 'status-verified' : 'status-pending'}">${vendor.verified ? 'Verified' : 'Pending'}</span></td>
                                        <td>
                                            <button class="btn ${vendor.visible ? 'btn-primary' : 'btn-ghost'}" 
                                                    style="padding:0.25rem 0.75rem; font-size:0.75rem;"
                                                    onclick="toggleVendorVisibility('${vendor.id}', ${vendor.visible})">
                                                ${vendor.visible ? '👁️ Visible' : '👁️‍🗨️ Hidden'}
                                            </button>
                                        </td>
                                        <td>
                                            <button class="btn btn-ghost" style="padding:0.25rem 0.75rem; font-size:0.75rem; margin-right:0.5rem;" onclick='editVendor(${JSON.stringify(vendor).replace(/'/g, "&apos;")})'>✏️ Edit</button>
                                            <button class="btn btn-ghost" style="padding:0.25rem 0.75rem; font-size:0.75rem; color:#dc2626;" onclick="deleteVendor('${vendor.id}', '${vendor.name}')">🗑️ Delete</button>
                                        </td>
                                    </tr>
                                `).join('')}
            </tbody>
        </table>
    </div>
`;
                break;

            case 'bookings':
                const bookingsRes = await fetch(`${ API_URL } /api/admin / bookings`);
                const bookings = await bookingsRes.json();
                content.innerHTML = `
    < div class="admin-table" >
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Created</th>
                </tr>
            </thead>
            <tbody>
                ${bookings.map(booking => `
                                    <tr>
                                        <td>${booking.date}</td>
                                        <td>${booking.time}</td>
                                        <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
                                        <td>${new Date(booking.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                `).join('')}
            </tbody>
        </table>
                    </div >
    `;
                break;

            case 'analytics':
                const analyticsRes = await fetch(`${ API_URL } /api/admin / analytics`);
                const analytics = await analyticsRes.json();
                content.innerHTML = `
    < div class="budget-summary" >
                        <div class="budget-card">
                            <h3>Total Users</h3>
                            <div class="amount">${analytics.totalUsers}</div>
                        </div>
                        <div class="budget-card">
                            <h3>Total Vendors</h3>
                            <div class="amount">${analytics.totalVendors}</div>
                        </div>
                        <div class="budget-card">
                            <h3>Total Bookings</h3>
                            <div class="amount">${analytics.totalBookings}</div>
                        </div>
                        <div class="budget-card">
                            <h3>Pending Vendors</h3>
                            <div class="amount">${analytics.pendingVendors}</div>
                        </div>
                    </div >
    `;
                break;
        }
    } catch (error) {
        content.innerHTML = '<p style="color:#dc2626;">Error loading data</p>';
    }
}

async function approveVendor(vendorId) {
    try {
        await fetch(`${ API_URL } /api/admin / vendors / ${ vendorId }/approve`, {
method: 'PATCH'
        });
switchAdminTab('vendors');
    } catch (error) {
    alert('Error approving vendor');
}
}

function showNotification(title, message) {
    // Simple browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body: message });
    }
}

async function updateNotificationBadge() {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API_URL}/api/notifications/user/${currentUser.id}`);
        const notifications = await res.json();
        const unread = notifications.filter(n => !n.read).length;

        const badge = document.getElementById('notificationBadge');
        if (unread > 0) {
            badge.style.display = 'flex';
            badge.textContent = unread;
        } else {
            badge.style.display = 'none';
        }
    } catch (error) {
        console.error('Error updating notifications:', error);
    }
}

// Vendor CRUD Functions
function showAddVendorModal() {
    const modalHTML = `
        <div class="modal" id="vendorFormModal" style="display:block;">
            <div class="modal-content" style="max-width:600px;">
                <span class="close" onclick="closeVendorModal()">&times;</span>
                <h2>Add New Vendor</h2>
                <form id="vendorForm" onsubmit="saveVendor(event)">
                    <div class="input-group">
                        <label>Vendor Name *</label>
                        <input type="text" id="vendorName" class="input" required>
                    </div>
                    <div class="input-group">
                        <label>Category *</label>
                        <select id="vendorCategory" class="input" required>
                            <option value="">Select Category</option>
                            <option value="Photography">Photography</option>
                            <option value="Catering">Catering</option>
                            <option value="Venue">Venue</option>
                            <option value="Flowers">Flowers</option>
                            <option value="Music">Music</option>
                            <option value="Decoration">Decoration</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Description *</label>
                        <textarea id="vendorDescription" class="input" rows="3" required></textarea>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                        <div class="input-group">
                            <label>Starting Price ($) *</label>
                            <input type="number" id="vendorPrice" class="input" min="0" step="0.01" required>
                        </div>
                        <div class="input-group">
                            <label>Location</label>
                            <input type="text" id="vendorLocation" class="input">
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Main Image URL *</label>
                        <input type="url" id="vendorImage" class="input" required>
                    </div>
                    <div class="input-group">
                        <label>Gallery Images (comma separated URLs)</label>
                        <textarea id="vendorGallery" class="input" rows="2" placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"></textarea>
                    </div>
                    <div class="input-group">
                        <label>Services (comma separated)</label>
                        <textarea id="vendorServices" class="input" rows="2" placeholder="Service 1, Service 2, Service 3"></textarea>
                    </div>
                    <div class="input-group">
                        <label>
                            <input type="checkbox" id="vendorVerified" style="width:auto; margin-right:0.5rem;">
                            Verified Vendor
                        </label>
                    </div>
                    <input type="hidden" id="vendorId">
                    <button type="submit" class="btn btn-primary btn-full">Save Vendor</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function editVendor(vendor) {
    showAddVendorModal();
    document.getElementById('vendorFormModal').querySelector('h2').textContent = 'Edit Vendor';
    document.getElementById('vendorId').value = vendor.id;
    document.getElementById('vendorName').value = vendor.name;
    document.getElementById('vendorCategory').value = vendor.category;
    document.getElementById('vendorDescription').value = vendor.description;
    document.getElementById('vendorPrice').value = vendor.price;
    document.getElementById('vendorLocation').value = vendor.location || '';
    document.getElementById('vendorImage').value = vendor.image;
    document.getElementById('vendorGallery').value = vendor.gallery ? vendor.gallery.join(', ') : '';
    document.getElementById('vendorServices').value = vendor.services ? vendor.services.join(', ') : '';
    document.getElementById('vendorVerified').checked = vendor.verified || false;
}

async function saveVendor(event) {
    event.preventDefault();

    const vendorId = document.getElementById('vendorId').value;
    const galleryText = document.getElementById('vendorGallery').value.trim();
    const servicesText = document.getElementById('vendorServices').value.trim();

    const vendorData = {
        name: document.getElementById('vendorName').value,
        category: document.getElementById('vendorCategory').value,
        description: document.getElementById('vendorDescription').value,
        price: parseFloat(document.getElementById('vendorPrice').value),
        location: document.getElementById('vendorLocation').value,
        image: document.getElementById('vendorImage').value,
        gallery: galleryText ? galleryText.split(',').map(url => url.trim()) : [],
        services: servicesText ? servicesText.split(',').map(s => s.trim()) : [],
        verified: document.getElementById('vendorVerified').checked
    };

    try {
        const url = vendorId ? `${API_URL}/api/vendors/${vendorId}` : `${API_URL}/api/vendors`;
        const method = vendorId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vendorData)
        });

        if (res.ok) {
            alert(vendorId ? 'Vendor updated successfully!' : 'Vendor added successfully!');
            closeVendorModal();
            try {
                const res = await fetch(`${API_URL}/api/vendors/user/${currentUser.id}`);
                if (!res.ok) {
                    container.innerHTML = '<p>Vendor profile not found. Please contact admin.</p>';
                    return;
                }
                const vendor = await res.json();

                container.innerHTML = `
            <div class="card" style="padding: 2rem; max-width: 800px;">
                <h2>Edit Profile</h2>
                <form id="vendorProfileForm" onsubmit="updateVendorProfile(event, '${vendor.id}')">
                    <div class="input-group">
                        <label>Business Name</label>
                        <input type="text" class="input" name="name" value="${vendor.name}" required>
                    </div>
                    <div class="input-group">
                        <label>Description</label>
                        <textarea class="input" name="description" rows="4" required>${vendor.description}</textarea>
                    </div>
                    <div class="input-group">
                        <label>Price ($)</label>
                        <input type="number" class="input" name="price" value="${vendor.price}" required>
                    </div>
                    <div class="input-group">
                        <label>Location</label>
                        <input type="text" class="input" name="location" value="${vendor.location}" required>
                    </div>
                    <div class="input-group">
                        <label>Image URL</label>
                        <input type="url" class="input" name="image" value="${vendor.image}" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </form>
            </div>
        `;
            } catch (error) {
                console.error('Error loading profile:', error);
                container.innerHTML = '<p>Error loading profile.</p>';
            }
        }

        async function updateVendorProfile(e, vendorId) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch(`${API_URL}/api/vendors/${vendorId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    alert('Profile updated successfully!');
                } else {
                    alert('Error updating profile');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Error updating profile');
            }
        }

        // Vendor Enquiries
        async function loadVendorEnquiries(container) {
            try {
                // First get vendor ID from user ID
                const vRes = await fetch(`${API_URL}/api/vendors/user/${currentUser.id}`);
                if (!vRes.ok) {
                    container.innerHTML = '<p>Vendor profile not found.</p>';
                    return;
                }
                const vendor = await vRes.json();

                const res = await fetch(`${API_URL}/api/enquiries/vendor/${vendor.id}`);
                const enquiries = await res.json();

                if (enquiries.length === 0) {
                    container.innerHTML = '<div class="card" style="padding: 2rem;"><p>No enquiries yet.</p></div>';
                    return;
                }

                container.innerHTML = `
            <div class="card" style="padding: 1.5rem;">
                <h2>Received Enquiries</h2>
                <div class="admin-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>From</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${enquiries.map(e => `
                                <tr>
                                    <td>${e.date}</td>
                                    <td>
                                        <div>${e.userName}</div>
                                        <div style="font-size:0.8rem; color:#64748b;">${e.userEmail}</div>
                                    </td>
                                    <td>${e.message}</td>
                                    <td><span class="status-badge status-${e.status}">${e.status}</span></td>
                                    <td>
                                        ${e.status === 'pending' ? `
                                            <button class="btn btn-primary" style="padding:0.25rem 0.5rem; font-size:0.8rem;" onclick="updateEnquiryStatus('${e.id}', 'replied')">Mark Replied</button>
                                        ` : ''}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
            } catch (error) {
                console.error('Error loading enquiries:', error);
                container.innerHTML = '<p>Error loading enquiries.</p>';
            }
        }

        async function updateEnquiryStatus(id, status) {
            try {
                await fetch(`${API_URL}/api/enquiries/${id}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status })
                });
                // Reload current tab
                const content = document.getElementById('vendorTabContent');
                loadVendorEnquiries(content);
            } catch (error) {
                alert('Error updating status');
            }
        }

        async function deleteVendor(vendorId, vendorName) {
            if (!confirm(`Are you sure you want to delete "${vendorName}"? This action cannot be undone.`)) {
                return;
            }

            try {
                const res = await fetch(`${API_URL}/api/vendors/${vendorId}`, {
                    method: 'DELETE'
                });

                if (res.ok) {
                    alert('Vendor deleted successfully!');
                    switchAdminTab('vendors');
                } else {
                    alert('Error deleting vendor');
                }
            } catch (error) {
                console.error('Error deleting vendor:', error);
                alert('Error deleting vendor');
            }
        }

        // Enquiry Functions
        let currentEnquiryVendorId = null;

        function openEnquiryModal(vendorId, vendorName) {
            if (!currentUser) {
                alert('Please login to send an enquiry');
                return;
            }
            currentEnquiryVendorId = vendorId;

            // Create modal if not exists
            if (!document.getElementById('enquiryModal')) {
                const modal = document.createElement('div');
                modal.id = 'enquiryModal';
                modal.className = 'modal';
                modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeEnquiryModal()">&times;</span>
                <h2>Send Enquiry to <span id="enquiryVendorName"></span></h2>
                <form id="enquiryForm" onsubmit="submitEnquiry(event)">
                    <div class="input-group">
                        <label>Event Date</label>
                        <input type="date" class="input" name="date" required>
                    </div>
                    <div class="input-group">
                        <label>Estimated Guests</label>
                        <input type="number" class="input" name="guests" required>
                    </div>
                    <div class="input-group">
                        <label>Message</label>
                        <textarea class="input" name="message" rows="4" placeholder="Tell us about your event..." required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Send Enquiry</button>
                </form>
            </div>
        `;
                document.body.appendChild(modal);
            }

            document.getElementById('enquiryVendorName').textContent = vendorName;
            document.getElementById('enquiryModal').style.display = 'block';
        }

        function closeEnquiryModal() {
            const modal = document.getElementById('enquiryModal');
            if (modal) modal.style.display = 'none';
            currentEnquiryVendorId = null;
        }

        async function submitEnquiry(e) {
            e.preventDefault();
            if (!currentEnquiryVendorId) return;

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch(`${API_URL}/api/enquiries`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...data,
                        vendorId: currentEnquiryVendorId,
                        userId: currentUser.id
                    })
                });

                if (res.ok) {
                    alert('Enquiry sent successfully!');
                    closeEnquiryModal();
                    e.target.reset();
                } else {
                    alert('Error sending enquiry');
                }
            } catch (error) {
                console.warn('⚠️ Backend offline, using mock success for demo:', error);
                // Mock success for demo mode
                alert('✅ (Demo Mode) Enquiry sent successfully!');
                closeEnquiryModal();
                e.target.reset();
            }
        }

        async function toggleVendorVisibility(vendorId, currentState) {
            try {
                const res = await fetch(`${API_URL}/api/vendors/${vendorId}/visibility`, {
                    method: 'PATCH'
                });

                if (res.ok) {
                    switchAdminTab('vendors');
                } else {
                    alert('Error toggling visibility');
                }
            } catch (error) {
                alert('Error toggling visibility. Make sure the backend is running.');
            }
        }

        function closeVendorModal() {
            const modal = document.getElementById('vendorFormModal');
            if (modal) {
                modal.remove();
            }
        }
        // ... existing code ...

        // --- Chat System ---
        let currentChatRecipient = null;
        let chatTypingTimeout = null;

        function openChat(recipientId, recipientName) {
            if (!currentUser) {
                alert('Please login to chat');
                return;
            }
            currentChatRecipient = recipientId;
            document.getElementById('chatRecipientName').textContent = recipientName;
            document.getElementById('chatModal').style.display = 'flex';
            loadChatHistory(recipientId);

            // Join my own room
            socket.emit('join-room', currentUser.id);
        }

        function closeChat() {
            document.getElementById('chatModal').style.display = 'none';
            currentChatRecipient = null;
        }

        async function loadChatHistory(otherId) {
            try {
                const res = await fetch(`${API_URL}/api/messages/${currentUser.id}/${otherId}`);
                const messages = await res.json();
                const container = document.getElementById('chatMessages');
                container.innerHTML = messages.map(msg => `
            <div class="message ${msg.senderId === currentUser.id ? 'sent' : 'received'}">
                <div class="message-text">${msg.text}</div>
                <div class="message-time">${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `).join('');
                container.scrollTop = container.scrollHeight;
            } catch (error) {
                console.error('Error loading chat:', error);
            }
        }

        function handleChatInput(e) {
            if (e.key === 'Enter') sendMessage();

            // Typing indicator
            socket.emit('typing', { senderId: currentUser.id, receiverId: currentChatRecipient });
            clearTimeout(chatTypingTimeout);
            chatTypingTimeout = setTimeout(() => {
                socket.emit('stop-typing', { senderId: currentUser.id, receiverId: currentChatRecipient });
            }, 1000);
        }

        function sendMessage() {
            const input = document.getElementById('chatInput');
            const text = input.value.trim();
            if (!text || !currentChatRecipient) return;

            const message = {
                senderId: currentUser.id,
                senderName: currentUser.name,
                receiverId: currentChatRecipient,
                text: text
            };

            socket.emit('send-message', message);
            input.value = '';
        }

        // Socket listeners for chat
        if (socket) {
            socket.on('receive-message', (msg) => {
                if (currentChatRecipient && (msg.senderId === currentChatRecipient || msg.senderId === currentUser.id)) {
                    const container = document.getElementById('chatMessages');
                    container.innerHTML += `
                <div class="message ${msg.senderId === currentUser.id ? 'sent' : 'received'}">
                    <div class="message-text">${msg.text}</div>
                    <div class="message-time">${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            `;
                    container.scrollTop = container.scrollHeight;
                } else if (msg.senderId !== currentUser.id) {
                    showNotification('New Message', `Message from ${msg.senderName || 'User'}`);
                }
            });

            socket.on('user-typing', ({ senderId }) => {
                if (currentChatRecipient === senderId) {
                    document.getElementById('typingIndicator').style.display = 'inline';
                }
            });

            socket.on('user-stop-typing', ({ senderId }) => {
                if (currentChatRecipient === senderId) {
                    document.getElementById('typingIndicator').style.display = 'none';
                }
            });
        }

        // --- Vendor Calendar ---
        async function loadVendorCalendar(container) {
            container.innerHTML = `
        <div class="calendar-container">
            <div class="calendar-header">
                <h3>Availability Calendar</h3>
                <p>Click dates to block/unblock availability</p>
            </div>
            <div class="calendar-grid" id="calendarGrid"></div>
        </div>
    `;
            renderCalendar();
        }

        function renderCalendar() {
            const grid = document.getElementById('calendarGrid');
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();

            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

            let html = '';
            for (let i = 1; i <= daysInMonth; i++) {
                const date = new Date(currentYear, currentMonth, i).toISOString().split('T')[0];
                // In a real app, we'd fetch blocked dates from the vendor object
                // For demo, we'll use local state or mock
                const isBlocked = false;

                html += `
            <div class="calendar-day ${isBlocked ? 'blocked' : ''}" onclick="toggleDateAvailability('${date}', this)">
                <span class="day-number">${i}</span>
                <span class="day-status">${isBlocked ? 'Blocked' : 'Available'}</span>
            </div>
        `;
            }
            grid.innerHTML = html;
        }

        function toggleDateAvailability(date, element) {
            element.classList.toggle('blocked');
            const isBlocked = element.classList.contains('blocked');
            element.querySelector('.day-status').textContent = isBlocked ? 'Blocked' : 'Available';
            // Here we would send API request to update vendor blockedDates
        }

        // --- Vendor Analytics ---
        async function loadVendorAnalytics(container) {
            // Mock data calculation
            const enquiries = 12; // Fetch from API in real app
            const bookings = 5;
            const revenue = 7500;

            container.innerHTML = `
        <div class="analytics-dashboard">
            <h3>Performance Overview</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">📨</div>
                    <div class="stat-value">${enquiries}</div>
                    <div class="stat-label">Total Enquiries</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📅</div>
                    <div class="stat-value">${bookings}</div>
                    <div class="stat-label">Confirmed Bookings</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-value">$${revenue}</div>
                    <div class="stat-label">Total Revenue</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-value">4.8</div>
                    <div class="stat-label">Average Rating</div>
                </div>
            </div>
        </div>
    `;
        }

// Update Dashboard Tabs to include Calendar and Analytics

