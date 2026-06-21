import clsx from 'clsx'

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx('glass rounded-3xl p-5', className)}>{children}</div>
}
