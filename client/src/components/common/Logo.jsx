import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/helpers';

export default function Logo({ to = '/', compact = false, inverted = false, className }) {
  return (
    <Link to={to} className={cn('flex items-center gap-2.5', className)}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary via-teal-600 to-secondary text-primary-content shadow-md">
        <GraduationCap size={22} strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span
            className={cn(
              'block text-[1.05rem] font-extrabold tracking-tight',
              inverted ? 'text-white' : 'text-base-content'
            )}
          >
            Sindh Smart Quiz
          </span>
          <span
            className={cn(
              'block text-[10px] font-semibold uppercase tracking-[0.18em]',
              inverted ? 'text-white/70' : 'text-base-content/45'
            )}
          >
            Learn · Play · Compete
          </span>
        </span>
      )}
    </Link>
  );
}
