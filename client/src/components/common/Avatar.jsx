import { cn, initials } from '../../utils/helpers';

const SIZES = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-24 w-24 text-3xl',
};

const PALETTES = [
  'from-teal-500 to-emerald-600',
  'from-amber-500 to-orange-600',
  'from-indigo-500 to-violet-600',
  'from-sky-500 to-blue-600',
  'from-rose-500 to-pink-600',
];

export default function Avatar({ name = '', src, size = 'md', className }) {
  const index = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % PALETTES.length;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('shrink-0 rounded-full object-cover ring-2 ring-base-100', SIZES[size], className)}
      />
    );
  }

  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-extrabold text-white ring-2 ring-base-100',
        PALETTES[index],
        SIZES[size],
        className
      )}
      aria-hidden="true"
    >
      {initials(name) || '?'}
    </span>
  );
}
