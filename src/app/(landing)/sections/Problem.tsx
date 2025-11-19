import { X, Check } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export function Problem() {
  const { ref, isInView } = useInView();

  const problems = [
    'High Risk, High Stress',
    'Profitable strategies are hard to find',
    'Unpredictable market swings',
    'Lack of structured community',
  ];

  const solutions = [
    'Democratize financial success',
    'Technology-driven ecosystem',
    'High-end risk management',
    'Life-changing affiliate rewards',
  ];

  return (
    <section ref={ref} className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/10 to-slate-950" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
            The Trader's Dilemma
          </h2>
          <p className="text-xl text-slate-400">From challenge to opportunity</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div
            className={`transform transition-all duration-1000 delay-200 ${
              isInView ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
          >
            <div className="p-8 bg-red-950/20 border border-red-500/30 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <X className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-red-400">The Problems</h3>
              </div>

              <div className="space-y-4">
                {problems.map((problem, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-red-950/30 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-colors"
                  >
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{problem}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`transform transition-all duration-1000 delay-400 ${
              isInView ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
          >
            <div className="p-8 bg-green-950/20 border border-green-500/30 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-green-400">Our Solution</h3>
              </div>

              <div className="space-y-4">
                {solutions.map((solution, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-green-950/30 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-colors"
                  >
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{solution}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mt-12 text-center p-8 bg-gradient-to-r from-blue-950/30 to-amber-950/30 rounded-2xl border border-blue-500/30 backdrop-blur-sm transform transition-all duration-1000 delay-600 ${
            isInView ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          <p className="text-xl text-slate-300 max-w-4xl mx-auto">
            <span className="font-bold text-amber-400">We are not just traders;</span> we are a
            community of <span className="font-bold text-blue-400">risk-managed wealth builders</span>
          </p>
        </div>
      </div>
    </section>
  );
}
