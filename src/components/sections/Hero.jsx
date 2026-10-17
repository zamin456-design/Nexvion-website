import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import CelestialHeroVisual from '../visuals/CelestialHeroVisual';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden min-h-[92vh] flex flex-col justify-between bg-[#070814]">
      {/* Background Subtle Cyber Grid matching designer image */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      {/* Background Soft Ambient Light */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-gradient-radial from-indigo-900/15 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-content mx-auto px-6 md:px-12 relative z-10 w-full flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* Left Column: Text & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium text-white/90 bg-white/[0.04] border border-white/10 backdrop-blur-md">
              AI Agents · RAG · Automation
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.05] font-sans">
              Building the <br />
              Future with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f43f5e] via-[#fb7185] to-[#c084fc]">
                AI
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[#94a3b8] text-base sm:text-lg max-w-xl leading-relaxed font-sans">
              We design intelligent, scalable software for businesses and individuals, from smart apps to AI agents that work while you sleep.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold text-[#08060d] bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#facc15] hover:opacity-95 transition-all shadow-lg shadow-yellow-950/20 hover:scale-[1.02]"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-xs sm:text-sm font-medium text-white/90 bg-transparent border border-white/20 hover:bg-white/[0.05] hover:border-white/30 transition-all backdrop-blur-md"
              >
                See Our Work
              </Link>
            </div>

            {/* Bottom Category Filter Pills */}
            <div className="pt-10 flex flex-wrap items-center gap-2.5">
              <Link
                to="/services"
                className="px-4 py-2 rounded-full text-xs font-medium text-white/80 bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 hover:text-white transition-all"
              >
                AI Agents
              </Link>
              <Link
                to="/services"
                className="px-4 py-2 rounded-full text-xs font-medium text-white/80 bg-white/[0.03] border border-white/10 hover:border-purple-400/40 hover:text-white transition-all"
              >
                RAG & LLM Solutions
              </Link>
              <Link
                to="/services"
                className="px-4 py-2 rounded-full text-xs font-medium text-white/80 bg-white/[0.03] border border-white/10 hover:border-pink-400/40 hover:text-white transition-all"
              >
                Full-Stack & SaaS
              </Link>
            </div>
          </div>

          {/* Right Column: Exact Designer Celestial Sphere Graphic */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            <CelestialHeroVisual />
          </div>

        </div>
      </div>

      {/* Bottom Right: Scroll to explore */}
      <div className="max-w-content mx-auto px-6 md:px-12 w-full pt-6 flex items-center justify-end text-xs text-muted font-sans relative z-10">
        <a
          href="#explore"
          className="hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>Scroll to explore</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
