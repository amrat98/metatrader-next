import { Shield, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export function RiskManagement() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
            AI-Powered Risk Management
          </h2>
          <p className="text-xl text-slate-400 mb-2">We Don't Just Trade. We Manage Risk.</p>
          <p className="text-slate-500 max-w-3xl mx-auto">
            Our proprietary AI system aggregates multiple proven traders and strategically balances
            your portfolio for consistent, smoother returns
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div
            className={`transform transition-all duration-1000 delay-200 ${
              isInView ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
          >
            <div className="relative p-8 bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-500/30 rounded-2xl backdrop-blur-sm">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />

              <div className="relative space-y-6">
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Multiple Proven Traders</h4>
                    <p className="text-sm text-slate-400">
                      We aggregate the best performing traders globally
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-amber-500/50 transition-colors">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Strategic Allocation</h4>
                    <p className="text-sm text-slate-400">
                      AI distributes trades across traders (e.g., 20%, 50%, 30%)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-green-500/50 transition-colors">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Balanced Returns</h4>
                    <p className="text-sm text-slate-400">
                      When one trader dips, others may profit—smoothing overall performance
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-violet-500/50 transition-colors">
                  <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Risk Minimization</h4>
                    <p className="text-sm text-slate-400">
                      Diversification reduces exposure to any single trading strategy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`transform transition-all duration-1000 delay-400 ${
              isInView ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-amber-500/20 rounded-2xl blur-xl" />

              <div className="relative p-8 bg-slate-900/90 border border-white/10 rounded-2xl backdrop-blur-sm">
                <div className="text-center mb-6">
                  <Shield className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">COPY/PAMM Integration</h3>
                  <p className="text-slate-400">Automated portfolio management</p>
                </div>

                <div className="space-y-4">
                  {[
                    { trader: 'Trader A', allocation: 20, profit: '+12.5%' },
                    { trader: 'Trader B', allocation: 50, profit: '+8.3%' },
                    { trader: 'Trader C', allocation: 30, profit: '+15.7%' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-4 bg-white/5 rounded-xl border border-white/10"
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${i * 0.2}s both`,
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-white">{item.trader}</span>
                        <span className="text-green-400 font-bold">{item.profit}</span>
                      </div>
                      <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full"
                          style={{
                            width: `${item.allocation}%`,
                            animation: `widthGrow 1.5s ease-out ${i * 0.2}s both`,
                          }}
                        />
                      </div>
                      <div className="text-right text-sm text-slate-400 mt-1">
                        {item.allocation}% allocation
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-950/40 to-emerald-950/40 border border-green-500/30 rounded-xl text-center">
                  <p className="text-sm text-slate-400 mb-1">Combined Portfolio Performance</p>
                  <p className="text-3xl font-bold text-green-400">+11.2%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
