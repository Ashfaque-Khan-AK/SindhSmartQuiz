import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock3,
  Flame,
  FlaskConical,
  Globe2,
  Landmark,
  Languages,
  Menu,
  MousePointerClick,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  UserPlus,
  X,
  Zap,
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const SUBJECT_PREVIEWS = [
  {
    name: 'Mathematics',
    description: 'Numbers, algebra, patterns and problem solving with step-by-step explanations.',
    icon: Calculator,
    tone: 'bg-primary/10 text-primary',
  },
  {
    name: 'General Science',
    description: 'Living things, matter, energy, the human body and the world around us.',
    icon: FlaskConical,
    tone: 'bg-amber-500/10 text-amber-600',
  },
  {
    name: 'English',
    description: 'Grammar, vocabulary and comprehension skills for confident communication.',
    icon: Languages,
    tone: 'bg-indigo-500/10 text-indigo-600',
  },
  {
    name: 'General Knowledge',
    description: 'Pakistan, Sindh, world geography, science facts and current essentials.',
    icon: Globe2,
    tone: 'bg-sky-500/10 text-sky-600',
  },
];

const GRADE_TONES = [
  { bg: 'from-teal-500 to-emerald-600', ring: 'ring-teal-200' },
  { bg: 'from-sky-500 to-blue-600', ring: 'ring-sky-200' },
  { bg: 'from-indigo-500 to-violet-600', ring: 'ring-indigo-200' },
  { bg: 'from-amber-500 to-orange-600', ring: 'ring-amber-200' },
  { bg: 'from-rose-500 to-pink-600', ring: 'ring-rose-200' },
];

