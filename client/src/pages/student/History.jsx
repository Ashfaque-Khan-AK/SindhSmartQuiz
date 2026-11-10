import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  History as HistoryIcon,
  PlayCircle,
  RotateCcw,
  Zap,
} from 'lucide-react';
import DynamicIcon from '../../components/common/DynamicIcon';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import PageHeader from '../../components/common/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { studentApi } from '../../services';
import { cn, formatDate, formatDuration } from '../../utils/helpers';

export default function History() {
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await studentApi.history({ page, limit: 10 });
      setData(response);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [page, t]);

  useEffect(() => {
    load();
  }, [load]);

  const items = data?.items || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('nav.history')}
        title={t('student.historyTitle')}
        subtitle={t('student.historySubtitle')}
      >
        <Link to="/student/subjects" className="btn btn-primary btn-sm gap-1.5">
          <PlayCircle size={15} /> {t('student.startQuiz')}
        </Link>
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
        <EmptyState
          icon={HistoryIcon}
          title={t('student.noHistory')}
          description={t('student.takeFirst')}
          action={
            <Link to="/student/subjects" className="btn btn-primary btn-sm">
              {t('student.startQuiz')}
            </Link>
          }
        />
      ) : (
        <>
          <section className="app-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>{t('common.date')}</th>
                    <th>{t('common.subject')}</th>
                    <th className="text-end">{t('common.score')}</th>
                    <th className="text-end">{t('common.percentage')}</th>
                    <th className="hidden text-end md:table-cell">{t('common.xp')}</th>
                    <th className="hidden text-end lg:table-cell">{t('common.time')}</th>
                    <th className="text-end">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((attempt) => (
                    <tr key={attempt.id}>
                      <td className="whitespace-nowrap text-xs text-base-content/60">
                        {formatDate(attempt.submittedAt)}
                      </td>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                            <DynamicIcon name={attempt.subject?.icon} size={17} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{attempt.subject?.name || '—'}</p>
                            <p className="truncate text-[11px] text-base-content/45">
                              {attempt.topic?.name || t('student.practiseWhole')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-end font-semibold">
                        {attempt.score}/{attempt.totalQuestions}
                      </td>
                      <td className="text-end">
                        <span
                          className={cn(
                            'badge badge-sm font-bold',
                            attempt.percentage >= 80
                              ? 'badge-success'
                              : attempt.percentage >= 50
                                ? 'badge-warning'
                                : 'badge-error',
                            'badge-outline'
                          )}
                        >
                          {attempt.percentage}%
                        </span>
                      </td>
                      <td className="hidden text-end font-bold text-amber-600 md:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <Zap size={13} /> {attempt.xpEarned}
                        </span>
                      </td>
                      <td className="hidden text-end text-xs text-base-content/55 lg:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={13} /> {formatDuration(attempt.timeTaken)}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/student/result/${attempt.id}`}
                            className="btn btn-ghost btn-xs gap-1"
                            title={t('student.viewResult')}
                          >
                            <Eye size={13} /> <span className="hidden sm:inline">{t('student.viewResult')}</span>
                          </Link>
                          <Link
                            to={`/student/review/${attempt.id}`}
                            className="btn btn-ghost btn-xs gap-1"
                            title={t('student.review')}
                          >
                            <RotateCcw size={13} /> <span className="hidden sm:inline">{t('student.review')}</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-base-content/55">
              {t('common.page')} {pagination.page} {t('common.of')} {pagination.pages} · {pagination.total}{' '}
              {t('common.attempts').toLowerCase()}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-outline btn-sm gap-1"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft size={15} /> {t('common.previous')}
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm gap-1"
                onClick={() => setPage((value) => Math.min(pagination.pages, value + 1))}
                disabled={pagination.page >= pagination.pages}
              >
                {t('common.next')} <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
