import { useCallback, useEffect, useState } from 'react';
import {
  CalendarCheck,
  Flame,
  Lock,
  LockOpen,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import DynamicIcon from '../../components/common/DynamicIcon';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import PageHeader from '../../components/common/PageHeader';
import ProgressBar from '../../components/common/ProgressBar';
import { useLanguage } from '../../context/LanguageContext';
import { studentApi } from '../../services';
import { cn, formatDate } from '../../utils/helpers';

export default function Achievements() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await studentApi.achievements();
      setData(response);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loading full />;

  if (error) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="app-card max-w-md p-6 text-center">
          <p className="font-semibold text-error">{error}</p>
          <button type="button" className="btn btn-primary btn-sm mt-4" onClick={load}>
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  const items = data?.items || [];
  const earnedCount = data?.earnedCount || 0;
  const total = data?.total || 0;
  const percent = total ? Math.round((earnedCount / total) * 100) : 0;
  const snapshot = data?.snapshot || {};

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('nav.achievements')}
        title={t('student.achievementsTitle')}
        subtitle={t('student.achievementsSubtitle')}
      />

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-6 text-white shadow-soft sm:p-8">
        <div className="absolute -end-12 -top-12 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
              <Trophy size={13} /> {t('nav.achievements')}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold">
              {earnedCount} <span className="text-white/60">/ {total}</span>
            </h2>
            <p className="mt-1 text-sm text-white/80">{t('student.achievementsSubtitle')}</p>
            <div className="mt-4 w-full max-w-sm">
              <div className="h-2.5 overflow-hidden rounded-full bg-white/25">
                <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${percent}%` }} />
              </div>
              <p className="mt-1.5 text-[11px] font-semibold text-white/70">{percent}% complete</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              { icon: Target, value: snapshot.quizzes || 0, label: t('student.quizzes') },
              { icon: Zap, value: snapshot.totalXP || 0, label: t('common.xp') },
              { icon: Flame, value: `${snapshot.bestScore || 0}%`, label: t('student.bestScore') },
              { icon: CalendarCheck, value: snapshot.streak || 0, label: t('student.dayStreak') },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/15 p-3 text-center backdrop-blur-sm">
                <item.icon size={15} className="mx-auto text-white/80" />
                <p className="mt-1.5 text-lg font-extrabold leading-none">{item.value}</p>
                <p className="mt-1 text-[10px] font-medium text-white/65">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <EmptyState icon={Trophy} title={t('student.noAchievements')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((achievement) => (
            <article
              key={achievement.id}
              className={cn(
                'relative flex flex-col overflow-hidden rounded-2xl p-5 ring-1 transition',
                achievement.earned
                  ? 'bg-gradient-to-br from-secondary/15 via-base-100 to-base-100 ring-secondary/40 shadow-soft'
                  : 'bg-base-100 ring-base-300/70'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    'grid h-12 w-12 place-items-center rounded-2xl',
                    achievement.earned
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md'
                      : 'bg-base-200 text-base-content/35'
                  )}
                >
                  <DynamicIcon name={achievement.icon} size={23} />
                </span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
                      achievement.earned
                        ? 'bg-success/10 text-success'
                        : 'bg-base-200 text-base-content/45'
                    )}
                  >
                    {achievement.earned ? <LockOpen size={11} /> : <Lock size={11} />}
                    {achievement.earned ? t('student.earned') : t('student.locked')}
                  </span>
                </div>
              </div>

              <h3 className="mt-4 text-base font-extrabold">{achievement.name}</h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-base-content/60">
                {achievement.description}
              </p>

              <div className="mt-4 rounded-xl bg-base-200/70 px-3 py-2">
                <div className="flex items-center justify-between text-[10px] font-semibold text-base-content/50">
                  <span>{achievement.progress?.label || t('student.progress')}</span>
                  <span>
                    {achievement.progress?.current}/{achievement.progress?.target}
                  </span>
                </div>
                <ProgressBar
                  value={achievement.progress?.percent || 0}
                  tone={achievement.earned ? 'success' : 'accent'}
                  className="mt-1.5"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                  <Zap size={12} /> +{achievement.xpReward} XP
                </span>
                {achievement.earned && achievement.earnedAt ? (
                  <span className="text-base-content/45">{formatDate(achievement.earnedAt)}</span>
                ) : (
                  <span className="text-base-content/40">{achievement.progress?.percent || 0}%</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
