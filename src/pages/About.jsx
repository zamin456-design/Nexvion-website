import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Sparkles, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  GraduationCap, 
  Code, 
  Award, 
  HeartHandshake 
} from 'lucide-react';

const principles = [
  {
    icon: Terminal,
    title: 'Zero Black-Box Voodoo',
    description: 'We don’t pitch magical AI hype. Every model, prompt cascade, and retrieval node is benchmarked against rigorous synthetic golden datasets with reproducible evaluations.',
  },
  {
    icon: Zap,
    title: 'Extreme Latency Obsession',
    description: 'A 2-second delay kills user engagement. We optimize every token with quantization, continuous batching, and semantic vector caching to keep P95 latency sub-50ms.',
  },
  {
    icon: ShieldCheck,
    title: 'Deterministic JSON Contracts',
    description: 'Downstream software cannot parse poetic prose. We enforce Pydantic typing and guardrails so autonomous agents return predictable, typed data structures 100% of the time.',
  },
  {
    icon: Cpu,
    title: '100% Client Sovereignty',
    description: 'You own the code, weights, vectors, and pipelines. We build systems that can run on your private cloud or air-gapped on-premise hardware without ongoing license lock-ins.',
  },
];

const teamMembers = [
  {
    name: 'Aaryan K.',
    role: 'Co-Founder & Chief AI Architect',
    focus: 'Multi-Agent Swarm Orchestration & Distributed vLLM Inference',
    bio: 'Student engineer & open-source contributor specializing in agentic cognitive graphs and low-latency LLM serving.',
    badge: 'Core Lead',
  },
  {
    name: 'Zayd M.',
    role: 'Co-Founder & Head of Systems',
    focus: 'Enterprise RAG & High-Throughput Vector DB Topology',
    bio: 'Researches hybrid dense-sparse semantic retrieval and zero-leakage security boundaries for enterprise data.',
    badge: 'Systems Lead',
  },
  {
    name: 'Elena V.',
    role: 'Staff ML Engineer',
    focus: 'Model Quantization, DPO & Fine-Tuning Kernels',
    bio: 'Focuses on LoRA / QLoRA parameter-efficient adaptation and distilling 70B teacher models into high-speed edge weights.',
    badge: 'ML Research',
  },
  {
    name: 'Rohan S.',
    role: 'Lead Full-Stack AI Engineer',
    focus: 'React 19, Supabase Real-Time & Streaming WebSocket UX',
    bio: 'Crafts ultra-responsive front-end interfaces that bring complex neural reasoning to life with sub-second feedback.',
    badge: 'Product & UX',
  },
];

const timeline = [
  {
    year: 'Q1 2026',
    title: 'The Inception',
    desc: 'Founded in university computer science labs by student engineers frustrated with fragile, overpriced generic AI consultancy wrappers.',
  },
  {
    year: 'Q2 2026',
    title: 'The Deterministic Runtime',
    desc: 'Architected NexVion-Swarm-v1, achieving a 99.8% precision score on complex SEC and legal document extractions.',
  },
  {
    year: 'Q3 2026',
    title: 'Enterprise Air-Gap Deployments',
    desc: 'Successfully deployed air-gapped on-premise inference clusters for financial and industrial manufacturing clients.',
  },
  {
    year: 'Q4 2026 & Beyond',
    title: 'Autonomous Enterprise Intelligence',
    desc: 'Expanding custom fine-tuning pipelines and multi-agent coordination frameworks for enterprise organizations worldwide.',
  },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About NexVion — Founded by Student Engineers</title>
        <meta name="description" content="Founded in 2026 by student engineers, NexVion was built on a single ethos: high-tier intelligence systems should be fast, transparent, and deterministically useful." />
      </Helmet>

      <div className="pt-36 pb-28 max-w-content mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>OUR STORY & VALUES</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            Built by Student Engineers. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
              Engineered For Determinism.
            </span>
          </h1>
          <p className="mt-4 text-muted text-base sm:text-lg leading-relaxed">
            Founded in 2026 by student engineers, NexVion was built on a single ethos: high-tier intelligence systems should be fast, transparent, and deterministically useful.
          </p>
        </div>

        {/* The Founders' Manifesto Card */}
        <div className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-5 text-sm sm:text-base text-white/90 leading-relaxed">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              The NexVion Manifesto
            </h2>
            <p>
              In early 2026, the artificial intelligence landscape was flooded with superficial wrappers: basic ChatGPT clones charging exorbitant monthly retainer fees while delivering hallucinating, ungrounded responses that broke every corporate integration.
            </p>
            <p>
              As computer science students and applied ML researchers working directly with open-weights models and distributed GPU clusters, we knew enterprise AI demanded an entirely different standard: <strong>rigorous mathematical precision, latency guarantees, and deterministic reliability</strong>.
            </p>
            <p>
              We founded NexVion to build the AI infrastructure we wanted to use: systems that never hallucinate without consequence, that can run securely on private corporate hardware, and that return structured data your software can rely on 24/7.
            </p>

            <div className="pt-4 flex items-center gap-3 text-xs font-mono text-cyan-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>100% Student-Founded • 100% Engineering Focused • 0% Bullshit</span>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Our Engineering Principles</h2>
            <p className="text-xs text-muted mt-2">The four non-negotiable rules behind every NexVion deployment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((pr, i) => {
              const Icon = pr.icon;
              return (
                <div key={i} className="p-7 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{pr.title}</h3>
                  <p className="text-xs text-muted leading-relaxed mt-2">{pr.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leadership & Engineering Team */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">The Engineering Core</h2>
            <p className="text-xs text-muted mt-2">Minds combining academic research rigor with high-tempo execution</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/15 flex items-center justify-center mb-4 text-cyan-300 font-mono font-bold text-lg">
                    {member.name.slice(0, 2)}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-400 border border-white/10">
                    {member.badge}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{member.name}</h3>
                  <p className="text-xs font-mono text-purple-300 mt-0.5">{member.role}</p>
                  <p className="text-xs text-muted leading-relaxed mt-3">{member.bio}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/10 text-[11px] font-mono text-muted-dark">
                  <span>Specialty: {member.focus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="mb-24 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Our 2026 Trajectory</h2>
            <p className="text-xs text-muted mt-2">From university lab experiments to enterprise deployments</p>
          </div>

          <div className="space-y-6">
            {timeline.map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-5">
                <span className="text-sm font-mono font-bold text-cyan-400 shrink-0 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {step.year}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-muted leading-relaxed mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to get in touch */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/20 via-black to-pink-950/20 border border-white/10 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white">Collaborate With Our Engineering Team</h2>
          <p className="text-xs text-muted mt-2">
            Whether you need a custom agent swarm or an enterprise RAG audit, let's look at your data topology.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20"
          >
            <span>Start Technical Scoping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </>
  );
}
