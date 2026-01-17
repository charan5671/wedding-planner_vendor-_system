
export function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80"
          alt="Wedding Planning"
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.7]"
        />
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold mb-6 tracking-tight animate-fade-in-up leading-tight">Crafting Unforgettable Moments</h1>
          <p className="text-base sm:text-lg md:text-xl font-light text-white/90 max-w-2xl mx-auto leading-relaxed">
            Where luxury meets detail. We don't just plan weddings; we engineer masterpieces of love and celebration.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 sm:py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight">Our Mission</h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed italic border-l-0 md:border-l-4 border-primary-500 pl-0 md:pl-6">
              "To simplify the art of celebration through innovation, connection, and an unwavering commitment to excellence."
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
              Founded on the belief that every couple deserves a stress-free path to the altar, Bliss has evolved into more than a platform—it's a sanctuary for creativity. We bridge the gap between imagination and reality by curating the finest vendors and providing intuitive tools for every step of the journey.
            </p>
          </div>
          <div className="relative mt-8 md:mt-0">
            <div className="aspect-square rounded-2xl bg-primary-100 overflow-hidden shadow-2xl skew-y-0 md:skew-y-3 hover:skew-y-0 transition-transform duration-700 max-w-md mx-auto md:max-w-none">
              <div className="w-full h-full bg-gradient-to-br from-primary-600/20 to-primary-900/40 absolute inset-0 z-10"></div>
              <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80" alt="Detail" className="w-full h-full object-cover grayscale-[20%]" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 sm:p-8 rounded-xl shadow-xl hidden lg:block">
              <p className="text-3xl sm:text-4xl font-serif font-bold text-primary-600">10k+</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium font-sans uppercase tracking-widest">Weddings Planned</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Bliss */}
      <section className="py-12 sm:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-4 italic">The Bliss Standard</h2>
            <div className="w-16 sm:w-20 h-1 bg-primary-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                title: 'Unparalleled Curation',
                desc: 'Every vendor on our platform undergoes a rigorous 50-point verification process to ensure absolute reliability.',
                icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
              },
              {
                title: 'Bespoke Technology',
                desc: 'Our real-time negotiation suites and budget management tools are custom-built for the modern couple.',
                icon: 'M13 10V3L4 14h7v7l9-11h-7z'
              },
              {
                title: 'Legacy of Excellence',
                desc: 'With over a decade of industry leadership, we understand the nuances that turn a good wedding into a legend.',
                icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12z'
              }
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-white border border-slate-100 hover:border-primary-100 hover:shadow-2xl hover:shadow-primary-100/30 transition-all duration-500">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-slate-900 py-16 sm:py-24 px-6 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-8 italic leading-tight">Ready to write your story?</h2>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
          <button className="px-10 py-3.5 sm:px-12 sm:py-4 bg-primary-600 text-white rounded-full font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-900/20 text-sm sm:text-base">Get Started</button>
          <button className="px-10 py-3.5 sm:px-12 sm:py-4 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-all border border-white/20 backdrop-blur-md text-sm sm:text-base">Our Services</button>
        </div>
      </section>
    </div>
  );
}
