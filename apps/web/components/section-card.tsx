import { ReactNode } from 'react';

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3>
      <div className="text-sm text-neutral-300">{children}</div>
    </section>
  );
}
