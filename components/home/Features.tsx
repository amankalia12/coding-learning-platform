import { Brain, Target, Rocket, Award, Lock, Globe } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Learning",
      description: "Get personalized guidance and instant feedback from our AI mentor",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Real-World Projects",
      description: "Build actual applications that you can showcase in your portfolio",
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Career Acceleration",
      description: "Fast-track your journey from beginner to professional developer",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Certification Program",
      description: "Earn recognized certificates that validate your skills",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Premium Content",
      description: "Access exclusive advanced courses and expert tutorials",
      gradient: "from-indigo-500 to-blue-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Community",
      description: "Connect with learners worldwide and collaborate on projects",
      gradient: "from-yellow-500 to-orange-600"
    }
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to <span className="text-primary">Succeed</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive tools and resources designed to accelerate your coding journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="professional-card p-8 group hover:scale-105 transition-all duration-300">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
