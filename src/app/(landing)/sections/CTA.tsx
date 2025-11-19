import { Rocket, CheckCircle, Mail, Phone } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export function CTA() {
  const { ref, isInView } = useInView();

  const benefits = [
    'AI-driven risk-managed trading',
    'Multiple income streams',
    'Clear, structured compensation',
    'Exclusive Billionaire Club access',
    'Luxury rewards program',
  ];

  return (
    <section ref={ref} className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950" />

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-amber-500/30 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div
          className={`text-center mb-12 transform transition-all duration-1000 ${
            isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6 backdrop-blur-sm">
            <Rocket className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Start Building Your Legacy</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
            Ready to Build Your Legacy?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Join the revolution. Trade Smarter. Earn Bigger.
          </p>
        </div>

        <div
          className={`p-8 md:p-12 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-blue-500/30 rounded-3xl backdrop-blur-lg shadow-2xl transform transition-all duration-1000 delay-200 ${
            isInView ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Why Choose Us?</h3>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-blue-500/50 transition-colors"
                    style={{
                      animation: isInView ? `fadeInLeft 0.5s ease-out ${i * 0.1}s both` : 'none',
                    }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gradient-to-r from-blue-950/40 to-amber-950/40 border border-blue-500/30 rounded-xl">
                <p className="text-center text-slate-300 mb-4">
                  <span className="font-bold text-white">Your First Step:</span> Enroll in the{' '}
                  <span className="text-amber-400 font-bold">$110 Welcoming Package</span>
                </p>
                <button className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-amber-600 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-200 shadow-2xl shadow-blue-500/50 hover:shadow-amber-500/50">
                  Get Started Now - $110
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <h4 className="text-2xl font-bold text-white mb-6 text-center">Contact Us</h4>

                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-slate-400">Email</span>
                    </div>
                    <p className="text-white font-semibold ml-8">info@metatraderinstitute.com</p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-slate-400">Phone</span>
                    </div>
                    <p className="text-white font-semibold ml-8">+1 (555) 123-4567</p>
                  </div>
                </div>

                <button className="w-full mt-6 px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200">
                  Schedule Onboarding Session
                </button>
              </div>

              <div className="p-6 bg-gradient-to-br from-amber-950/40 to-orange-950/40 border border-amber-500/30 rounded-2xl text-center">
                <p className="text-sm text-slate-400 mb-2">Join thousands of successful traders</p>
                <p className="text-3xl font-bold text-amber-400">Build Your Empire Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