export default function Landing() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardLink = user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';

  const navLinks = [
    { href: '#stream-muqablo', label: t('landing.competitionNav') },
    { href: '#how-it-works', label: t('nav.howItWorks') },
    { href: '#grades', label: t('nav.grades') },
    { href: '#subjects', label: t('nav.subjects') },
    { href: '#features', label: t('nav.features') },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      <div className="bg-emerald-950 text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-1 px-4 py-2 text-center sm:flex-row sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75 sm:text-[11px]">
            <Landmark size={13} className="text-amber-300" /> {t('landing.govLine')}
          </p>
          <p className="text-[11px] font-bold tracking-wide text-amber-200">
            {t('landing.govEvent')}
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-base-200/80 bg-base-100/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-3.5 py-2 text-sm font-medium text-base-content/65 transition hover:bg-base-200 hover:text-base-content"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher />
            {user ? (
              <Link to={dashboardLink} className="btn btn-primary btn-sm gap-1.5">
                {t('nav.dashboard')} <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm gap-1.5">
                  {t('nav.getStarted')} <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square lg:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-base-200 bg-base-100 px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-base-content/70 hover:bg-base-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 flex items-center gap-2">
              <LanguageSwitcher className="flex-1 justify-center" />
              {user ? (
                <Link to={dashboardLink} className="btn btn-primary btn-sm flex-1">
                  {t('nav.dashboard')}
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-ghost btn-sm flex-1">
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm flex-1">
                    {t('nav.getStarted')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="hero-mesh relative overflow-hidden">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:pb-24 lg:pt-20">
            <div>
              <span className="section-label">
                <Sparkles size={14} /> {t('landing.badge')}
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.6rem]">
                {t('landing.title1')}
                <span className="gradient-text"> {t('landing.title2')}</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-base-content/65 sm:text-lg">
                {t('landing.subtitle')}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link to={user ? dashboardLink : '/register'} className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/20">
                  {user ? t('nav.dashboard') : t('landing.startPlaying')} <ArrowRight size={19} />
                </Link>
                <a href="#subjects" className="btn btn-outline btn-lg gap-2 bg-base-100/60">
                  <BookOpen size={19} /> {t('landing.exploreSubjects')}
                </a>
              </div>

              <dl className="mt-9 grid max-w-lg grid-cols-3 gap-4">
                {[
                  { value: '200+', label: t('landing.statQuestions') },
                  { value: '3', label: t('landing.statLanguages') },
                  { value: '6', label: t('landing.statBadges') },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-2xl font-extrabold text-primary">{stat.value}</dt>
                    <dd className="mt-0.5 text-[11px] font-medium leading-tight text-base-content/50">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/15 via-transparent to-secondary/20 blur-2xl" />

              <div className="app-card relative p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
                    Mathematics · Algebra
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-base-200 px-2.5 py-1 text-[11px] font-semibold text-base-content/60">
                    <Clock3 size={12} /> 04:32
                  </span>
                </div>

                <p className="mt-5 text-lg font-bold leading-snug">If 2x + 3 = 11, what is the value of x?</p>

                <div className="mt-5 space-y-2.5">
                  {[
                    { letter: 'A', text: '4', correct: true },
                    { letter: 'B', text: '3' },
                    { letter: 'C', text: '5' },
                    { letter: 'D', text: '7' },
                  ].map((option) => (
                    <div
                      key={option.letter}
                      className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm ${
                        option.correct
                          ? 'border-success/40 bg-success/10 font-semibold text-success'
                          : 'border-base-300 bg-base-100 text-base-content/70'
                      }`}
                    >
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-bold ${
                          option.correct ? 'bg-success text-white' : 'bg-base-200 text-base-content/60'
                        }`}
                      >
                        {option.letter}
                      </span>
                      <span className="flex-1">{option.text}</span>
                      {option.correct && <CheckCircle2 size={17} />}
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-base-content/50">
                    <span>Question 3 of 5</span>
                    <span>60% complete</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-base-200">
                    <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-primary to-teal-400" />
                  </div>
                </div>
              </div>

              <div className="absolute -top-5 end-0 hidden animate-float rounded-2xl bg-base-100 px-4 py-3 shadow-soft ring-1 ring-base-300/70 sm:block">
                <p className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                  <Zap size={14} /> +120 XP
                </p>
                <p className="mt-0.5 text-[10px] text-base-content/50">This quiz</p>
              </div>

              <div className="absolute -bottom-5 start-0 hidden rounded-2xl bg-base-100 px-4 py-3 shadow-soft ring-1 ring-base-300/70 sm:block">
                <p className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
                  <Flame size={14} /> 5-day streak
                </p>
                <p className="mt-0.5 text-[10px] text-base-content/50">Keep it going!</p>
              </div>

              <div className="absolute -bottom-7 end-4 hidden rotate-3 rounded-2xl bg-gradient-to-br from-secondary to-amber-500 px-4 py-3 text-secondary-content shadow-lg sm:block">
                <p className="flex items-center gap-1.5 text-xs font-extrabold">
                  <Trophy size={14} /> Quick Learner
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STREAM Muqablo Journey */}
        <section id="stream-muqablo" className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-800 p-6 text-white shadow-2xl sm:p-10">
            <div className="absolute -end-16 -top-20 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />
            <div className="absolute -bottom-24 start-1/4 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-300/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200 ring-1 ring-amber-200/25">
                <Landmark size={13} /> {t('landing.govLine')}
              </span>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                {t('landing.competitionTitle')}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base">
                {t('landing.competitionSubtitle')}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: Target,
                    title: t('landing.competitionCard1Title'),
                    text: t('landing.competitionCard1Desc'),
                  },
                  {
                    icon: Trophy,
                    title: t('landing.competitionCard2Title'),
                    text: t('landing.competitionCard2Desc'),
                  },
                  {
                    icon: Languages,
                    title: t('landing.competitionCard3Title'),
                    text: t('landing.competitionCard3Desc'),
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-300/15 text-amber-200">
                      <card.icon size={18} />
                    </span>
                    <h3 className="mt-3 text-sm font-bold">{card.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/60">{card.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to={user ? dashboardLink : '/register'}
                  className="btn btn-secondary gap-2 shadow-lg shadow-black/20"
                >
                  {t('landing.competitionCta')} <ArrowRight size={17} />
                </Link>
                <a
                  href="#subjects"
                  className="btn btn-outline gap-2 border-white/30 bg-white/5 text-white hover:border-white/50 hover:bg-white/10"
                >
                  <BookOpen size={16} /> {t('landing.exploreSubjects')}
                </a>
                <p className="text-xs leading-relaxed text-white/50">
                  {t('landing.competitionNote')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-label">{t('nav.howItWorks')}</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{t('landing.howTitle')}</h2>
            <p className="mt-3 text-base text-base-content/60">{t('landing.howSubtitle')}</p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { icon: UserPlus, title: t('landing.step1Title'), text: t('landing.step1Desc'), step: '01' },
              { icon: MousePointerClick, title: t('landing.step2Title'), text: t('landing.step2Desc'), step: '02' },
              { icon: TrendingUp, title: t('landing.step3Title'), text: t('landing.step3Desc'), step: '03' },
            ].map((step) => (
              <div key={step.step} className="app-card group relative p-6 transition hover:-translate-y-1">
                <span className="absolute end-5 top-5 text-3xl font-extrabold text-base-300/70">{step.step}</span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-content">
                  <step.icon size={22} />
                </span>
                <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/60">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Grades */}
        <section id="grades" className="border-y border-base-200 bg-base-200/60">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <span className="section-label">{t('nav.grades')}</span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{t('landing.gradesTitle')}</h2>
              <p className="mt-3 text-base text-base-content/60">{t('landing.gradesSubtitle')}</p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[6, 7, 8, 9, 10].map((grade, index) => (
                <Link
                  key={grade}
                  to={`/register?grade=${grade}`}
                  className="group relative overflow-hidden rounded-2xl bg-base-100 p-5 shadow-soft ring-1 ring-base-300/70 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${GRADE_TONES[index].bg} text-white shadow-md`}>
                    <GraduationCapIcon />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/45">
                    Class
                  </p>
                  <h3 className="text-2xl font-extrabold">
                    {t('common.grade')} {grade}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-base-content/55">
                    Mathematics, Science, English & GK
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">
                    {t('nav.getStarted')} <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Subjects */}
        <section id="subjects" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-label">{t('nav.subjects')}</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{t('landing.subjectsTitle')}</h2>
            <p className="mt-3 text-base text-base-content/60">{t('landing.subjectsSubtitle')}</p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SUBJECT_PREVIEWS.map((subject) => (
              <div key={subject.name} className="app-card flex flex-col p-6 transition hover:-translate-y-1">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${subject.tone}`}>
                  <subject.icon size={23} />
                </span>
                <h3 className="mt-5 text-lg font-bold">{subject.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-base-content/60">{subject.description}</p>
                <Link
                  to="/register"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:gap-2.5"
                >
                  {t('landing.exploreSubjects')} <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-y border-base-200 bg-base-200/60">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <span className="section-label">{t('nav.features')}</span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{t('landing.featuresTitle')}</h2>
              <p className="mt-3 text-base text-base-content/60">{t('landing.featuresSubtitle')}</p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Target, title: t('landing.feature1Title'), text: t('landing.feature1Desc'), tone: 'bg-primary/10 text-primary' },
                { icon: Zap, title: t('landing.feature2Title'), text: t('landing.feature2Desc'), tone: 'bg-amber-500/10 text-amber-600' },
                { icon: Trophy, title: t('landing.feature3Title'), text: t('landing.feature3Desc'), tone: 'bg-indigo-500/10 text-indigo-600' },
                { icon: Languages, title: t('landing.feature4Title'), text: t('landing.feature4Desc'), tone: 'bg-sky-500/10 text-sky-600' },
              ].map((feature) => (
                <div key={feature.title} className="rounded-2xl bg-base-100 p-6 ring-1 ring-base-300/60">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl ${feature.tone}`}>
                    <feature.icon size={21} />
                  </span>
                  <h3 className="mt-4 text-base font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-base-content/60">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-teal-700 to-emerald-800 px-6 py-12 text-primary-content shadow-2xl sm:px-10 lg:px-16 lg:py-16">
            <div className="absolute -end-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 start-1/3 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                  <Star size={13} /> {t('landing.footerTagline')}
                </span>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{t('landing.ctaTitle')}</h2>
                <p className="mt-3 text-base leading-relaxed text-white/80">{t('landing.ctaSubtitle')}</p>
              </div>
              <Link to={user ? dashboardLink : '/register'} className="btn btn-secondary btn-lg shrink-0 gap-2 shadow-xl">
                {user ? t('nav.dashboard') : t('landing.ctaButton')} <ArrowRight size={19} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-base-200 bg-base-100">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <Logo />
              <p className="mt-4 text-sm leading-relaxed text-base-content/55">
                {t('landing.subtitle')}
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                <Landmark size={12} /> {t('landing.govEvent')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-base-content/40">
                  {t('nav.howItWorks')}
                </p>
                <a href="#how-it-works" className="block py-1 text-base-content/60 hover:text-primary">
                  {t('landing.step1Title')}
                </a>
                <a href="#grades" className="block py-1 text-base-content/60 hover:text-primary">
                  {t('nav.grades')}
                </a>
                <a href="#features" className="block py-1 text-base-content/60 hover:text-primary">
                  {t('nav.features')}
                </a>
              </div>
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-base-content/40">
                  {t('nav.subjects')}
                </p>
                {SUBJECT_PREVIEWS.map((subject) => (
                  <p key={subject.name} className="py-1 text-base-content/60">
                    {subject.name}
                  </p>
                ))}
              </div>
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-base-content/40">
                  {t('nav.login')}
                </p>
                <Link to="/login" className="block py-1 text-base-content/60 hover:text-primary">
                  {t('auth.studentLogin')}
                </Link>
                <Link to="/register" className="block py-1 text-base-content/60 hover:text-primary">
                  {t('auth.createAccount')}
                </Link>
                <Link to="/admin/login" className="block py-1 text-base-content/60 hover:text-primary">
                  {t('auth.adminLogin')}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-base-200 pt-6 text-xs text-base-content/45 sm:flex-row">
            <p>© {new Date().getFullYear()} Sindh Smart Quiz. {t('landing.footerRights')}</p>
            <p className="flex items-center gap-1.5">
              <Flame size={13} className="text-secondary" /> {t('landing.footerTagline')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function GraduationCapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}
