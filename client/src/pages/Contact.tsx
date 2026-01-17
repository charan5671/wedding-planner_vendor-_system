import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function Contact() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Banner */}
            <section className="relative h-[50vh] flex items-center justify-center pt-20">
                <img
                    src="/images/contact_hero.png"
                    alt="Contact Bliss"
                    className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.8] saturate-[0.8]"
                />
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-4 tracking-tight animate-fade-in-up">Let's Connect</h1>
                    <p className="text-base sm:text-lg md:text-xl font-light text-slate-100 max-w-xl mx-auto leading-relaxed px-4">
                        Your dream celebration starts with a conversation. We're here to listen, advise, and inspire.
                    </p>
                </div>
            </section>

            <section className="py-20 sm:py-24 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Reach Out to Us</h2>
                            <p className="text-slate-500 leading-relaxed text-lg">
                                Whether you're a couple looking for your dream team or a vendor wanting to join our elite circle, our team is ready to assist you.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-primary-600 text-white flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Email Address</h3>
                                <p className="text-lg font-bold text-slate-900">hello@bliss.com</p>
                                <p className="text-xs text-slate-500 mt-1 italic">Expect response within 24h</p>
                            </div>

                            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-primary-600 text-white flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Phone Number</h3>
                                <p className="text-lg font-bold text-slate-900">+91 8688693885</p>
                                <p className="text-xs text-slate-500 mt-1 italic">Mon-Fri, 9am - 6pm IST</p>
                            </div>
                        </div>

                        <div className="p-8 rounded-2xl border border-slate-100 flex items-start space-x-6">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Our Headquarters</h3>
                                <p className="text-slate-500 leading-relaxed font-light">
                                    Suite 405, Celebration Tower<br />
                                    Business Enclave, Mumbai 400001
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100">
                        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8">Send Us a Message</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">First Name</label>
                                    <Input placeholder="E.g. Jane" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Last Name</label>
                                    <Input placeholder="E.g. Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                                <Input type="email" placeholder="jane@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Message</label>
                                <textarea
                                    className="w-full rounded-xl border-slate-200 focus:border-primary-500 focus:ring-primary-500 bg-slate-50 min-h-[150px] p-4 text-slate-900 transition-all font-light"
                                    placeholder="Tell us about your celebration..."
                                ></textarea>
                            </div>
                            <Button className="w-full py-4 text-lg bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-100 group">
                                <span>Send Message</span>
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
