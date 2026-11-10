import { Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Loading({ label, full = false, className = '' }) {
  const { t } = useLanguage();
  const text = label || t('common.loading');

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 text-base-content/60 ${className}`}>
      <Loader2 className="h-7 w-7 animate-spin text-primary" />
      <p className="text-sm font-medium">{text}</p>
    </div>
  );

  if (full) {
    return <div className="grid min-h-[60vh] w-full place-items-center">{content}</div>;
  }

  return <div className="py-10">{content}</div>;
}
