import { cn } from '../../utils/helpers';

const TONES = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/15 text-amber-600',
  accent: 'bg-accent/10 text-accent',
  info: 'bg-info/10 text-info',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-amber-600',
  error: 'bg-error/10 text-error',
  neutral: 'bg-base-200 text-base-content/70',
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'primary',
  className,
}) {
  return (
    <div className={cn('app-card p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">{label}</p>
          <p className="mt-2 text-2xl font-extrabold leading-tight text-base-content">{value}</p>
          {hint && <p className="mt-1 text-xs text-base-content/50">{hint}</p>}
        </div>
        {Icon && (
          <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl', TONES[tone] || TONES.primary)}>
            <Icon size={20} />
          </span>
        )}
      </div>
    </div>
  );
}
