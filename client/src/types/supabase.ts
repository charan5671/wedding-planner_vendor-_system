export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    role: 'admin' | 'vendor' | 'couple'
                    full_name: string | null
                    avatar_url: string | null
                    phone_number: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    role?: 'admin' | 'vendor' | 'couple'
                    full_name?: string | null
                    avatar_url?: string | null
                    phone_number?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    role?: 'admin' | 'vendor' | 'couple'
                    full_name?: string | null
                    avatar_url?: string | null
                    phone_number?: string | null
                    updated_at?: string
                }
            }
            vendors: {
                Row: {
                    id: string
                    user_id: string
                    business_name: string
                    category: string
                    description: string | null
                    location: string | null
                    price_range: string | null
                    rating: number
                    is_verified: boolean
                    images: string[]
                    cover_image: string | null
                    website_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    business_name: string
                    category: string
                    description?: string | null
                    location?: string | null
                    price_range?: string | null
                    rating?: number
                    is_verified?: boolean
                    images?: string[]
                    cover_image?: string | null
                    website_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    business_name?: string
                    category?: string
                    description?: string | null
                    location?: string | null
                    price_range?: string | null
                    rating?: number
                    is_verified?: boolean
                    images?: string[]
                    cover_image?: string | null
                    website_url?: string | null
                    updated_at?: string
                }
            }
            services: {
                Row: {
                    id: string
                    vendor_id: string
                    name: string
                    description: string | null
                    price: number
                    features: string[] | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    vendor_id: string
                    name: string
                    description?: string | null
                    price: number
                    features?: string[] | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    vendor_id?: string
                    name?: string
                    description?: string | null
                    price?: number
                    features?: string[] | null
                    created_at?: string
                }
            }
            bookings: {
                Row: {
                    id: string
                    user_id: string
                    vendor_id: string
                    service_id: string | null
                    date: string
                    status: 'pending' | 'negotiating' | 'confirmed' | 'rejected' | 'cancelled' | 'completed'
                    total_amount: number | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    vendor_id: string
                    service_id?: string | null
                    date: string
                    status?: 'pending' | 'negotiating' | 'confirmed' | 'rejected' | 'cancelled' | 'completed'
                    total_amount?: number | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    vendor_id?: string
                    service_id?: string | null
                    date?: string
                    status?: 'pending' | 'negotiating' | 'confirmed' | 'rejected' | 'cancelled' | 'completed'
                    total_amount?: number | null
                    notes?: string | null
                    updated_at?: string
                }
            }
            messages: {
                Row: {
                    id: string
                    booking_id: string
                    sender_id: string
                    content: string | null
                    type: 'text' | 'offer' | 'acceptance' | 'rejection' | 'system'
                    metadata: Json | null
                    read_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    booking_id: string
                    sender_id: string
                    content?: string | null
                    type?: 'text' | 'offer' | 'acceptance' | 'rejection' | 'system'
                    metadata?: Json | null
                    read_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    booking_id?: string
                    sender_id?: string
                    content?: string | null
                    metadata?: Json | null
                    read_at?: string | null
                }
            }
            reviews: {
                Row: {
                    id: string
                    booking_id: string
                    user_id: string
                    vendor_id: string
                    rating: number
                    comment: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    booking_id: string
                    user_id: string
                    vendor_id: string
                    rating: number
                    comment?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    booking_id?: string
                    user_id?: string
                    vendor_id?: string
                    rating?: number
                    comment?: string | null
                }
            }
        }
    }
}
