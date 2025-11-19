import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export function ProfitSharing() {
  const { ref, isInView } = useInView();

  const levels = [
    { level: 1, percent: 20, amount: 50, requirement: '2 directs', portfolio: '$2,000' },
    { level: 2, percent: 20, amount: 50, requirement: '2 directs', portfolio: '$2,000' },
    { level: 3, percent: 10, amount: 25, requirement: '3 directs', portfolio: '$3,000' },
    { level: 4, percent: 10, amount: 25, requirement: '4 directs', portfolio: '$4,000' },
    { level: 5, percent: 10, amount: 25, requirement: '5 directs', portfolio: '$5,000' },
    { level: 6, percent: 10, amount: 25, requirement: '6 directs', portfolio: '$6,000' },
    { level: 7, percent: 5, amount: 12.5, requirement: '7 directs', portfolio: '$7,000' },
    { level: 8, percent: 5, amount: 12.5, requirement: '8 directs', portfolio: '$8,000' },
    { level: 9, percent: 5, amount: 12.5, requirement: '9 directs', portfolio: '$9,000' },
    { level: 10, percent: 5, amount: 12.5, requirement: '10 directs', portfolio: '$10,000' },
  ];

  const volumeBonuses = [
    { volume: '$50,000', bonus: '$250' },
    { volume: '$100,000', bonus: '$500' },
    { volume: '$500,000', bonus: '$2,500' },
    { volume: '$1,000,000', bonus: '$5,000' },
    { volume: '$10,000,000', bonus: '$50,000' },
    { volume: '$100,000,000', bonus: '$500,000' },
  ];

  return (
    <section ref={ref} className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-green-950/10 to-slate-950" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Profit Sharing Breakdown
          </h2>
          <p className="text-xl text-slate-400 mb-4">Earn from every successful trade in your network</p>

          <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-green-950/30 to-emerald-950/30 border border-green-500/30 rounded-2xl backdrop-blur-sm">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-white/5 rounded-xl">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white mb-1">50%</p>
                <p className="text-sm text-slate-400">To Client</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white mb-1">25%</p>
                <p className="text-sm text-slate-400">Team Commissions</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <TrendingUp className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white mb-1">25%</p>
                <p className="text-sm text-slate-400">Monthly Allowances</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div
            className={`transform transition-all duration-1000 delay-200 ${
              isInView ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
          >
            <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-green-500/30 rounded-2xl backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                10-Level Commission Structure
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {levels.map((level, i) => (
                  <div
                    key={i}
                    className="group p-4 bg-white/5 rounded-xl border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:bg-green-950/20"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center font-bold text-green-400 text-sm">
                          L{level.level}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{level.percent}% Commission</p>
                          <p className="text-xs text-slate-400">
                            {level.requirement} • {level.portfolio} portfolio
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-green-400">${level.amount}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-gradient-to-r from-green-950/40 to-emerald-950/40 border border-green-500/30 rounded-xl text-center">
                <p className="text-sm text-slate-400">Based on $1,000 profit example</p>
              </div>
            </div>
          </div>

          <div
            className={`transform transition-all duration-1000 delay-400 ${
              isInView ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
          >
            <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-500/30 rounded-2xl backdrop-blur-sm h-full">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                </div>
                Volume Bonuses
              </h3>

              <p className="text-slate-400 mb-6">
                Earn monthly bonuses based on your team's total trading volume
              </p>

              <div className="space-y-3">
                {volumeBonuses.map((bonus, i) => (
                  <div
                    key={i}
                    className="group p-4 bg-white/5 rounded-xl border border-white/10 hover:border-amber-500/50 transition-all duration-300 hover:bg-amber-950/20"
                    style={{
                      animation: isInView ? `fadeInUp 0.5s ease-out ${i * 0.1}s both` : 'none',
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-white">{bonus.volume} Volume</p>
                        <p className="text-xs text-slate-400">Monthly team volume</p>
                      </div>
                      <p className="text-xl font-bold text-amber-400">{bonus.bonus}/mo</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-amber-950/40 to-orange-950/40 border border-amber-500/30 rounded-xl text-center">
                <p className="text-sm text-slate-400 mb-2">Up to</p>
                <p className="text-4xl font-bold text-amber-400 mb-1">$500,000</p>
                <p className="text-sm text-slate-300">Monthly bonus at highest tier</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
