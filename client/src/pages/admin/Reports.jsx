import { useCallback, useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Award,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Target,
  TrendingDown,
  Users,
  Zap,
} from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import Loading from '../../components/common/Loading';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { useLanguage } from '../../context/LanguageContext';
import { adminApi } from '../../services';

export default function AdminReports() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.reports();
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

  const summary = data?.summary || {};
  const gradeWise = data?.gradeWise || [];
  const subjectWise = data?.subjectWise || [];
  const hardestTopics = data?.hardestTopics || [];
  const topStudents = data?.topStudents || [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('admin.panel')}
        title={t('admin.reports')}
        subtitle={t('admin.reportsSubtitle')}
      >
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2 text-xs font-bold text-primary">
          <BarChart3 size={14} /> {t('admin.contentSummary')}
        </span>
      </PageHeader>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard icon={ClipboardList} label={t('admin.totalAttempts')} value={summary.totalAttempts || 0} tone="primary" />
        <StatCard icon={CheckCircle2} label={t('common.correct')} value={summary.totalCorrect || 0} tone="success" />
        <StatCard icon={Target} label={t('common.questions')} value={summary.totalQuestionsAnswered || 0} tone="accent" />
        <StatCard icon={Target} label={t('admin.accuracy')} value={`${summary.accuracy || 0}%`} tone="warning" />
        <StatCard icon={Users} label={t('admin.totalStudents')} value={summary.totalStudents || 0} tone="info" />
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="app-card p-5">
          <div className="mb-4">
            <h2 className="font-bold">{t('admin.gradeWise')}</h2>
            <p className="text-xs text-base-content/50">{t('admin.averagePerGrade')}</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeWise} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="average" fill="#0f766e" radius={[6, 6, 0, 0]} maxBarSize={48} name="Average %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="app-card p-5">
          <div className="mb-4">
            <h2 className="font-bold">{t('admin.subjectWise')}</h2>
            <p className="text-xs text-base-content/50">{t('admin.attemptsPerSubject')}</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectWise} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} tickLine={false} axisLine={false} interval={0} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="attempts" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={40} name="Attempts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="app-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-base-200 px-5 py-4">
            <TrendingDown size={17} className="text-error" />
            <h2 className="font-bold">{t('admin.hardest')}</h2>
          </div>
          {hardestTopics.length ? (
            <div className="overflow-x-auto">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>{t('common.topic')}</th>
                    <th>{t('common.subject')}</th>
                    <th className="text-end">{t('common.attempts')}</th>
                    <th className="text-end">{t('admin.avgScore')}</th>
                  </tr>
                </thead>
                <tbody>
                  {hardestTopics.map((topic, index) => (
                    <tr key={`${topic.name}-${index}`}>
                      <td className="font-medium">{topic.name}</td>
                      <td className="text-base-content/60">{topic.subject}</td>
                      <td className="text-end">{topic.attempts}</td>
                      <td className="text-end">
                        <span className="font-bold text-error">{topic.average}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-base-content/50">{t('common.noData')}</p>
          )}
        </section>

        <section className="app-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-base-200 px-5 py-4">
            <Award size={17} className="text-secondary" />
            <h2 className="font-bold">{t('admin.topStudents')}</h2>
          </div>
          {topStudents.length ? (
            <div className="overflow-x-auto">
              <table className="app-table">
                <thead>
                  <tr>
                    <th className="w-12">{t('common.rank')}</th>
                    <th>{t('student.student')}</th>
                    <th className="text-end">{t('student.quizzes')}</th>
                    <th className="text-end">{t('admin.avgScore')}</th>
                    <th className="text-end">{t('common.xp')}</th>
                  </tr>
                </thead>
                <tbody>
                  {topStudents.map((student, index) => (
                    <tr key={student.name + index}>
                      <td>
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-base-200 text-xs font-bold text-base-content/60">
                          {index + 1}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar name={student.name} size="sm" />
                          <div>
                            <p className="font-semibold">{student.name}</p>
                            <p className="text-[11px] text-base-content/45">
                              {t('common.grade')} {student.grade || '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-end">{student.quizzes}</td>
                      <td className="text-end font-semibold">{student.averageScore}%</td>
                      <td className="text-end">
                        <span className="inline-flex items-center gap-1 font-extrabold text-amber-600">
                          <Zap size={13} /> {student.totalXP}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-base-content/50">{t('common.noData')}</p>
          )}
        </section>
      </div>
    </div>
  );
}
