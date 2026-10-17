import { 
  Cpu, 
  Database, 
  Terminal, 
  Layers, 
  Server, 
  Cloud, 
  Sparkles, 
  GitBranch, 
  Lock, 
  Zap, 
  Code2, 
  Workflow 
} from 'lucide-react';

const technologiesRow1 = [
  { name: 'PyTorch 2.5', category: 'Deep Learning', icon: Cpu, color: 'text-amber-400' },
  { name: 'LangGraph & LangChain', category: 'Agent Orchestration', icon: Workflow, color: 'text-emerald-400' },
  { name: 'Claude 3.5 Sonnet', category: 'Reasoning Engine', icon: Sparkles, color: 'text-orange-400' },
  { name: 'Llama 3.3 70B', category: 'Open-Weights LLM', icon: Terminal, color: 'text-blue-400' },
  { name: 'vLLM & TensorRT-LLM', category: 'Inference Engine', icon: Zap, color: 'text-yellow-400' },
  { name: 'Qdrant & Pinecone', category: 'Vector Search DB', icon: Database, color: 'text-cyan-400' },
  { name: 'Supabase Postgres', category: 'Backend & Edge RLS', icon: Database, color: 'text-emerald-400' },
];

const technologiesRow2 = [
  { name: 'OpenAI GPT-4o', category: 'Multimodal AI', icon: Sparkles, color: 'text-teal-400' },
  { name: 'FastAPI High-Speed', category: 'Microservices', icon: Server, color: 'text-emerald-400' },
  { name: 'Docker & Kubernetes', category: 'Cluster Orchestration', icon: Cloud, color: 'text-blue-400' },
  { name: 'Hugging Face Hub', category: 'Model Registry', icon: GitBranch, color: 'text-amber-400' },
  { name: 'React 19 & Next.js', category: 'Front-End Interface', icon: Code2, color: 'text-cyan-400' },
  { name: 'Private On-Prem Airgap', category: 'Data Sovereignty', icon: Lock, color: 'text-pink-400' },
  { name: 'Ollama & DeepSeek', category: 'Local Edge Inference', icon: Cpu, color: 'text-purple-400' },
];

export default function TechMarquee() {
  return (
    <section className="py-16 md:py-24 border-y border-white/10 bg-bg relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-full bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-48 h-full bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

      <div className="max-w-content mx-auto px-6 mb-10 text-center">
        <p className="text-xs font-mono tracking-widest uppercase text-muted-dark flex items-center justify-center gap-2">
          <span className="w-8 h-[1px] bg-cyan-500/50" />
          <span>PRODUCTION-GRADE AI STACK</span>
          <span className="w-8 h-[1px] bg-cyan-500/50" />
        </p>
        <h2 className="text-xl md:text-2xl font-bold text-white mt-2">
          Engineered With Leading Edge AI Infrastructure
        </h2>
      </div>

      {/* Row 1 - Marquee Forward */}
      <div className="flex overflow-hidden select-none py-2">
        <div className="flex shrink-0 gap-4 animate-marquee hover:[animation-play-state:paused]">
          {[...technologiesRow1, ...technologiesRow1].map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div
                key={`r1-${idx}`}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-400/40 hover:bg-white/[0.05] transition-all backdrop-blur-md shrink-0 cursor-default shadow-sm"
              >
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <Icon className={`w-4 h-4 ${tech.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">{tech.name}</h3>
                  <p className="text-[11px] font-mono text-muted">{tech.category}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2 - Marquee Reverse */}
      <div className="flex overflow-hidden select-none py-2 mt-4">
        <div className="flex shrink-0 gap-4 animate-marquee-reverse hover:[animation-play-state:paused]">
          {[...technologiesRow2, ...technologiesRow2].map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div
                key={`r2-${idx}`}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-400/40 hover:bg-white/[0.05] transition-all backdrop-blur-md shrink-0 cursor-default shadow-sm"
              >
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <Icon className={`w-4 h-4 ${tech.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">{tech.name}</h3>
                  <p className="text-[11px] font-mono text-muted">{tech.category}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
