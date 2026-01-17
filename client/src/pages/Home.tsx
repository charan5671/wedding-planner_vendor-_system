import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { MOCK_VENDORS } from '../lib/mockData';

export function Home() {
    return (
        <div className="bg-white">
            {/* Elegant Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2000&q=90"
                        alt="Wedding Elegance"
                        className="w-full h-full object-cover brightness-[0.6] scale-105 animate-slow-zoom"
                    />
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl">
                    <span className="inline-block text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] sm:tracking-[0.5em] mb-6 animate-fade-in">Established in Excellence</span>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-white mb-2 tracking-tighter leading-tight sm:leading-[1.1] animate-fade-in-up">
                        Your Vision.<br />
                        <span className="italic font-extralight text-primary-200">Our Masterpiece.</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed animate-fade-in-delayed">
                        Experience the gold standard in wedding curation. Connecting the world's most discerning couples with elite artisans.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-delayed">
                        <Link to="/vendors">
                            <Button className="h-14 sm:h-16 px-10 sm:px-12 bg-white text-slate-900 rounded-full font-bold text-base sm:text-lg hover:scale-105 hover:bg-primary-50 transition-all shadow-2xl">
                                Discover Vendors
                            </Button>
                        </Link>
                        <Link to="/about" className="text-white font-bold border-b-2 border-white/30 hover:border-white transition-all py-2 text-base sm:text-lg">
                            The Bliss Story
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-40 hidden sm:block">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* The Bliss Experience - Micro Services */}
            <section className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-12 sm:mb-16 gap-8 text-center lg:text-left">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4 sm:mb-6 italic leading-tight">Uncompromising Detail.</h2>
                            <p className="text-sm sm:text-base text-slate-500 font-light leading-relaxed">
                                We believe planning should be as beautiful as the day itself. Our platform provides a bespoke suite of tools designed for the perfectionist.
                            </p>
                        </div>
                        <div className="pb-4 hidden lg:block">
                            <div className="h-1 w-24 bg-primary-600"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-16">
                        {[
                            {
                                title: 'Elite Curation',
                                desc: 'Only the top 5% of vendors meet our stringent quality and reliability benchmarks.',
                                icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z'
                            },
                            {
                                title: 'Direct Negotiation',
                                desc: 'Our secure messaging portal allows for real-time contract optimization and transparency.',
                                icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                            },
                            {
                                title: 'Financial Precision',
                                desc: 'Sophisticated spend tracking ensures every dollar is an investment in your vision.',
                                icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-xl transition-all duration-700">
                                <div className="w-14 h-14 sm:w-16 h-16 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 sm:mb-8 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 rotate-3 group-hover:rotate-0">
                                    <svg className="w-6 h-6 sm:w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Artisans Section */}
            <section className="py-12 sm:py-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">The Artisans</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] sm:tracking-widest text-[10px] sm:text-[11px]">Now Trending in Excellence</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                        {MOCK_VENDORS.slice(1, 4).map((vendor) => (
                            <Link to={`/vendors/${vendor.id}`} key={vendor.id} className="group block">
                                <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-white shadow-lg group-hover:shadow-2xl transition-all duration-700">
                                    <div className="relative aspect-[3/2] overflow-hidden">
                                        <img
                                            src={vendor.images[0]}
                                            alt={vendor.business_name}
                                            className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                                        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white font-bold text-xs sm:text-sm">
                                            {vendor.rating} ★
                                        </div>

                                        <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 text-white">
                                            <p className="text-primary-300 font-bold uppercase tracking-widest text-[10px] mb-2">{vendor.category}</p>
                                            <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3 leading-tight">{vendor.business_name}</h3>
                                            <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                                <span className="text-white/60 font-light text-[10px] sm:text-xs">{vendor.location}</span>
                                                <span className="font-bold border-b border-primary-400 pb-1 text-[10px] sm:text-xs">View Profile</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-10 sm:mt-16">
                        <Link to="/vendors">
                            <Button className="h-12 sm:h-14 px-10 sm:px-12 bg-slate-900 text-white rounded-full font-bold hover:bg-primary-600 transition-all uppercase tracking-widest text-[10px]">
                                View Entire Portfolio
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Vendor CTA - Signature Section */}
            <section className="py-8 sm:py-12 relative bg-slate-900 text-white overflow-hidden px-4 sm:px-6">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600/10 skew-x-12 transform translate-x-32"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center lg:flex-row-reverse">
                        <div className="space-y-3 sm:space-y-4 text-center lg:text-right order-2 lg:order-2">
                            <h2 className="text-xl sm:text-2xl font-serif font-black leading-tight italic">Are you an <span className="text-primary-500">Icon?</span></h2>
                            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Join our network of internationally acclaimed wedding professionals. Bliss is the platform for those who define the industry.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                                <Link to="/login?role=vendor">
                                    <Button className="h-12 sm:h-14 px-8 sm:px-10 bg-white text-slate-900 rounded-full font-black text-sm sm:text-base hover:bg-primary-500 hover:text-white transition-all w-full sm:w-auto">
                                        Partner with Us
                                    </Button>
                                </Link>
                                <Link to="/about">
                                    <Button variant="outline" className="h-12 sm:h-14 px-8 sm:px-10 border-white/20 text-white rounded-full font-bold hover:bg-white/10 backdrop-blur-md w-full sm:w-auto text-sm sm:text-base">
                                        Our Standards
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative hidden lg:block order-1 lg:order-1">
                            <div className="aspect-square rounded-full border border-white/10 flex items-center justify-center p-20 animate-spin-slow">
                                <div className="w-full h-full rounded-full border border-primary-500/30"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-serif text-2xl font-bold italic tracking-tighter opacity-20">BLISS PLATINUM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
