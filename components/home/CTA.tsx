import Link from 'next/link';
import { Rocket, Target, Zap } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="gradient-fun rounded-3xl p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
          
          <div className="relative z-10">
            <div className="flex justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your <span className="text-yellow-300">Coding Journey</span>?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already building amazing things. 
              No experience needed - just bring your curiosity!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <button className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl">
                  Start Free Trial
                </button>
              </Link>
              <Link href="/pricing">
                <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary transition-all">
                  View Pricing
                </button>
              </Link>
            </div>
            
            <p className="text-white/70 text-sm mt-6">
              No credit card required • Cancel anytime • 14-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
