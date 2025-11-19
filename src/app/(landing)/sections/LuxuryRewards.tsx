import { Gift, Car, Home, Watch } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export function LuxuryRewards() {
  const { ref, isInView } = useInView();

  const rewards = [
    { lots: '100', reward: 'Premium Tablet', icon: Gift, color: 'blue' },
    { lots: '500', reward: 'High-End Laptop', icon: Gift, color: 'violet' },
    { lots: '1,000', reward: 'Dubai Tour Package', icon: Home, color: 'amber' },
    { lots: '10,000', reward: 'Kia Carens Car', icon: Car, color: 'green' },
    { lots: '50,000', reward: 'Mercedes-Benz', icon: Car, color: 'blue' },
    { lots: '100,000', reward: 'Land Rover Defender', icon: Car, color: 'red' },
    { lots: '1,000,000', reward: 'Dubai Villa', icon: Home, color: 'amber' },
  ];

  const colorClasses = {
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/30 hover:border-blue-400',
    violet: 'from-violet-500/10 to-violet-600/10 border-violet-500/30 hover:border-violet-400',
    amber: 'from-amber-500/10 to-amber-600/10 border-amber-500/30 hover:border-amber-400',
    green: 'from-green-500/10 to-green-600/10 border-green-500/30 hover:border-green-400',
    red: 'from-red-500/10 to-red-600/10 border-red-500/30 hover:border-red-400',
  };

  return (
    <section ref={ref} className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-amber-950/10 to-slate-950" />

      <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6 backdrop-blur-sm">
            <Gift className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-300">Luxury LOT Rewards</span>
          </div>

          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Drive Your Success. Literally.
          </h2>
          <p className="text-xl text-slate-400">
            Trade more, earn tangible luxury rewards
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {rewards.slice(0, 4).map((reward, i) => {
            const Icon = reward.icon;
            return (
              <div
                key={i}
                className={`group p-6 bg-gradient-to-br ${
                  colorClasses[reward.color as keyof typeof colorClasses]
                } border rounded-2xl backdrop-blur-sm transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="mb-3">
                    <span className="text-3xl font-bold text-white">{reward.lots}</span>
                    <span className="text-slate-400 ml-1">Lots</span>
                  </div>

                  <p className="text-lg font-semibold text-white">{reward.reward}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {rewards.slice(4).map((reward, i) => {
            const Icon = reward.icon;
            return (
              <div
                key={i}
                className={`group p-8 bg-gradient-to-br ${
                  colorClasses[reward.color as keyof typeof colorClasses]
                } border rounded-2xl backdrop-blur-sm transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${(i + 4) * 100}ms` }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <div className="mb-3">
                    <span className="text-4xl font-bold text-white">{reward.lots}</span>
                    <span className="text-slate-400 ml-1">Lots</span>
                  </div>

                  <p className="text-xl font-semibold text-white">{reward.reward}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={`mt-12 p-8 bg-gradient-to-r from-amber-950/40 to-orange-950/40 border border-amber-500/30 rounded-2xl backdrop-blur-sm text-center transform transition-all duration-1000 delay-700 ${
            isInView ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          <Watch className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Plus Exclusive Designer Items</h3>
          <p className="text-slate-400">
            Versace watches, luxury accessories, and more premium rewards as you scale
          </p>
        </div>
      </div>
    </section>
  );
}
