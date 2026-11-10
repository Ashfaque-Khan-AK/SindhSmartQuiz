import { Inbox } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-100/60 px-6 py-12 text-center',
        className
      )}
    >
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Icon size={26} />
      </span>
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-base-content/60">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
