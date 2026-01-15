export default function Hero() {

  return (
    <div className="px-6 mt-8">
      <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-border shadow-xl group">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: "url('/images/hero-banner.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />

        <div className="relative h-full flex flex-col justify-center px-12 md:px-20 max-w-4xl">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs tracking-wide w-fit mb-6">
            Start Your Learning Journey Today
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="text-foreground">
              Master Coding
            </span>
            <br />
            <span className="text-primary">
              Build Your Future
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            Learn to code with interactive courses, hands-on projects, and expert guidance. 
            Start building real-world applications today with our professional curriculum.
          </p>

          <div className="flex gap-4">
            <button className="primary-button text-base flex items-center gap-2">
              <span>Get Started</span>
              <span>→</span>
            </button>
            <button className="secondary-button text-base flex items-center gap-2">
              <span>Learn More</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
