import { ReactNode } from 'react';

type Props = { tone?: 'neutral' | 'green' | 'red' | 'yellow' | 'blue'; children: ReactNode };

const styles = {
  neutral: 'bg-neutral-800 text-neutral-200 border-neutral-700',
  green: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  red: 'bg-red-500/10 text-red-300 border-red-500/30',
  yellow: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  blue: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
};

export function StatusBadge({ tone = 'neutral', children }: Props) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[tone]}`}>{children}</span>;
}
