import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import TiltCard from '../components/visuals/TiltCard';

const projectsList = [
  {
    id: 'portfolio',
    title: 'Personal Portfolio',
    category: 'Portfolio',
    typeLabel: 'Portfolio',
    description: 'A personal portfolio project presented in a LinkedIn project showcase.',
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7508687492129333249?compact=1',
  },
  {
    id: 'netflix-rec',
    title: 'Netflix Content Recommendation System',
    category: 'Machine Learning',
    typeLabel: 'Machine Learning',
    description: 'Suggests what to watch next by learning from viewing patterns and similar titles.',
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7501680139152297985?compact=1',
  },
  {
    id: 'forecasting',
    title: 'Forecasting System',
    category: 'Machine Learning',
    typeLabel: 'Time Series',
    description: 'Learns from historical data to predict future values and trends.',
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7505019387762860033?compact=1',
  },
  {
    id: 'study-helper',
    title: 'AI Study Helper',
    category: 'Generative AI',
    typeLabel: 'Generative AI',
    description: 'An AI assistant that helps students study and understand their material.',
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7413179228721987586?compact=1',
  },
  {
    id: 'statement-crafter',
    title: 'Statement Crafter',
    category: 'Generative AI',
    typeLabel: 'Generative AI',
    description: 'Generates tailored professional personal statements and motivation letters.',
    projectUrl: 'https://zamin456-design.github.io/StatementCrafter/',
  },
  {
    id: 'saas-app',
    title: 'SaaS App',
    category: 'SaaS',
    typeLabel: 'SaaS',
    description: 'Multi-tenant cloud application with subscription billing, accounts, and an admin panel.',
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7454871561490120704?compact=1',
  },
];

