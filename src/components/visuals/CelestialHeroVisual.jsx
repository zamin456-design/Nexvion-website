export default function CelestialHeroVisual() {
  return (
    <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center select-none pointer-events-none">
      
      {/* Background ambient flares */}
      {/* 1. Golden glow on bottom-left */}
      <div className="absolute -left-12 bottom-12 w-64 h-64 bg-amber-500/30 rounded-full blur-[80px]" />
      
      {/* 2. Purple glow on top-right */}
      <div className="absolute -right-8 -top-8 w-64 h-64 bg-fuchsia-600/30 rounded-full blur-[90px]" />
      
      {/* 3. Deep center ambient glow */}
      <div className="absolute inset-10 bg-indigo-900/20 rounded-full blur-[60px]" />

      {/* SVG Container for the circle, gradients, and laser beam */}
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full relative z-10 overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Circular Perimeter Gradient */}
          <linearGradient id="circleStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />     {/* Pink/Coral top */}
            <stop offset="30%" stopColor="#ec4899" />    {/* Magenta */}
            <stop offset="60%" stopColor="#8b5cf6" />    {/* Purple */}
            <stop offset="85%" stopColor="#06b6d4" />    {/* Cyan */}
            <stop offset="100%" stopColor="#facc15" />   {/* Yellow bottom-right */}
          </linearGradient>

          {/* Deep Inner Celestial Gradient */}
          <radialGradient id="planetBodyGrad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#2e2168" />
            <stop offset="40%" stopColor="#1e1548" />
            <stop offset="75%" stopColor="#120c30" />
            <stop offset="100%" stopColor="#09081a" />
          </radialGradient>

          {/* Diagonal Laser Beam Gradient */}
          <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
            <stop offset="15%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#fde047" stopOpacity="1" />
            <stop offset="48%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="70%" stopColor="#c084fc" stopOpacity="0.9" />
            <stop offset="88%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7e22ce" stopOpacity="0" />
          </linearGradient>

          {/* Golden Wide Flare at bottom-left */}
          <linearGradient id="goldenFlareGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0" />
            <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.7" />
            <stop offset="75%" stopColor="#fde047" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          {/* Violet Wide Flare at top-right */}
          <linearGradient id="violetFlareGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#c084fc" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#9333ea" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#581c87" stopOpacity="0" />
          </linearGradient>

          {/* Blur Filters */}
          <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="wideBeamGlow" x="-50%" y="-150%" width="200%" height="400%">
            <feGaussianBlur stdDeviation="16" />
          </filter>

          <filter id="intenseBeamGlow" x="-50%" y="-150%" width="200%" height="400%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* 1. Main Celestial Circle */}
        <circle
          cx="280"
          cy="250"
          r="165"
          fill="url(#planetBodyGrad)"
          stroke="url(#circleStrokeGrad)"
          strokeWidth="3.5"
          filter="url(#softGlow)"
        />

        {/* Inner subtle rim shadow overlay */}
        <circle
          cx="280"
          cy="250"
          r="163"
          fill="none"
          stroke="rgba(0,0,0,0.5)"
          strokeWidth="6"
        />

        {/* 2. Diagonal Laser Beam / Light Streak */}
        {/* We rotate the entire beam group across the circle diagonally (around -24deg) */}
        <g transform="translate(280, 250) rotate(-26) translate(-280, -250)">
          
          {/* Wide Golden Flare on bottom-left */}
          <path
            d="M 50 250 L 220 230 L 220 270 Z"
            fill="url(#goldenFlareGrad)"
            opacity="0.65"
            filter="url(#wideBeamGlow)"
          />

          {/* Wide Violet Flare on top-right */}
          <path
            d="M 330 235 L 500 215 L 500 285 L 330 265 Z"
            fill="url(#violetFlareGrad)"
            opacity="0.6"
            filter="url(#wideBeamGlow)"
          />

          {/* Medium diffused beam glow */}
          <rect
            x="40"
            y="244"
            width="450"
            height="12"
            rx="6"
            fill="url(#laserBeamGrad)"
            opacity="0.8"
            filter="url(#intenseBeamGlow)"
          />

          {/* Intense narrow beam */}
          <rect
            x="60"
            y="248"
            width="420"
            height="4"
            rx="2"
            fill="url(#laserBeamGrad)"
            filter="url(#softGlow)"
          />

          {/* Center White-Hot Core Laser Line */}
          <line
            x1="80"
            y1="250"
            x2="450"
            y2="250"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Concentrated light burst on the perimeter intersection */}
          <circle
            cx="116"
            cy="250"
            r="12"
            fill="#fde047"
            opacity="0.7"
            filter="url(#intenseBeamGlow)"
          />
          <circle
            cx="444"
            cy="250"
            r="10"
            fill="#c084fc"
            opacity="0.6"
            filter="url(#intenseBeamGlow)"
          />
        </g>
      </svg>
    </div>
  );
}
