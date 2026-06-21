import type { Config } from 'tailwindcss'
const config: Config = {content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./lib/**/*.{ts,tsx}'],theme:{extend:{colors:{ink:'#070812',night:'#0B0D19',panel:'#121528',pink:'#FF75B7',rose:'#FF9ACD',violet:'#9B7CFF',sky:'#73D7FF',mint:'#86F7CE',soft:'#BDC4DA',gold:'#FFD27A'},boxShadow:{glow:'0 0 42px rgba(255, 117, 183, .28)',card:'0 26px 80px rgba(0,0,0,.42)'}}},plugins:[]}
export default config