const categories = ['All', 'Machine Learning', 'Computer Vision', 'Generative AI', 'Portfolio', 'SaaS'];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All'
    ? projectsList
    : projectsList.filter((p) => p.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Things We Have Built — NexVion Projects</title>
        <meta 
          name="description" 
          content="Models, systems, and apps from the NexVion team. New projects are added as we ship them." 
        />
      </Helmet>

      <div className="pt-36 pb-28 max-w-content mx-auto px-6 md:px-12 text-left">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Things we have built
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-muted leading-relaxed">
            Models, systems, and apps from the NexVion team. New projects are added as we ship them.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-white/[0.03] text-muted hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Hero Project (Pneumonia Detector Model - Page 8) */}
        {(selectedCategory === 'All' || selectedCategory === 'Computer Vision') && (
          <div className="mb-12 rounded-3xl bg-[#0b0f1d] border border-white/5 overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-xl">
            {/* LinkedIn project showcase */}
            <div className="md:col-span-6 bg-[#0a0d1e]">
              <iframe
                src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7501004649408372736?compact=1"
                title="Pneumonia Detector Model LinkedIn project post"
                className="h-[399px] w-full border-0"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* Right: Info & Actions */}
            <div className="md:col-span-6 p-8 md:p-12 flex flex-col justify-center space-y-4">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">
                Featured · Computer Vision
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Pneumonia Detector Model
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-md">
                Computer vision model that looks at chest X-rays and flags possible signs of pneumonia. A learning project, not a medical diagnosis tool.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://www.linkedin.com/feed/update/urn:li:ugcPost:7501004649408372736"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-[#08060d] bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#facc15] hover:opacity-95 transition-all shadow-md"
                >
                  Open LinkedIn post
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Grid of Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {filteredProjects.map((p) => (
            <TiltCard
              key={p.id}
              className="rounded-3xl bg-[#0b0f1d] border border-white/5 p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-all shadow-xl min-h-[300px]"
            >
              <div>
                {/* Project preview */}
                {p.embedUrl ? (
                  <iframe
                    src={p.embedUrl}
                    title={`${p.title} LinkedIn project post`}
                    className="mb-5 h-[399px] w-full rounded-2xl border border-white/5 bg-black/40"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                <div className="h-32 w-full rounded-2xl bg-black/40 border border-white/5 mb-5 flex items-center justify-center p-4 relative overflow-hidden">
                  {p.visual === 'grid' && (
                    <div className="grid grid-cols-3 gap-2">
                      <span className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/40" />
                      <span className="w-8 h-8 rounded-lg bg-pink-500/80" />
                      <span className="w-8 h-8 rounded-lg bg-white/10" />
                      <span className="w-8 h-8 rounded-lg bg-white/10" />
                      <span className="w-8 h-8 rounded-lg bg-white/10" />
                      <span className="w-8 h-8 rounded-lg bg-white/10" />
                    </div>
                  )}

                  {p.visual === 'trend' && (
                    <svg viewBox="0 0 160 50" className="w-36 h-12">
                      <path
                        d="M 10 40 Q 40 20 70 30 T 130 15 L 145 10"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeDasharray="4 2"
                      />
                      <circle cx="145" cy="10" r="4" fill="#f43f5e" />
                    </svg>
                  )}

                  {p.visual === 'wave' && (
                    <svg viewBox="0 0 160 50" className="w-36 h-12">
                      <path
                        d="M 10 35 C 50 10, 80 50, 140 15"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="3"
                      />
                      <circle cx="140" cy="15" r="4" fill="#fbbf24" />
                    </svg>
                  )}

                  {p.visual === 'lines' && (
                    <div className="space-y-2 w-32">
                      <div className="h-2 w-24 bg-white/20 rounded-full" />
                      <div className="h-2 w-32 bg-white/30 rounded-full" />
                      <div className="h-2 w-16 bg-white/15 rounded-full" />
                      <span className="inline-block w-3 h-3 rounded-full bg-amber-400 mt-1" />
                    </div>
                  )}

                  {p.visual === 'wireframe' && (
                    <div className="w-36 h-16 rounded-lg bg-black/60 border border-white/10 p-2 flex gap-2">
                      <div className="w-8 h-full bg-pink-500/30 rounded" />
                      <div className="flex-1 space-y-1.5 pt-1">
                        <div className="h-3 w-full bg-amber-500/40 rounded" />
                        <div className="h-3 w-3/4 bg-white/10 rounded" />
                      </div>
                    </div>
                  )}
                </div>
                )}

                <span className="text-[10px] font-mono text-purple-400 block mb-1">
                  {p.typeLabel}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs text-muted leading-relaxed">
                  {p.description}
                </p>
              </div>

              {p.projectUrl ? (
                <div className="pt-6">
                  <a
                    href={p.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#fde047] hover:underline"
                  >
                    Visit live project
                  </a>
                </div>
              ) : p.embedUrl ? (
                <div className="pt-1">
                  <a
                    href={p.embedUrl.replace('/embed', '')}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#fde047] hover:underline"
                  >
                    Open LinkedIn post
                  </a>
                </div>
              ) : (
                <div className="pt-6">
                  <Link to="/contact" className="text-xs font-semibold text-[#fde047] hover:underline">
                    Ask us about this project
                  </Link>
                </div>
              )}
            </TiltCard>
          ))}

          {/* Card: More on the way (Page 8) */}
          <TiltCard className="rounded-3xl bg-[#0b0f1d] border border-dashed border-white/20 p-8 flex flex-col justify-between hover:border-purple-500/40 transition-all shadow-xl min-h-[300px]">
            <div className="space-y-3 pt-4">
              <h3 className="text-xl font-bold text-white tracking-tight">
                More on the way
              </h3>
              <p className="text-xs text-muted leading-relaxed max-w-xs">
                We add new projects as we ship them. Have something in mind for yours?
              </p>
            </div>

            <div className="pt-6">
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-2.5 rounded-full text-xs font-bold text-[#08060d] bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#facc15] hover:opacity-95 transition-all shadow-md"
              >
                Start a project
              </Link>
            </div>
          </TiltCard>
        </div>

      </div>
    </>
  );
}
