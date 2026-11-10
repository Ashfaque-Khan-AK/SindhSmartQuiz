import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  Flame,
  GraduationCap,
  Medal,
  PlayCircle,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DynamicIcon from '../../components/common/DynamicIcon';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import PageHeader from '../../components/common/PageHeader';
import ProgressBar from '../../components/common/ProgressBar';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { studentApi } from '../../services';
import { formatDate, gradeLabel, scoreTone } from '../../utils/helpers';

export default function Dashboard() {
  const { user } = useAuth();
  const { t, pick } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await studentApi.dashboard();
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

  const firstName = (data?.student?.name || user?.name || '').split(' ')[0];
  const subjects = data?.subjects || [];
  const stats = data?.stats || {};

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={t('nav.dashboard')}
        title={`${t('student.welcomeBack')}, ${firstName} 👋`}
        subtitle={t('student.ready')}
      >
        <Link to={user?.grade ? '/student/subjects' : '/student/grades'} className="btn btn-primary btn-sm gap-1.5">
          <PlayCircle size={16} /> {t('student.quickStart')}
        </Link>
      </PageHeader>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-teal-700 to-emerald-800 p-6 text-primary-content shadow-soft sm:p-8">
        <div className="absolute -end-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 start-1/3 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                <GraduationCap size={13} /> {gradeLabel(data?.grade?.number || user?.grade)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                <Flame size={13} /> {stats.currentStreak || 0} {t('student.dayStreak')}
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">
              {t('student.yourProgress')}
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80">
              {stats.quizzesAttempted
                ? t('student.progressSummary', {
                    quizzes: stats.quizzesAttempted,
                    average: stats.averageScore || 0,
                  })
                : t('student.takeFirst')}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to={user?.grade ? '/student/subjects' : '/student/grades'} className="btn btn-secondary btn-sm gap-1.5">
                <PlayCircle size={15} /> {t('student.quickStart')}
              </Link>
              <Link to="/student/leaderboard" className="btn btn-ghost btn-sm border border-white/25 text-white hover:bg-white/10">
                <Trophy size={15} /> {t('nav.leaderboard')}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto">
            {[
              { icon: Zap, value: stats.totalXP || 0, label: t('student.totalXP') },
              { icon: BookOpen, value: stats.quizzesAttempted || 0, label: t('student.quizzesTaken') },
              { icon: Target, value: `${stats.averageScore || 0}%`, label: t('student.averageScore') },
              { icon: Medal, value: `${stats.achievementsEarned || 0}/${stats.totalAchievements || 0}`, label: t('student.recentAchievements') },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                <item.icon size={16} className="text-white/70" />
                <p className="mt-2 text-xl font-extrabold leading-none">{item.value}</p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-white/60">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Zap} label={t('student.totalXP')} value={stats.totalXP || 0} tone="secondary" hint={t('common.xp')} />
        <StatCard icon={BookOpen} label={t('student.quizzesTaken')} value={stats.quizzesAttempted || 0} tone="primary" />
        <StatCard icon={Target} label={t('student.averageScore')} value={`${stats.averageScore || 0}%`} tone="success" />
        <StatCard icon={Flame} label={t('student.dayStreak')} value={stats.currentStreak || 0} tone="warning" hint={`${t('student.bestStreak')}: ${stats.bestStreak || 0}`} />
      </section>

      {!user?.grade && (
        <section className="app-card flex flex-col items-start justify-between gap-4 border-s-4 border-s-primary p-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-bold">{t('student.chooseGrade')}</p>
            <p className="mt-1 text-sm text-base-content/60">{t('student.chooseGradeSubtitle')}</p>
          </div>
          <Link to="/student/grades" className="btn btn-primary btn-sm gap-1.5">
            {t('student.chooseGrade')} <ArrowRight size={15} />
          </Link>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">{t('student.availableSubjects')}</h2>
            <p className="text-sm text-base-content/55">{t('student.chooseSubjectSubtitle')}</p>
          </div>
          <Link to="/student/subjects" className="link link-primary text-sm font-semibold">
            {t('common.view')} →
          </Link>
        </div>

        {subjects.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={t('student.noSubjects')}
            description={t('student.noSubjectsHint')}
            action={
              <Link to="/student/grades" className="btn btn-primary btn-sm">
                {t('student.chooseGrade')}
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                to={`/student/topics/${subject.id}`}
                className="app-card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <DynamicIcon name={subject.icon} size={21} />
                  </span>
                  <span className="rounded-full bg-base-200 px-2.5 py-1 text-[10px] font-bold text-base-content/55">
                    {subject.topicsCount} {t('student.topics')}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold">{subject.name}</h3>
                <p className="mt-1 text-xs text-base-content/50">
                  {subject.questionsCount} {t('common.questions')} · {subject.attempts} {t('common.attempts')}
                </p>
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-base-content/50">
                    <span>{t('student.yourProgress')}</span>
                    <span>{subject.progress}%</span>
                  </div>
                  <ProgressBar value={subject.progress} tone={scoreTone(subject.progress)} />
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">
                  {t('student.startQuiz')}
                  <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="app-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">{t('student.recentAttempts')}</h2>
            <Link to="/student/history" className="text-xs font-semibold text-primary hover:underline">
              {t('nav.history')} →
            </Link>
          </div>

          {data?.recentAttempts?.length ? (
            <div className="divide-y divide-base-200">
              {data.recentAttempts.map((attempt) => (
                <Link
                  key={attempt.id}
                  to={`/student/result/${attempt.id}`}
                  className="flex items-center gap-3 py-3 transition hover:bg-base-200/40"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-base-200 text-base-content/60">
                    <BookOpen size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {attempt.subject?.name || '—'}
                      {attempt.topic ? <span className="text-base-content/50"> · {attempt.topic.name}</span> : null}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-base-content/50">
                      <CalendarDays size={11} /> {formatDate(attempt.submittedAt)} · {attempt.score}/{attempt.totalQuestions}
                    </p>
                  </div>
                  <span className={`badge badge-sm font-bold ${attempt.percentage >= 80 ? 'badge-success' : attempt.percentage >= 50 ? 'badge-warning' : 'badge-error'} badge-outline`}>
                    {attempt.percentage}%
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PlayCircle}
              title={t('student.noAttempts')}
              description={t('student.takeFirst')}
              action={
                <Link to={user?.grade ? '/student/subjects' : '/student/grades'} className="btn btn-primary btn-sm">
                  {t('student.startQuiz')}
                </Link>
              }
            />
          )}
        </section>

        <section className="app-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">{t('student.recentAchievements')}</h2>
            <Link to="/student/achievements" className="text-xs font-semibold text-primary hover:underline">
              {t('nav.achievements')} →
            </Link>
          </div>

          {data?.recentAchievements?.length ? (
            <div className="space-y-3">
              {data.recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 rounded-xl bg-base-200/60 p-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary/15 text-amber-600">
                    <DynamicIcon name={achievement.icon} size={19} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{achievement.name}</p>
                    <p className="text-[11px] text-base-content/50">{formatDate(achievement.earnedAt)}</p>
                  </div>
                  <Award size={15} className="ms-auto shrink-0 text-secondary" />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Medal}
              title={t('student.locked')}
              description={t('student.achievementsSubtitle')}
              className="py-8"
            />
          )}

          {data?.stats?.currentStreak > 0 && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-warning/10 p-3 text-amber-700">
              <Flame size={20} />
              <div>
                <p className="text-sm font-bold">{data.stats.currentStreak} day streak</p>
                <p className="text-[11px] text-amber-700/70">{t('student.dayStreak')}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
