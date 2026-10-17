/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#05070f',
        'bg-card': '#0b0f19',
        'bg-card-hover': '#111726',
        'border-glass': 'rgba(255, 255, 255, 0.08)',
        muted: '#94a3b8',
        'muted-dark': '#64748b',
        'accent-pink': '#ec4899',
        'accent-cyan': '#06b6d4',
        'accent-purple': '#8b5cf6',
        'accent-blue': '#3b82f6',
        'accent-emerald': '#10b981',
      },
      maxWidth: {
        content: '1280px',
      },
      borderRadius: {
        card: '20px',
      },
      fontFamily: {
        sans: ['"Outfit"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 35s linear infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite alternate',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        glow: {
          '0%': { opacity: 0.35, filter: 'blur(40px)' },
          '100%': { opacity: 0.7, filter: 'blur(60px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.18) 0%, rgba(6, 182, 212, 0.12) 35%, rgba(5, 7, 15, 0) 70%)',
      },
    },
  },
  plugins: [],
}
