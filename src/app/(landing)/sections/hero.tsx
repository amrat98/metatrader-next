import { TrendingUp, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-40 md:pt-30 lg:pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950" />

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-blue-300">The Future of Trading & Wealth Creation</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-amber-400 to-blue-400 bg-clip-text text-transparent animate-gradient bg-300%">
            The Billionaire's Blueprint
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Where Elite Trading Meets Unmatched Affiliate Earning Power
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-amber-600 rounded-lg font-bold text-lg hover:scale-105 transition-all duration-200 shadow-2xl shadow-blue-500/50 hover:shadow-amber-500/50">
              Start Your Journey
              <TrendingUp className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-lg font-bold text-lg hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
              Learn More
            </button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { value: '7', label: 'Day Masterclass' },
            { value: 'AI', label: 'Risk Management' },
            { value: '$500', label: 'Funded Account' },
            { value: '3', label: 'Income Streams' },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 transform hover:scale-105 transition-all duration-300"
              style={{
                animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`,
              }}
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
