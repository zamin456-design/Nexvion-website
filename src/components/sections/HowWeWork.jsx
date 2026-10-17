import { useState } from 'react';
import { 
  Search, 
  Workflow, 
  Rocket, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  Terminal, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const workflowPhases = [
  {
    phase: '01',
    title: 'Domain & Data Topology Audit',
    subtitle: 'Understanding the problem before writing a single token',
    icon: Search,
    color: 'from-cyan-500 to-blue-500',
    borderColor: 'border-cyan-500/30',
    details: [
      'Data pipeline audit: Vector chunking strategy, unstructured docs & databases',
      'Cost & latency modeling: Benchmarking token usage vs deterministic code',
      'Security boundary assessment: SOC2/HIPAA compliance & local air-gap options',
      'Target accuracy KPI: Setting precision thresholds (99%+ zero-hallucination)',
    ],
    deliverable: 'Comprehensive AI System Architecture Blueprint & Token ROI Forecast',
    terminalSnippet: `$ nexvion-audit --scope enterprise-rag --compliance soc2
[+] Analyzing 4.8 GB enterprise corpus across 3 data sources
[+] Token efficiency calculated: $0.0004 per query
[+] Air-gapped on-prem fallback verified: Ollama/DeepSeek 70B
[OK] Readiness Score: 98.4/100 -> Proceeding to Stage 02`,
  },
  {
    phase: '02',
    title: 'Neural Architecture & PoC',
    subtitle: 'Rapid validation in an isolated staging playground',
    icon: Workflow,
    color: 'from-purple-500 to-indigo-500',
    borderColor: 'border-purple-500/30',
    details: [
      'Multi-agent graph orchestration: Planning, critique, and execution nodes',
      'Hybrid retrieval system: Dense vectors + BM25 sparse keyword cross-encoder',
      'Synthetic benchmark suites: 500+ edge test cases with golden truth answers',
      'Strict schema enforcement: Pydantic & Instructor for deterministic JSON',
    ],
    deliverable: 'Working Staging Playground with interactive accuracy benchmarks',
    terminalSnippet: `$ pytest tests/eval_rag_grounding.py -v
test_factual_grounding .......... PASSED [100%]
test_hallucination_defense ...... PASSED [100%]
test_p95_latency_under_50ms ..... PASSED [38ms]
================== 48 passed in 1.42s ==================`,
  },
  {
    phase: '03',
    title: 'Hardened Production Deployment',
    subtitle: 'Scaling out with zero-downtime enterprise reliability',
    icon: Rocket,
    color: 'from-pink-500 to-rose-500',
    borderColor: 'border-pink-500/30',
    details: [
      'High-throughput inference clustering: vLLM, TensorRT-LLM with continuous batching',
      'Semantic caching layer: Redis/Postgres caching for 80% cost reduction on common prompts',
      'Hardened security guardrails: Prompt injection filters & PII anonymizers',
      'Full-stack UI integration: Supabase auth/data, WebSockets for streaming responses',
    ],
    deliverable: 'Production Kubernetes / Cloud Cluster with 99.98% uptime SLA',
    terminalSnippet: `$ kubectl get pods -n nexvion-cluster
NAME                             READY   STATUS    RESTARTS   AGE
vllm-inference-worker-7d8b       2/2     Running   0          42d
supabase-realtime-broker-3a1c    1/1     Running   0          42d
agent-orchestrator-gw-9f4e       1/1     Running   0          42d
[OK] Production cluster healthy. Streaming active.`,
  },
  {
    phase: '04',
    title: 'Autonomous Monitoring & DPO',
    subtitle: 'Continuous self-improvement and drift prevention',
    icon: Activity,
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/30',
    details: [
      'Real-time telemetry: Tracking user feedback, token consumption, and edge failures',
      'Direct Preference Optimization (DPO): Aligning models directly with human evaluations',
      'Automated fallback cascades: Instant failover to secondary model if latency spikes',
      'Periodic re-indexing: Keeping vector embeddings synchronized with fresh data',
    ],
    deliverable: 'Live Telemetry Dashboard & Monthly Model Quality Upgrades',
    terminalSnippet: `$ nexvion-telemetry --metric dpo_alignment
[+] Ingested 18,400 user thumbs-up/down preference signals
[+] Running LoRA adapter fine-tuning on custom cluster
[+] Validation loss decreased: 0.42 -> 0.18 (-57%)
[OK] New model weights deployed with zero downtime.`,
  },
];

export default function HowWeWork() {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const current = workflowPhases[activePhaseIndex];

  return (
    <section className="py-24 md:py-32 bg-bg relative">
      <div className="max-w-content mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>THE NEXVION METHODOLOGY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            How We Build Production AI Systems
          </h2>
          <p className="mt-4 text-muted text-base leading-relaxed">
            We don't sell fragile prompt wrappers. We build enterprise-grade cognitive architectures that scale deterministically, adhere to strict schemas, and protect proprietary business IP.
          </p>
        </div>

        {/* Phase Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {workflowPhases.map((phase, idx) => {
            const Icon = phase.icon;
            const isActive = activePhaseIndex === idx;
            return (
              <button
                key={phase.phase}
                onClick={() => setActivePhaseIndex(idx)}
                className={`p-4 rounded-2xl text-left border transition-all duration-300 flex flex-col justify-between ${
                  isActive
                    ? 'bg-white/[0.06] border-cyan-500/40 shadow-lg shadow-cyan-950/40 scale-[1.02]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-muted'}`}>
                    PHASE {phase.phase}
                  </span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-muted'}`} />
                </div>
                <p className="text-sm font-semibold text-white mt-3 leading-snug">{phase.title}</p>
              </button>
            );
          })}
        </div>

        {/* Active Phase Deep Dive Card */}
        <div className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  {current.phase}
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{current.title}</h3>
                  <p className="text-xs text-muted font-mono">{current.subtitle}</p>
                </div>
              </div>

              {/* Bullet points */}
              <div className="space-y-3 pt-2">
                {current.details.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                    <span className="text-sm text-white/90 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              {/* Tangible deliverable banner */}
              <div className="p-4 rounded-xl bg-cyan-500/[0.04] border border-cyan-500/20 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider font-bold">Primary Milestone Deliverable</span>
                  <p className="text-xs font-semibold text-white mt-0.5">{current.deliverable}</p>
                </div>
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
              </div>
            </div>

            {/* Right Column: Interactive Terminal Output */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-black/70 border border-white/10 p-5 shadow-2xl font-mono text-xs overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[11px] text-muted">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="ml-1 text-white/80">pipeline-telemetry.log</span>
                  </div>
                  <span className="text-emerald-400">PASSED</span>
                </div>
                <pre className="mt-4 text-cyan-300/90 leading-relaxed text-[11px] overflow-x-auto whitespace-pre-wrap">
                  {current.terminalSnippet}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-12 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Have a technical project in mind? Review your architecture with our engineers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
