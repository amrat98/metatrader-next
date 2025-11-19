import { GraduationCap, Bot, Crown, DollarSign } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export function WelcomingPackage() {
  const { ref, isInView } = useInView();

  const benefits = [
    {
      icon: GraduationCap,
      title: '7-Day Forex Masterclass',
      description: 'Deepen your trading expertise from the ground up',
      color: 'blue',
    },
    {
      icon: Bot,
      title: 'Exclusive AI Risk Management Bot',
      description: 'Our proprietary AI bot manages risk automatically via COPY/PAMM accounts',
      color: 'purple',
    },
    {
      icon: Crown,
      title: 'Billionaire Club Membership',
      description: 'Enter an exclusive circle with premium perks, networking, and insights',
      color: 'amber',
    },
    {
      icon: DollarSign,
      title: '$500 Funded Account',
      description: 'Start trading and earning from day one with real capital',
      color: 'green',
    },
  ];

  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/40 group-hover:border-blue-400',
    purple: 'from-violet-500/20 to-violet-600/20 border-violet-500/40 group-hover:border-violet-400',
    amber: 'from-amber-500/20 to-amber-600/20 border-amber-500/40 group-hover:border-amber-400',
    green: 'from-green-500/20 to-green-600/20 border-green-500/40 group-hover:border-green-400',
  };

  return (
    <section ref={ref} className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500/20 to-amber-500/20 border border-blue-500/30 rounded-full mb-6 backdrop-blur-sm">
            <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
              Only $110
            </span>
          </div>

          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
            Your All-Access Pass
          </h2>
          <p className="text-xl text-slate-400">To Financial Mastery</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div
                key={i}
                className={`group p-6 bg-gradient-to-br ${
                  colorClasses[benefit.color as keyof typeof colorClasses]
                } border rounded-2xl backdrop-blur-sm transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold mb-3 text-white">{benefit.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        <div
          className={`mt-12 text-center transform transition-all duration-1000 delay-600 ${
            isInView ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          <button className="px-12 py-4 bg-gradient-to-r from-blue-600 to-amber-600 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-200 shadow-2xl shadow-blue-500/50 hover:shadow-amber-500/50">
            Get Your Package Now - $110
          </button>
        </div>
      </div>
    </section>
  );
}
