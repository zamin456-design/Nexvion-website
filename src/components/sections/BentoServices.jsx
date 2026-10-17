import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TiltCard from '../visuals/TiltCard';

export default function BentoServices() {
  return (
    <section id="explore" className="py-20 md:py-28 bg-[#05070f] relative">
      <div className="max-w-content mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-2xl mb-14 text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Everything your business needs to <br />
            work smarter
          </h2>
          <p className="mt-4 text-muted text-sm sm:text-base">
            Ten services, one team. Pick what fits and book it in a minute.
          </p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-24">
          
          {/* Large Left Card: AI Agents & Automation */}
          <div className="md:col-span-6 lg:col-span-5">
            <TiltCard className="h-full rounded-3xl bg-[#0b0f1d] border border-white/5 p-8 flex flex-col justify-between hover:border-cyan-500/30 transition-all shadow-xl">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  AI Agents & Automation
                </h3>
                <p className="text-muted text-sm leading-relaxed max-w-sm">
                  Agents that connect your tools, make decisions, and handle repetitive work around the clock.
                </p>
              </div>

              <div className="pt-16">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#fde047] hover:underline"
                >
                  <span>Book from $200</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </TiltCard>
          </div>

          {/* Right Column Stack */}
          <div className="md:col-span-6 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Card 1: RAG & LLM Solutions */}
            <div className="sm:col-span-2">
              <TiltCard className="rounded-3xl bg-[#0b0f1d] border border-white/5 p-7 flex flex-col justify-between hover:border-purple-500/30 transition-all shadow-xl">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    RAG & LLM Solutions
                  </h3>
                  <p className="text-muted text-xs leading-relaxed max-w-lg">
                    An assistant that answers from your own documents and shows where each answer came from.
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#fde047] hover:underline"
                  >
                    <span>Book from $600</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </TiltCard>
            </div>

            {/* Card 2: AI Chatbots */}
            <div>
              <TiltCard className="h-full rounded-3xl bg-[#0b0f1d] border border-white/5 p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-all shadow-xl">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    AI Chatbots
                  </h3>
                  <p className="text-muted text-xs leading-relaxed">
                    Website and WhatsApp chat that answers customers instantly.
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#fde047] hover:underline"
                  >
                    <span>Book from $150</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </TiltCard>
            </div>

            {/* Card 3: Computer Vision */}
            <div>
              <TiltCard className="h-full rounded-3xl bg-[#0b0f1d] border border-white/5 p-6 flex flex-col justify-between hover:border-pink-500/30 transition-all shadow-xl">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Computer Vision
                  </h3>
                  <p className="text-muted text-xs leading-relaxed">
                    Models that read images and video.
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#fde047] hover:underline"
                  >
                    <span>Book from $500</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </TiltCard>
            </div>

            {/* Card 4: Full-Stack & SaaS */}
            <div>
              <TiltCard className="h-full rounded-3xl bg-[#0b0f1d] border border-white/5 p-6 flex flex-col justify-between hover:border-blue-500/30 transition-all shadow-xl">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Full-Stack & SaaS
                  </h3>
                  <p className="text-muted text-xs leading-relaxed">
                    Websites, web apps, and subscription products with login, database, and admin panel.
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#fde047] hover:underline"
                  >
                    <span>Book from $250</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </TiltCard>
            </div>

            {/* Card 5: Fine-Tuning & Custom Models */}
            <div>
              <TiltCard className="h-full rounded-3xl bg-[#0b0f1d] border border-white/5 p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all shadow-xl">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Fine-Tuning & Custom Models
                  </h3>
                  <p className="text-muted text-xs leading-relaxed">
                    Adapt a language model to your voice and domain, or train a model on your data.
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#fde047] hover:underline"
                  >
                    <span>Book from $700</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </TiltCard>
            </div>

          </div>

        </div>

        {/* Section: How a project runs (Page 2) */}
        <div className="py-16 border-t border-white/5">
          <div className="mb-14 text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              How a project runs
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f43f5e] to-[#fb7185] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-rose-950/40">
                1
              </div>
              <h3 className="text-base font-bold text-white">Talk to us</h3>
              <p className="text-xs text-muted leading-relaxed">
                Tell us the goal. Book a service and message the team directly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f43f5e] to-[#fb7185] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-rose-950/40">
                2
              </div>
              <h3 className="text-base font-bold text-white">Get a clear quote</h3>
              <p className="text-xs text-muted leading-relaxed">
                You see a starting price and any discount before anything begins.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f43f5e] to-[#fb7185] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-rose-950/40">
                3
              </div>
              <h3 className="text-base font-bold text-white">We build</h3>
              <p className="text-xs text-muted leading-relaxed">
                Follow progress and reply to us from your client dashboard.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f43f5e] to-[#fb7185] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-rose-950/40">
                4
              </div>
              <h3 className="text-base font-bold text-white">Launch and support</h3>
              <p className="text-xs text-muted leading-relaxed">
                We deploy, hand over, and stay available for changes.
              </p>
            </div>
          </div>
        </div>

        {/* Pre-Footer Call to Action Box (Page 3) */}
        <div className="mt-16 p-10 md:p-16 rounded-[32px] bg-gradient-to-br from-[#0c0f24] via-[#090c1b] to-[#060815] border border-purple-500/30 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Have an idea? Let's build it.
            </h2>
            <p className="text-muted text-xs sm:text-sm">
              Create a free account, book a service, and talk to us directly.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/signup"
                className="px-7 py-3 rounded-full text-xs font-bold text-[#08060d] bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#facc15] hover:opacity-95 transition-all shadow-md shadow-yellow-950/20 hover:scale-[1.02]"
              >
                Create an account
              </Link>
              <Link
                to="/services"
                className="px-7 py-3 rounded-full text-xs font-medium text-white bg-white/5 border border-white/15 hover:bg-white/10 transition-all"
              >
                Browse services
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
