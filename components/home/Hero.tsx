export default function Hero() {

  // return (
  //     <section className="px-6 pt-4">
  //       <div className="relative w-full h-[280px] md:h-[320px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
  //         {/* Background Image - Replace with your pixel art map */}
  //         <div 
  //           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  //           style={{ backgroundImage: "url('/images/python-world-map.png')" }}
  //         />
  //         {/* Dark overlay to make text readable */}
  //         <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all" />

  //         {/* Content */}
  //         <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16 max-w-3xl">
  //           <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight drop-shadow-md">
  //             Start your coding journey with 200+ hours of interactive programming exercises paired with real-world projects. Explore for free! ✨
  //           </h1>
  //         </div>
  //       </div>
  //     </section>
  //   );
  return (
    <div className="px-6 mt-8">
      <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-border/50 shadow-2xl group">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: "url('/images/hero-banner.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />

        <div className="relative h-full flex flex-col justify-center px-12 md:px-20 max-w-4xl">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs tracking-wide w-fit mb-6">
            Start Your Journey Today
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="text-foreground">
              Master Coding
            </span>
            <br />
            <span className="text-gradient">
              Build Your Future
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Learn to code with interactive courses, hands-on projects, and expert guidance. 
            Start building real-world applications today.
          </p>

          <div className="flex gap-4">
            <button className="bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-semibold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
              <span>Get Started</span>
              <span>→</span>
            </button>
            <button className="bg-card text-foreground border border-border px-8 py-3.5 rounded-lg font-semibold text-base hover:bg-card/80 transition-all flex items-center gap-2">
              <span>Learn More</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
