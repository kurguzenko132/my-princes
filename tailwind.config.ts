import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080A12',
        panel: '#10131F',
        glass: 'rgba(255,255,255,0.08)',
        line: 'rgba(255,255,255,0.14)',
        soft: '#B8C0D9',
        pink: '#FF79B0',
        violet: '#8B5CF6',
        sky: '#38BDF8',
        mint: '#34D399',
        amber: '#FBBF24',
        danger: '#FB7185'
      },
      boxShadow: {
        glow: '0 0 60px rgba(139, 92, 246, 0.32)',
        card: '0 22px 80px rgba(0,0,0,0.35)'
      },
      backgroundImage: {
        radialsoft: 'radial-gradient(circle at top, rgba(255,121,176,.24), transparent 38%), radial-gradient(circle at 80% 20%, rgba(56,189,248,.20), transparent 34%), linear-gradient(135deg, #080A12, #10131F)'
      }
    }
  },
  plugins: []
}
export default config
