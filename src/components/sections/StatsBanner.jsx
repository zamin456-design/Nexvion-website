import { Shield, Zap, TrendingUp, Cpu, Award } from 'lucide-react';

const stats = [
  {
    icon: Zap,
    metric: '99.84%',
    label: 'Deterministic Precision',
    detail: 'Pydantic schema verification',
    color: 'text-cyan-400',
  },
  {
    icon: Cpu,
    metric: '<45ms',
    label: 'P95 Inference Latency',
    detail: 'Custom vLLM continuous batching',
    color: 'text-purple-400',
  },
  {
    icon: TrendingUp,
    metric: '$1.4M+',
    label: 'Client Compute Saved',
    detail: 'Semantic vector caching layer',
    color: 'text-emerald-400',
  },
  {
    icon: Shield,
    metric: '100%',
    label: 'Code & IP Ownership',
    detail: 'Zero vendor lock-in or retention',
    color: 'text-pink-400',
  },
];

export default function StatsBanner() {
  return (
    <section className="py-12 border-b border-white/10 bg-white/[0.01]">
      <div className="max-w-content mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-5 h-5 ${st.color}`} />
                  <span className="text-[10px] font-mono text-muted-dark uppercase tracking-wider">VERIFIED</span>
                </div>
                <div className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${st.color}`}>
                  {st.metric}
                </div>
                <p className="text-sm font-semibold text-white mt-1">{st.label}</p>
                <p className="text-[11px] text-muted font-mono mt-0.5">{st.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
