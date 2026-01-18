import Link from 'next/link';

export default function Hero({ firstCourse }: { firstCourse?: any }) {

  return (
    <div className="w-full h-screen relative">
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
           style={{ backgroundImage: "url('/images/hero-banner.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

      <div className="relative h-full flex flex-col justify-center items-center px-12 md:px-20 text-center">
        <div className="inline-block px-4 py-2 rounded-full gradient-fun text-white font-semibold text-xs tracking-wide w-fit mb-6 shadow-lg">
          🚀 Start Your Learning Journey Today
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          <span className="text-white drop-shadow-lg">
            Master Coding
          </span>
          <br />
          <span className="text-yellow-300 drop-shadow-lg">
            Build Your Future
          </span>
        </h1>
        <p className="text-lg text-white/90 mb-8 max-w-2xl leading-relaxed drop-shadow-md">
          Learn to code with interactive courses, hands-on projects, and expert guidance. 
          Start building real-world applications today with our professional curriculum.
        </p>

        <div className="flex gap-4">
          {firstCourse ? (
            <Link href={`/courses/${firstCourse.slug}`} className="primary-button text-base flex items-center gap-2">
              <span>Get Started</span>
              <span>→</span>
            </Link>
          ) : (
            <button className="primary-button text-base flex items-center gap-2" disabled>
              <span>Get Started</span>
              <span>→</span>
            </button>
          )}
          <button className="secondary-button text-base flex items-center gap-2">
            <span>Learn More</span>
          </button>
        </div>
      </div>
    </div>
  );
}
