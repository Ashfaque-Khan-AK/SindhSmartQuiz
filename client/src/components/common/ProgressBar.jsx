import { cn } from '../../utils/helpers';

const TONES = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  accent: 'bg-accent',
  secondary: 'bg-secondary',
};

export default function ProgressBar({ value = 0, tone = 'primary', className, showLabel = false }) {
  const safe = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-base-content/50">
          <span>{Math.round(safe)}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-base-200">
        <div
          className={cn('h-full rounded-full transition-all duration-500', TONES[tone] || TONES.primary)}
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}
