'use client'
import { motion } from 'framer-motion'
const symbols=['♡','✦','✧','❀','☾','♡','✦','✧']
export function FloatingDecor({mood}:{mood:string}){return <div className="pointer-events-none absolute inset-0 overflow-hidden">{symbols.map((symbol,index)=><motion.span key={`${symbol}-${index}-${mood}`} className="absolute text-white/20" style={{left:`${8+index*12}%`,top:`${12+(index%4)*18}%`,fontSize:`${22+(index%3)*12}px`}} initial={{opacity:0,y:30,rotate:-10}} animate={{opacity:[0,.75,.20],y:[-10,-46-index*7],rotate:[0,index%2?18:-18]}} transition={{duration:4.8+index*.35,repeat:Infinity,repeatType:'mirror',delay:index*.25,ease:'easeInOut'}}>{symbol}</motion.span>)}</div>}
