import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Frontend Developer at Google",
      content: "This platform transformed my career. The AI mentor helped me overcome obstacles I'd been stuck on for weeks. I landed my dream job in just 6 months!",
      rating: 5,
      avatar: "👩‍💻"
    },
    {
      name: "Marcus Rodriguez",
      role: "Full-Stack Engineer",
      content: "The hands-on projects are incredible. I went from knowing basic HTML to deploying complex applications. The community support is amazing too!",
      rating: 5,
      avatar: "👨‍💻"
    },
    {
      name: "Emily Johnson",
      role: "Data Scientist",
      content: "Best investment I've made in my career. The structured learning paths kept me focused, and the real-world projects built my confidence.",
      rating: 5,
      avatar: "👩‍🔬"
    }
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-accent/5 to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Success Stories from Our <span className="text-primary">Community</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of developers who've transformed their careers with our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="professional-card p-6 relative group hover:scale-105 transition-all duration-300">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
              
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed italic">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
