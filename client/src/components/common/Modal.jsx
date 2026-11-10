import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-6xl',
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'lg',
}) {
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : 'Dialog'}
        className={cn(
          'relative z-10 flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-base-100 shadow-2xl animate-pop sm:rounded-2xl',
          SIZES[size] || SIZES.lg
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-base-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            {description && <p className="mt-0.5 text-sm text-base-content/60">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-base-200 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
