export function MetricCard({ title, value, helper }: { title: string; value: string | number; helper?: string }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <p className="text-sm text-neutral-400">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      {helper ? <p className="mt-1 text-xs text-neutral-500">{helper}</p> : null}
    </div>
  );
}
