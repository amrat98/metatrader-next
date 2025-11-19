import { Zap, Trophy, Rocket } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export function IncomePillars() {
  const { ref, isInView } = useInView();

  const pillars = [
    {
      icon: Zap,
      title: 'Direct & Team Commissions',
      description: 'Fast, cyclical earnings from your network',
      details: [
        '50% of every $110 membership',
        '$25 instant withdrawal',
        '$25 to upgrade wallet',
        'Automatic cycling system',
      ],
    },
    {
      icon: Trophy,
      title: 'Rank-Based Salary',
      description: 'Stable, monthly income for building a large team',
      details: [
        '250 referrals → $250/month',
        '1,000 referrals → $1,000/month',
        '5,000 referrals → $4,000/month',
        '10,000 referrals → $8,000/month',
      ],
    },
    {
      icon: Rocket,
      title: 'Billionaire Pool Club',
      description: 'Explosive, viral income with unlimited potential',
      details: [
        'Refer 4 people = $40 entry',
        '$20 withdrawal per cycle',
        '$20 upgrade per cycle',
        'Unlimited rebirth potential',
      ],
    },
  ];

  return (
    <section ref={ref} className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950" />

      <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
            3 Pathways to Prosperity
          </h2>
          <p className="text-xl text-slate-400">Your income, multiplied</p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/30 via-amber-500/30 to-blue-500/30 -translate-y-1/2" />

          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className={`relative transform transition-all duration-700 ${
                    isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${i * 200}ms` }}
                >
                  <div className="group h-full p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-500/30 rounded-2xl backdrop-blur-sm hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
                    <div className="flex justify-center mb-6">
                      <div className="relative w-20 h-20">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-amber-500 rounded-xl rotate-6 group-hover:rotate-12 transition-transform" />
                        <div className="relative w-full h-full bg-slate-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-10 h-10 text-amber-400" />
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
                        Pillar {i + 1}
                      </h3>
                      <h4 className="text-xl font-bold text-white mb-2">{pillar.title}</h4>
                      <p className="text-slate-400 text-sm">{pillar.description}</p>
                    </div>

                    <div className="space-y-3">
                      {pillar.details.map((detail, j) => (
                        <div
                          key={j}
                          className="flex items-start gap-2 p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-300 text-sm">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`mt-16 p-8 bg-gradient-to-r from-blue-950/40 to-amber-950/40 rounded-2xl border border-blue-500/30 backdrop-blur-sm text-center transform transition-all duration-1000 delay-600 ${
            isInView ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          <p className="text-2xl font-bold text-white mb-2">
            Combine All 3 Pillars for Maximum Earnings
          </p>
          <p className="text-slate-400">Build your wealth empire with multiple income streams working simultaneously</p>
        </div>
      </div>
    </section>
  );
}
