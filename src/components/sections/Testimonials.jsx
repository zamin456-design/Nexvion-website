import { Quote, Sparkles, Star, CheckCircle } from 'lucide-react';

const testimonials = [
  {
    quote:
      'NexVion replaced our brittle LangChain prototype with an air-gapped multi-agent swarm that processes 10,000 financial filings daily with zero hallucinations. Their engineering discipline is unmatched.',
    author: 'Marcus Vance',
    role: 'VP of Engineering',
    company: 'FinLedger Systems',
    results: '72% manual time saved',
  },
  {
    quote:
      'Most AI agencies sell hype and prompt templates. The student engineers at NexVion built custom quantization pipelines that reduced our monthly GPU token bill from $28,000 down to $4,200.',
    author: 'Dr. Sarah Lin',
    role: 'Chief Technology Officer',
    company: 'SynapseBio Therapeutics',
    results: '$285k/yr cost reduction',
  },
  {
    quote:
      'Our legal M&A discovery engine went from taking 4 days per deal room to under 3 minutes. The Pydantic schemas they enforced mean our lawyers can trust every output completely.',
    author: 'Harrison Cole',
    role: 'Head of Legal Innovation',
    company: 'Apex Global Partners',
    results: '99.8% clause recall rate',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 border-t border-white/10 bg-bg relative overflow-hidden">
      <div className="max-w-content mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CLIENT REPUTATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Validated By High-Growth Engineering Teams
          </h2>
          <p className="mt-3 text-muted text-sm leading-relaxed">
            From Series A tech startups to enterprise institutions, here is what technical leaders say about working with NexVion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between backdrop-blur-xl relative"
            >
              <div>
                <div className="flex items-center gap-1 text-yellow-400 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-white/90 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-5 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.author}</h4>
                    <p className="text-[11px] text-muted font-mono">{t.role}, <span className="text-cyan-400">{t.company}</span></p>
                  </div>
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" />
                  <span>{t.results}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
