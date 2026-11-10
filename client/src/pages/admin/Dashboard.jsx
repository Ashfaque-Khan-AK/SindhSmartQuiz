import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  ListTree,
  Target,
  Users,
} from 'lucide-react';
import Loading from '../../components/common/Loading';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { useLanguage } from '../../context/LanguageContext';
import { adminApi } from '../../services';
import { formatDate } from '../../utils/helpers';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.dashboard();
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

  const stats = data?.stats || {};
  const charts = data?.charts || {};
  const attempts = (charts.attemptsOverTime || []).map((row) => ({
    ...row,
    label: new Date(`${row.date}T00:00:00`).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    }),
  }));

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={t('admin.panel')}
        title={t('admin.platformOverview')}
        subtitle={t('admin.welcome')}
      >
        <Link to="/admin/reports" className="btn btn-outline btn-sm gap-1.5">
          <Target size={15} /> {t('admin.reports')}
        </Link>
        <Link to="/admin/questions" className="btn btn-primary btn-sm gap-1.5">
          <HelpCircle size={15} /> {t('admin.manageQuestions')}
        </Link>
      </PageHeader>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 p-6 text-white shadow-soft sm:p-8">
        <div className="absolute -end-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
              <GraduationCap size={13} /> {t('landing.footerTagline')}
            </p>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">{t('admin.welcome')}</h2>
            <p className="mt-2 max-w-xl text-sm text-white/65">
              {stats.totalStudents || 0} students · {stats.totalQuestions || 0} questions ·{' '}
              {stats.totalAttempts || 0} quiz attempts
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/students" className="btn btn-sm border border-white/20 bg-white/10 text-white hover:bg-white/20">
              <Users size={15} /> {t('admin.manageStudents')}
            </Link>
            <Link to="/admin/attempts" className="btn btn-secondary btn-sm">
              <ClipboardList size={15} /> {t('admin.attempts')}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label={t('admin.totalStudents')} value={stats.totalStudents || 0} hint={`${stats.activeStudents || 0} ${t('common.active').toLowerCase()}`} tone="primary" />
        <StatCard icon={BookMarked} label={t('admin.totalSubjects')} value={stats.totalSubjects || 0} tone="accent" />
        <StatCard icon={ListTree} label={t('admin.totalTopics')} value={stats.totalTopics || 0} tone="info" />
        <StatCard icon={HelpCircle} label={t('admin.totalQuestions')} value={stats.totalQuestions || 0} tone="secondary" />
        <StatCard icon={ClipboardList} label={t('admin.totalAttempts')} value={stats.totalAttempts || 0} tone="success" />
        <StatCard icon={Target} label={t('admin.averageScore')} value={`${stats.averageScore || 0}%`} tone="warning" />
        <StatCard icon={BookOpen} label={t('admin.subjectWise')} value={(charts.subjectParticipation || []).length} tone="neutral" />
        <StatCard icon={GraduationCap} label={t('admin.gradeWise')} value={(charts.gradePerformance || []).length} tone="primary" />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <section className="app-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold">{t('admin.attemptsOverTime')}</h2>
              <p className="text-xs text-base-content/50">Last 14 days of submitted quizzes</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
              {stats.totalAttempts || 0} total
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attempts} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="attemptFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f766e" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0f766e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} interval={1} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                  labelStyle={{ fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="attempts" stroke="#0f766e" strokeWidth={2.5} fill="url(#attemptFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="app-card p-5">
          <div className="mb-4">
            <h2 className="font-bold">{t('admin.subjectParticipation')}</h2>
            <p className="text-xs text-base-content/50">{t('admin.attemptsPerSubject')}</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.subjectParticipation || []} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} tickLine={false} axisLine={false} interval={0} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="attempts" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="app-card p-5">
          <div className="mb-4">
            <h2 className="font-bold">{t('admin.studentPerformance')}</h2>
            <p className="text-xs text-base-content/50">{t('admin.averagePerGrade')}</p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.gradePerformance || []} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="average" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={46} name="Average %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="app-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">{t('admin.recentAttempts')}</h2>
            <Link to="/admin/attempts" className="text-xs font-semibold text-primary hover:underline">
              {t('common.view')} →
            </Link>
          </div>

          {data?.recentAttempts?.length ? (
            <div className="divide-y divide-base-200">
              {data.recentAttempts.map((attempt) => (
                <div key={attempt.id} className="flex items-center gap-3 py-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-base-200 text-base-content/55">
                    <BookOpen size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{attempt.student}</p>
                    <p className="truncate text-[11px] text-base-content/50">
                      {attempt.subject} · {formatDate(attempt.submittedAt)}
                    </p>
                  </div>
                  <span className={`badge badge-sm font-bold ${attempt.percentage >= 80 ? 'badge-success' : attempt.percentage >= 50 ? 'badge-warning' : 'badge-error'} badge-outline`}>
                    {attempt.percentage}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-base-content/50">{t('admin.noAttempts')}</p>
          )}

          <Link to="/admin/questions" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">
            {t('admin.manageQuestions')} <ArrowRight size={13} />
          </Link>
        </section>
      </div>
    </div>
  );
}
