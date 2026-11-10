import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Search,
  Target,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { useLanguage } from '../../context/LanguageContext';
import { adminApi } from '../../services';
import { cn, formatDateTime, formatDuration } from '../../utils/helpers';

export default function AdminAttempts() {
  const { t } = useLanguage();
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({ search: '', grade: '', subjectId: '' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .subjects()
      .then((response) => setSubjects(response || []))
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.attempts({
        page,
        limit: 10,
        search: filters.search || undefined,
        grade: filters.grade || undefined,
        subjectId: filters.subjectId || undefined,
      });
      setData(response);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [filters, page, t]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  const setFilter = (field, value) => {
    setPage(1);
    setFilters((previous) => ({ ...previous, [field]: value }));
  };

  const items = data?.items || [];
  const summary = data?.summary || {};
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };
  const accuracy = summary.totalQuestions
    ? Math.round((summary.correctAnswers / summary.totalQuestions) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('admin.panel')}
        title={t('admin.attempts')}
        subtitle={t('admin.attemptsSubtitle')}
      >
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2 text-xs font-bold text-primary">
          <ClipboardList size={14} /> {pagination.total} {t('common.attempts')}
        </span>
      </PageHeader>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Target} label={t('admin.averageScore')} value={`${summary.averageScore || 0}%`} tone="primary" />
        <StatCard icon={CheckCircle2} label={t('common.correct')} value={summary.correctAnswers || 0} tone="success" />
        <StatCard icon={ClipboardList} label={t('common.questions')} value={summary.totalQuestions || 0} tone="accent" />
        <StatCard icon={Target} label={t('admin.accuracy')} value={`${accuracy}%`} tone="warning" />
      </section>

      <div className="app-card flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-base-content/35" size={16} />
          <input
            className="app-input ps-9"
            placeholder={`${t('common.search')} ${t('admin.manageStudents').toLowerCase()}…`}
            value={filters.search}
            onChange={(event) => setFilter('search', event.target.value)}
          />
        </label>

        <select className="app-select lg:w-40" value={filters.grade} onChange={(event) => setFilter('grade', event.target.value)}>
          <option value="">{t('admin.allGrades')}</option>
          {[6, 7, 8, 9, 10].map((grade) => (
            <option key={grade} value={grade}>
              {t('common.grade')} {grade}
            </option>
          ))}
        </select>

        <select className="app-select lg:w-52" value={filters.subjectId} onChange={(event) => setFilter('subjectId', event.target.value)}>
          <option value="">{t('admin.allSubjects')}</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

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
        <EmptyState icon={ClipboardList} title={t('admin.noAttempts')} description={t('admin.attemptsEmpty')} />
      ) : (
        <>
          <section className="app-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>{t('student.student')}</th>
                    <th className="hidden sm:table-cell">{t('common.grade')}</th>
                    <th>{t('common.subject')}</th>
                    <th className="text-end">{t('common.score')}</th>
                    <th className="text-end">{t('common.percentage')}</th>
                    <th className="hidden lg:table-cell text-end">{t('common.time')}</th>
                    <th className="hidden md:table-cell">{t('common.date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((attempt) => (
                    <tr key={attempt.id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={attempt.student?.name || 'Unknown'} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{attempt.student?.name || 'Unknown'}</p>
                            <p className="truncate text-[11px] text-base-content/45">{attempt.student?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden whitespace-nowrap sm:table-cell">
                        {attempt.grade ? `${t('common.grade')} ${attempt.grade}` : '—'}
                      </td>
                      <td>
                        <p className="whitespace-nowrap font-medium">{attempt.subject}</p>
                        <p className="truncate text-[11px] text-base-content/45">{attempt.topic}</p>
                      </td>
                      <td className="text-end font-semibold">
                        {attempt.score}/{attempt.totalQuestions}
                      </td>
                      <td className="text-end">
                        <span
                          className={cn(
                            'badge badge-sm font-bold badge-outline',
                            attempt.percentage >= 80
                              ? 'badge-success'
                              : attempt.percentage >= 50
                                ? 'badge-warning'
                                : 'badge-error'
                          )}
                        >
                          {attempt.percentage}%
                        </span>
                      </td>
                      <td className="hidden text-end text-xs text-base-content/55 lg:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={12} /> {formatDuration(attempt.timeTaken)}
                        </span>
                      </td>
                      <td className="hidden whitespace-nowrap text-xs text-base-content/55 md:table-cell">
                        {formatDateTime(attempt.submittedAt)}
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
              <button type="button" className="btn btn-outline btn-sm gap-1" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={pagination.page <= 1}>
                <ChevronLeft size={15} /> {t('common.previous')}
              </button>
              <button type="button" className="btn btn-outline btn-sm gap-1" onClick={() => setPage((value) => Math.min(pagination.pages, value + 1))} disabled={pagination.page >= pagination.pages}>
                {t('common.next')} <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
