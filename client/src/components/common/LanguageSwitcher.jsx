import { Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/helpers';

export default function LanguageSwitcher({ className, tone = 'default' }) {
  const { language, setLanguage, languages } = useLanguage();

  return (
    <label
      className={cn(
        'flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-sm',
        tone === 'inverted'
          ? 'border-white/25 bg-white/10 text-white'
          : 'border-base-300 bg-base-100 text-base-content',
        className
      )}
      title="Language / زبان / ٻولي"
    >
      <Languages size={15} className={tone === 'inverted' ? 'text-white/80' : 'text-base-content/50'} />
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className={cn(
          'cursor-pointer bg-transparent pe-1 text-sm font-semibold focus:outline-none',
          tone === 'inverted' ? 'text-white' : 'text-base-content'
        )}
        aria-label="Select language"
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code} className="text-base-content">
            {item.native}
          </option>
        ))}
      </select>
    </label>
  );
}
