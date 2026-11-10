import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { adminApi } from '../../services';
import { cn, formatDate, formatDateTime } from '../../utils/helpers';

export default function AdminStudents() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({ search: '', grade: '', status: '' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.students({
        page,
        limit: 10,
        search: filters.search || undefined,
        grade: filters.grade || undefined,
        status: filters.status || undefined,
      });
      setData(response);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [page, filters, t]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  const setFilter = (field, value) => {
    setPage(1);
    setFilters((previous) => ({ ...previous, [field]: value }));
  };

  const toggleStatus = async (student) => {
    const action = student.isActive ? t('admin.deactivate') : t('admin.activate');
    if (!window.confirm(`${action} ${student.name}?`)) return;

    try {
      await adminApi.setStudentStatus(student.id, !student.isActive);
      toast.success(student.isActive ? t('admin.studentDeactivated') : t('admin.studentActivated'));
      setData((previous) => ({
        ...previous,
        items: previous.items.map((item) =>
          item.id === student.id ? { ...item, isActive: !item.isActive } : item
        ),
      }));
      setSelected((previous) =>
        previous?.id === student.id ? { ...previous, isActive: !previous.isActive } : previous
      );
    } catch (err) {
      toast.error(err.message || t('common.error'));
    }
  };

  const items = data?.items || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('admin.panel')}
        title={t('admin.manageStudents')}
        subtitle={t('admin.studentsSubtitle')}
      >
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2 text-xs font-bold text-primary">
          <Users size={14} /> {pagination.total} {t('common.students')}
        </span>
      </PageHeader>

      <div className="app-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-base-content/35" size={16} />
          <input
            className="app-input ps-9"
            placeholder={t('admin.searchStudents')}
            value={filters.search}
            onChange={(event) => setFilter('search', event.target.value)}
          />
        </label>

        <select className="app-select sm:w-40" value={filters.grade} onChange={(event) => setFilter('grade', event.target.value)}>
          <option value="">{t('admin.allGrades')}</option>
          {[6, 7, 8, 9, 10].map((grade) => (
            <option key={grade} value={grade}>
              {t('common.grade')} {grade}
            </option>
          ))}
        </select>

        <select className="app-select sm:w-40" value={filters.status} onChange={(event) => setFilter('status', event.target.value)}>
          <option value="">{t('common.all')}</option>
          <option value="active">{t('common.active')}</option>
          <option value="inactive">{t('common.inactive')}</option>
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
        <EmptyState icon={Users} title={t('admin.noStudents')} description={t('admin.studentsEmpty')} />
      ) : (
        <>
          <section className="app-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>{t('common.name')}</th>
                    <th>{t('common.grade')}</th>
                    <th className="text-end">{t('common.xp')}</th>
                    <th className="text-end">{t('student.quizzes')}</th>
                    <th className="text-end">{t('admin.avgScore')}</th>
                    <th>{t('common.status')}</th>
                    <th className="text-end">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={student.name} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{student.name}</p>
                            <p className="truncate text-[11px] text-base-content/45">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap">{student.grade ? `${t('common.grade')} ${student.grade}` : '—'}</td>
                      <td className="text-end font-bold text-amber-600">{student.totalXP}</td>
                      <td className="text-end">{student.quizzes}</td>
                      <td className="text-end">
                        <span className="font-semibold">{student.averageScore}%</span>
                      </td>
                      <td>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide',
                            student.isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                          )}
                        >
                          {student.isActive ? <CheckCircle2 size={11} /> : <UserX size={11} />}
                          {student.isActive ? t('common.active') : t('common.inactive')}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelected(student)}
                            className="btn btn-ghost btn-xs gap-1"
                            title={t('common.view')}
                          >
                            <Eye size={13} /> <span className="hidden md:inline">{t('common.view')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleStatus(student)}
                            className={cn('btn btn-xs gap-1', student.isActive ? 'btn-ghost text-error' : 'btn-ghost text-success')}
                          >
                            {student.isActive ? <UserX size={13} /> : <UserCheck size={13} />}
                            <span className="hidden md:inline">
                              {student.isActive ? t('admin.deactivate') : t('admin.activate')}
                            </span>
                          </button>
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
              {t('common.students').toLowerCase()}
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

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.name || t('student.student')}
        description={selected?.email}
        size="md"
        footer={
          <>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>
              {t('common.close')}
            </button>
            {selected && (
              <button
                type="button"
                className={cn('btn btn-sm gap-1.5', selected.isActive ? 'btn-error' : 'btn-success')}
                onClick={() => toggleStatus(selected)}
              >
                {selected.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                {selected.isActive ? t('admin.deactivate') : t('admin.activate')}
              </button>
            )}
          </>
        }
      >
        {selected && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-base-200/70 p-4">
              <Avatar name={selected.name} size="lg" />
              <div>
                <p className="font-bold">{selected.name}</p>
                <p className="text-xs text-base-content/55">{selected.email}</p>
                <p className="mt-1 text-[11px] font-semibold text-primary">
                  {t('common.grade')} {selected.grade || '—'} · {selected.language?.toUpperCase()}
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-2 text-sm">
              {[
                [t('common.xp'), selected.totalXP],
                [t('student.quizzes'), selected.quizzes],
                [t('admin.avgScore'), `${selected.averageScore}%`],
                [t('common.status'), selected.isActive ? t('common.active') : t('common.inactive')],
                [t('student.memberSince'), formatDate(selected.createdAt)],
                ['Last login', selected.lastLoginAt ? formatDateTime(selected.lastLoginAt) : '—'],
                ['Last attempt', selected.lastAttemptAt ? formatDate(selected.lastAttemptAt) : '—'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-base-100 p-3 ring-1 ring-base-200">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-base-content/45">{label}</dt>
                  <dd className="mt-0.5 font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
