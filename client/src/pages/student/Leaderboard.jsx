import { useCallback, useEffect, useState } from 'react';
import { Crown, Flame, Medal, Target, Trophy, Zap } from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { studentApi } from '../../services';
import { cn } from '../../utils/helpers';

const PODIUM_STYLES = {
  1: {
    card: 'bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950 ring-amber-300',
    chip: 'bg-amber-950/15',
    order: 'sm:order-2',
    icon: Crown,
    height: 'sm:pt-3',
  },
  2: {
    card: 'bg-gradient-to-b from-slate-300 to-slate-500 text-slate-900 ring-slate-300',
    chip: 'bg-slate-900/10',
    order: 'sm:order-1',
    icon: Medal,
    height: 'sm:mt-8',
  },
  3: {
    card: 'bg-gradient-to-b from-orange-300 to-orange-500 text-orange-950 ring-orange-300',
    chip: 'bg-orange-950/10',
    order: 'sm:order-3',
    icon: Medal,
    height: 'sm:mt-12',
  },
};

export default function Leaderboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [scope, setScope] = useState('overall');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = scope === 'myGrade' && user?.grade ? { grade: user.grade } : {};
      const response = await studentApi.leaderboard(params);
      setData(response);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [scope, user?.grade, t]);

  useEffect(() => {
    load();
  }, [load]);

  const items = data?.items || [];
  const me = data?.me;
  const podium = items.slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('nav.leaderboard')}
        title={t('nav.leaderboard')}
        subtitle={t('student.leaderboardSubtitle')}
      >
        <div className="flex rounded-xl bg-base-100 p-1 ring-1 ring-base-300/70">
          {[
            { key: 'overall', label: t('student.overall') },
            { key: 'myGrade', label: t('student.myGrade') },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setScope(tab.key)}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-xs font-bold transition',
                scope === tab.key ? 'bg-primary text-primary-content shadow-sm' : 'text-base-content/60 hover:text-base-content'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </PageHeader>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="app-card p-6 text-center">
          <p className="font-semibold text-error">{error}</p>
          <button type="button" className="btn btn-primary btn-sm mt-4" onClick={load}>
            {t('common.retry')}
          </button>
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={Trophy} title={t('student.noLeaderboard')} description={t('student.leaderboardEmpty')} />
      ) : (
        <>
          {me && (
            <section className="app-card flex flex-wrap items-center gap-4 border-s-4 border-s-primary p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-lg font-extrabold text-primary">
                  {me.rank ? `#${me.rank}` : '—'}
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/45">
                    {t('student.yourRank')}
                  </p>
                  <p className="text-sm font-bold">{me.name}</p>
                </div>
              </div>
              <div className="ms-auto flex flex-wrap items-center gap-4 text-sm">
                <span className="inline-flex items-center gap-1.5 font-bold text-amber-600">
                  <Zap size={15} /> {me.totalXP} XP
                </span>
                <span className="inline-flex items-center gap-1.5 text-base-content/60">
                  <Target size={15} /> {me.averageScore}% {t('common.average').toLowerCase()}
                </span>
                <span className="inline-flex items-center gap-1.5 text-base-content/60">
                  <Flame size={15} /> {me.quizzes} {t('student.quizzes').toLowerCase()}
                </span>
              </div>
            </section>
          )}

          <section className="grid items-end gap-3 sm:grid-cols-3">
            {[podium[1], podium[0], podium[2]].filter(Boolean).map((entry) => {
              const style = PODIUM_STYLES[entry.rank];
              const Icon = style.icon;
              return (
                <div
                  key={entry.studentId}
                  className={cn(
                    'relative flex flex-col items-center rounded-3xl p-5 text-center shadow-soft ring-1 transition',
                    style.card,
                    style.order,
                    style.height,
                    entry.isMe && 'outline outline-2 outline-offset-2 outline-primary'
                  )}
                >
                  <span className={cn('mb-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold', style.chip)}>
                    <Icon size={13} /> #{entry.rank}
                  </span>
                  <Avatar name={entry.name} size={entry.rank === 1 ? 'lg' : 'md'} className="ring-white/60" />
                  <p className="mt-2 max-w-full truncate text-sm font-extrabold">{entry.name}</p>
                  <p className="text-[11px] font-semibold opacity-70">
                    {t('common.grade')} {entry.grade || '—'}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/40 px-3 py-1 text-sm font-extrabold">
                    <Zap size={14} /> {entry.totalXP} XP
                  </p>
                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide opacity-60">
                    {entry.quizzes} {t('student.quizzes').toLowerCase()} · {entry.averageScore}% {t('common.average').toLowerCase()}
                  </p>
                </div>
              );
            })}
          </section>

          <section className="app-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="app-table">
                <thead>
                  <tr>
                    <th className="w-16">{t('common.rank')}</th>
                    <th>{t('student.student')}</th>
                    <th className="hidden sm:table-cell">{t('common.grade')}</th>
                    <th className="text-end">{t('student.quizzes')}</th>
                    <th className="text-end">{t('common.average')}</th>
                    <th className="text-end">{t('common.xp')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((entry) => (
                    <tr key={entry.studentId} className={cn(entry.isMe && 'bg-primary/5')}>
                      <td>
                        <span
                          className={cn(
                            'grid h-8 w-8 place-items-center rounded-lg text-xs font-extrabold',
                            entry.rank === 1
                              ? 'bg-amber-400 text-amber-950'
                              : entry.rank === 2
                                ? 'bg-slate-300 text-slate-800'
                                : entry.rank === 3
                                  ? 'bg-orange-300 text-orange-900'
                                  : 'bg-base-200 text-base-content/60'
                          )}
                        >
                          {entry.rank}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={entry.name} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold">
                              {entry.name}
                              {entry.isMe && (
                                <span className="ms-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary">
                                  {t('nav.profile')}
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-base-content/45 sm:hidden">
                              {t('common.grade')} {entry.grade || '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell">{entry.grade ? `${t('common.grade')} ${entry.grade}` : '—'}</td>
                      <td className="text-end font-semibold">{entry.quizzes}</td>
                      <td className="text-end">
                        <span className="font-semibold">{entry.averageScore}%</span>
                      </td>
                      <td className="text-end font-extrabold text-amber-600">{entry.totalXP}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
