import { Users, Code, Trophy, Zap } from 'lucide-react';

export default function Stats() {
  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "50,000+",
      label: "Active Learners",
      description: "Join our growing community"
    },
    {
      icon: <Code className="w-6 h-6" />,
      value: "200+",
      label: "Coding Challenges", 
      description: "Test your skills"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      value: "1,000+",
      label: "Success Stories",
      description: "Career transformations"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      value: "24/7",
      label: "AI Mentor Support",
      description: "Always here to help"
    }
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Join the <span className="text-primary">Coding Revolution</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Be part of a vibrant learning community where developers grow together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="professional-card p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-primary mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
