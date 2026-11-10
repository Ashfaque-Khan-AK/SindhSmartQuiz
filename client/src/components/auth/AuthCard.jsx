import { Link } from 'react-router-dom';
import { BookOpen, Flame, ShieldCheck, Sparkles, Star, Trophy } from 'lucide-react';
import Logo from '../common/Logo';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useLanguage } from '../../context/LanguageContext';

export default function AuthCard({ title, subtitle, children, footer, variant = 'student' }) {
  const { t } = useLanguage();
  const isAdmin = variant === 'admin';

  return (
    <div className="hero-mesh min-h-screen bg-base-200">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link to="/" className="btn btn-ghost btn-sm hidden sm:inline-flex">
              {t('nav.home')}
            </Link>
          </div>
        </div>

        <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden lg:block">
            <span className="section-label">
              {isAdmin ? <ShieldCheck size={14} /> : <Sparkles size={14} />}
              {isAdmin ? t('admin.panel') : t('landing.badge')}
            </span>
            <h2 className="mt-5 text-4xl font-extrabold leading-[1.15] tracking-tight">
              {isAdmin ? (
                <>
                  Keep the quiz platform
                  <span className="gradient-text"> sharp and ready.</span>
                </>
              ) : (
                <>
                  {t('landing.title1')}
                  <span className="gradient-text"> {t('landing.title2')}</span>
                </>
              )}
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-base-content/65">
              {isAdmin
                ? 'Manage grades, subjects, topics and trilingual questions. Track participation, performance and the hardest topics across every grade.'
                : t('landing.subtitle')}
            </p>

            <div className="mt-8 grid max-w-lg gap-3">
              {(isAdmin
                ? [
                    { icon: BookOpen, text: 'Create and publish questions in English, Urdu and Sindhi.' },
                    { icon: Trophy, text: 'Monitor quiz attempts, leaderboards and reports.' },
                    { icon: ShieldCheck, text: 'Role-protected access for administrators only.' },
                  ]
                : [
                    { icon: Flame, text: 'Earn 10 XP for every correct answer plus completion bonuses.' },
                    { icon: Trophy, text: 'Unlock six achievement badges and climb the leaderboard.' },
                    { icon: Star, text: 'Practise in English, Urdu or Sindhi at your own pace.' },
                  ]
              ).map((item) => (
                <div key={item.text} className="app-card flex items-center gap-3 p-3.5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <item.icon size={18} />
                  </span>
                  <p className="text-sm font-medium text-base-content/75">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="w-full justify-self-center lg:justify-self-end">
            <div className="mx-auto w-full max-w-md rounded-3xl bg-base-100 p-6 shadow-soft ring-1 ring-base-300/80 sm:p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
                {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-base-content/60">{subtitle}</p>}
              </div>
              {children}
            </div>
            {footer && <div className="mx-auto mt-4 max-w-md text-center text-sm">{footer}</div>}
          </section>
        </div>

        <p className="pb-2 text-center text-[11px] text-base-content/45">
          © {new Date().getFullYear()} Sindh Smart Quiz · {t('landing.footerTagline')}
        </p>
      </div>
    </div>
  );
}
