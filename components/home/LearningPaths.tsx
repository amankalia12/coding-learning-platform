import Link from 'next/link';
import { ArrowRight, Play, Lock } from 'lucide-react';

export default function LearningPaths() {
  const paths = [
    {
      title: "Frontend Development",
      description: "Master modern web development with React, TypeScript, and more",
      level: "Beginner to Advanced",
      duration: "3-6 months",
      courses: 12,
      color: "from-blue-500 to-purple-600",
      icon: "🎨"
    },
    {
      title: "Backend Engineering", 
      description: "Build robust server-side applications and APIs",
      level: "Intermediate to Advanced",
      duration: "4-8 months",
      courses: 15,
      color: "from-green-500 to-teal-600",
      icon: "⚙️"
    },
    {
      title: "Full-Stack Mastery",
      description: "Become a versatile developer capable of handling entire projects",
      level: "Advanced",
      duration: "6-12 months", 
      courses: 20,
      color: "from-orange-500 to-red-600",
      icon: "🚀",
      locked: true
    }
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your <span className="text-primary">Learning Path</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Structured learning journeys designed to take you from zero to hero
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {paths.map((path, index) => (
            <div key={index} className={`professional-card overflow-hidden group ${path.locked ? 'opacity-75' : ''}`}>
              {/* Header with gradient */}
              <div className={`h-32 bg-gradient-to-br ${path.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-5xl">{path.icon}</div>
                </div>
                {path.locked && (
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                    <Lock className="w-4 h-4 text-white" />
                    <span className="text-white text-xs font-medium">Premium</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{path.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{path.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Level:</span>
                    <span className="font-medium text-foreground">{path.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium text-foreground">{path.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Courses:</span>
                    <span className="font-medium text-foreground">{path.courses} courses</span>
                  </div>
                </div>

                {!path.locked ? (
                  <Link href={`/paths/${path.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <button className="w-full primary-button flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      Start Path
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                ) : (
                  <Link href="/pricing">
                    <button className="w-full secondary-button flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" />
                      Unlock Premium
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
