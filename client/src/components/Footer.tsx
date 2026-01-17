import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 pt-20 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-20">
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center space-x-2 group w-fit">
                            <span className="font-serif text-3xl font-black text-primary-600 tracking-tighter">Bliss</span>
                            <div className="h-2 w-2 rounded-full bg-primary-600"></div>
                        </Link>
                        <p className="text-slate-500 font-light leading-relaxed max-w-xs">
                            Curating the world's most exceptional wedding experiences since 2026. Excellence is our only standard.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Navigation</h4>
                        <ul className="space-y-4">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/vendors', label: 'Artisans' },
                                { to: '/about', label: 'Our Story' },
                                { to: '/contact', label: 'Support' }
                            ].map(link => (
                                <li key={link.label}>
                                    <Link to={link.to} className="text-slate-600 hover:text-primary-600 transition-colors font-medium text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Collective</h4>
                        <ul className="space-y-4">
                            {['Partner Program', 'Safety Standards', 'Press Kit', 'Careers'].map(item => (
                                <li key={item}>
                                    <a href="#" className="text-slate-600 hover:text-primary-600 transition-colors font-medium text-sm">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Contact</h4>
                        <p className="text-slate-900 font-bold text-sm mb-2">Concierge Support</p>
                        <p className="text-slate-500 font-light text-sm mb-6">hello@bliss-collective.com</p>
                        <div className="flex space-x-6">
                            {['IG', 'FB', 'TW'].map(social => (
                                <a key={social} href="#" className="text-[10px] font-black text-slate-400 hover:text-primary-600 transition-colors tracking-widest">{social}</a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">
                        © 2026 Bliss Collective. All rights reserved.
                    </p>

                    <div className="flex items-center space-x-8 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                        <a href="#" className="hover:text-primary-600 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary-600 transition-colors">Terms</a>
                        <a href="#" className="hover:text-primary-600 transition-colors">Safety</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
