'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Check, Zap, Award, Infinity, Sparkles } from 'lucide-react';

export default function PricingPage() {
  
  const handleCheckout = async () => {
    // We will create this API route in the next step
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const session = await response.json();
    
    // Redirect the user to Stripe's secure checkout page
    if (session.url) {
       window.location.href = session.url;
      //window.location.href = '/success';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-20">
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs tracking-wide mb-6">
            Choose Your Plan
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Unlock every course, earn verified certificates, and get unlimited access to all features.
          </p>
        </div>

        {/* PRICING CARD */}
        <div className="relative max-w-lg mx-auto">
          <div className="relative professional-card rounded-2xl p-10 shadow-2xl">
            <div className="flex justify-between items-start mb-8 pb-8 border-b border-border">
              <div>
                <h3 className="text-2xl font-bold mb-1 text-foreground">Pro Membership</h3>
                <p className="text-muted-foreground text-sm">Lifetime access</p>
              </div>
              <div className="text-right">
                <span className="text-5xl font-bold text-foreground">$99</span>
                <span className="text-muted-foreground text-sm block">one-time payment</span>
              </div>
            </div>

            {/* FEATURES LIST */}
            <ul className="space-y-5 mb-10">
              <FeatureItem icon={<Infinity size={20} />} text="All 25+ Current & Future Courses" />
              <FeatureItem icon={<Sparkles size={20} />} text="Unlimited AI Mentor Access" />
              <FeatureItem icon={<Award size={20} />} text="Verified Completion Certificates" />
              <FeatureItem icon={<Zap size={20} />} text="Ad-free Learning Experience" />
            </ul>

            <button 
              onClick={handleCheckout}
              className="primary-button w-full font-semibold py-4 mb-4"
            >
              Get Pro Access
            </button>
            
            <p className="text-center text-xs text-muted-foreground">
              Secure payment via Stripe • Cancel anytime
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <li className="flex items-center gap-4 text-foreground">
      <div className="text-primary flex-shrink-0">{icon}</div>
      <span className="text-base">{text}</span>
    </li>
  );
}