import Link from 'next/link'
import clsx from 'clsx'

type Props = {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  type?: 'button' | 'submit'
}

export function Button({ children, href, onClick, variant = 'primary', className, type = 'button' }: Props) {
  const classes = clsx(
    'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition active:scale-[.98]',
    variant === 'primary' && 'bg-gradient-to-r from-pink to-violet text-white shadow-glow',
    variant === 'secondary' && 'bg-white/10 text-white border border-white/15 hover:bg-white/15',
    variant === 'ghost' && 'text-soft hover:text-white',
    className
  )

  if (href) return <Link href={href} className={classes}>{children}</Link>
  return <button type={type} onClick={onClick} className={classes}>{children}</button>
}
