export interface Vendor {
    id: string;
    business_name: string;
    category: string;
    description: string;
    location: string;
    price_range: string;
    rating: number;
    images: string[];
}

export const MOCK_VENDORS: Vendor[] = [
    {
        id: 'mock-1',
        business_name: 'Elegant Moments Photography',
        category: 'Photographer',
        description: 'Capturing life\'s most precious moments with a fine art approach. Based in NYC but available worldwide.',
        location: 'New York, NY',
        price_range: '$$$',
        rating: 4.9,
        images: ['https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-2',
        business_name: 'The Grand Ballroom',
        category: 'Venue',
        description: 'A historic venue featuring crystal chandeliers, high ceilings, and a capacity for up to 300 guests.',
        location: 'Chicago, IL',
        price_range: '$$$$',
        rating: 4.8,
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-3',
        business_name: 'Floral Dreams',
        category: 'Decorator',
        description: 'Turning your floral fantasies into reality with sustainable and locally sourced blooms.',
        location: 'San Francisco, CA',
        price_range: '$$',
        rating: 4.7,
        images: ['https://images.unsplash.com/photo-1522673607200-1645062cd958?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-4',
        business_name: 'Gourmet Catering Co.',
        category: 'Caterer',
        description: 'Exquisite culinary experiences tailored to your palate. Specializing in farm-to-table menus.',
        location: 'Austin, TX',
        price_range: '$$$',
        rating: 4.9,
        images: ['https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-5',
        business_name: 'Sound & Soul DJ',
        category: 'Entertainment',
        description: 'Keeping the dance floor packed all night long with a mix of classics and modern hits.',
        location: 'Miami, FL',
        price_range: '$$',
        rating: 4.6,
        images: ['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-6',
        business_name: 'Prestige Limo',
        category: 'Transportation',
        description: 'Arrive in style with our fleet of vintage and luxury vehicles.',
        location: 'Los Angeles, CA',
        price_range: '$$',
        rating: 4.8,
        images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-7',
        business_name: 'Urban Loft Studios',
        category: 'Venue',
        description: 'Contemporary industrial space perfect for modern weddings. Exposed brick and skyline views.',
        location: 'Brooklyn, NY',
        price_range: '$$$',
        rating: 4.5,
        images: ['https://images.unsplash.com/photo-1519225468359-29f3ad45294c?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-8',
        business_name: 'Golden Hour Films',
        category: 'Videographer',
        description: 'Cinematic wedding films that tell your unique love story.',
        location: 'Los Angeles, CA',
        price_range: '$$$',
        rating: 4.9,
        images: ['https://images.unsplash.com/photo-1588534510807-865dc13c2f94?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-9',
        business_name: 'Sweet Delights Bakery',
        category: 'Cake Designer',
        description: 'Custom designed wedding cakes that look as good as they taste.',
        location: 'London, UK',
        price_range: '$$',
        rating: 4.7,
        images: ['https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-10',
        business_name: 'Paper & Ink',
        category: 'Stationery',
        description: 'Bespoke letterpress invitations and stationery to set the tone for your big day.',
        location: 'Portland, OR',
        price_range: '$$',
        rating: 4.8,
        images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-11',
        business_name: 'Glamour Squad',
        category: 'Hair & Makeup',
        description: 'On-site luxury beauty services for the bride and bridal party.',
        location: 'Atlanta, GA',
        price_range: '$$',
        rating: 4.6,
        images: ['https://images.unsplash.com/photo-1487412947132-2d9fab992016?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-12',
        business_name: 'Planning Perfection',
        category: 'Wedding Planner',
        description: 'Full-service wedding planning and design for the discerning couple.',
        location: 'Charleston, SC',
        price_range: '$$$$',
        rating: 5.0,
        images: ['https://images.unsplash.com/photo-1511285560982-1351c4f809b9?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-13',
        business_name: 'Vintage Vows Rentals',
        category: 'Rentals',
        description: 'Curated collection of vintage furniture and decor to add character to your event.',
        location: 'Nashville, TN',
        price_range: '$$',
        rating: 4.7,
        images: ['https://images.unsplash.com/photo-1505322894129-eb99433604bc?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-14',
        business_name: 'Seaside Ceremonies',
        category: 'Venue',
        description: 'Breathtaking oceanfront venue for intimate ceremonies and receptions.',
        location: 'Malibu, CA',
        price_range: '$$$$',
        rating: 4.9,
        images: ['https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-15',
        business_name: 'Acoustic Soul',
        category: 'Entertainment',
        description: 'Live acoustic guitar and vocals for ceremony and cocktail hour.',
        location: 'Denver, CO',
        price_range: '$$',
        rating: 4.8,
        images: ['https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-16',
        business_name: 'Royal Rides',
        category: 'Transportation',
        description: 'Classic Rolls Royce rentals for the ultimate getaway car.',
        location: 'Boston, MA',
        price_range: '$$$',
        rating: 4.7,
        images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-17',
        business_name: 'Bloom & Wild',
        category: 'Decorator',
        description: 'Wild and whimsical floral arrangements for the bohemian bride.',
        location: 'Seattle, WA',
        price_range: '$$',
        rating: 4.6,
        images: ['https://images.unsplash.com/photo-1478146704077-36e3fc9637cb?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-18',
        business_name: 'Fusion Flavors',
        category: 'Caterer',
        description: 'Innovative fusion cuisine combining global flavors for a unique dining experience.',
        location: 'Toronto, ON',
        price_range: '$$$',
        rating: 4.8,
        images: ['https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-19',
        business_name: 'Focus & Frame',
        category: 'Photographer',
        description: 'Documentary style wedding photography capturing real moments.',
        location: 'San Diego, CA',
        price_range: '$$',
        rating: 4.7,
        images: ['https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800']
    },
    {
        id: 'mock-20',
        business_name: 'Starlight Tents',
        category: 'Rentals',
        description: 'Luxury sailcloth tents and lighting for outdoor weddings.',
        location: 'Hamptons, NY',
        price_range: '$$$$',
        rating: 4.9,
        images: ['https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800']
    }
];

export const MOCK_BOOKINGS = [
    {
        id: 'b-1',
        user_id: 'user-1',
        vendor_id: 'mock-1',
        date: '2026-06-12',
        status: 'confirmed',
        total_amount: 1500,
        vendor: { business_name: 'Elegant Moments Photography' }
    },
    {
        id: 'b-2',
        user_id: 'user-1',
        vendor_id: 'mock-2',
        date: '2026-07-20',
        status: 'pending',
        total_amount: 5000,
        vendor: { business_name: 'The Grand Ballroom' }
    },
    {
        id: 'b-3',
        user_id: 'user-1',
        vendor_id: 'mock-4',
        date: '2026-05-15',
        status: 'confirmed',
        total_amount: 3200,
        vendor: { business_name: 'Gourmet Catering Co.' }
    }
];
