import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Flame,
  LayoutDashboard,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
  Zap,
} from 'lucide-react';
import DynamicIcon from '../../components/common/DynamicIcon';
import Loading from '../../components/common/Loading';
import { useLanguage } from '../../context/LanguageContext';
import { quizApi } from '../../services';
import { formatDate, formatDuration, gradeLabel } from '../../utils/helpers';

const RADIUS = 56;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Result() {
  const { attemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await quizApi.result(attemptId);
      setResult(data);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [attemptId, t]);

  useEffect(() => {
    if (!location.state?.result) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  if (loading) return <Loading full />;

  if (error || !result) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="app-card max-w-md p-6 text-center">
          <p className="font-semibold text-error">{error || t('common.error')}</p>
          <div className="mt-4 flex justify-center gap-2">
            <Link to="/student/dashboard" className="btn btn-ghost btn-sm">
              {t('student.backDashboard')}
            </Link>
            <button type="button" className="btn btn-primary btn-sm" onClick={load}>
              {t('common.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const percentage = Math.round(result.percentage || 0);
  const totalXP = (result.xpEarned || 0) + (result.achievementXP || 0);
  const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;

  const retryLink = `/student/quiz/setup?subjectId=${result.subject?.id}${
    result.topic?.id ? `&topicId=${result.topic.id}` : ''
  }&subjectName=${encodeURIComponent(result.subject?.name || '')}${
    result.topic?.name ? `&topicName=${encodeURIComponent(result.topic.name)}` : ''
  }`;

  const tone =
    percentage >= 80
      ? { ring: 'stroke-emerald-300', text: 'text-emerald-100', label: t('student.perfect') }
      : percentage >= 50
        ? { ring: 'stroke-amber-300', text: 'text-amber-100', label: t('student.result') }
        : { ring: 'stroke-rose-300', text: 'text-rose-100', label: t('student.result') };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {result.autoSubmitted && (
        <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-amber-800">
          <Clock3 size={18} className="mt-0.5 shrink-0" />
          <p>{t('student.timeUp')}</p>
        </div>
      )}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-teal-700 to-emerald-800 p-6 text-primary-content shadow-soft sm:p-9">
        <div className="absolute -end-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 start-1/4 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative grid items-center gap-8 sm:grid-cols-[auto_1fr]">
          <div className="relative mx-auto h-40 w-40">
            <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
              <circle
                cx="70"
                cy="70"
                r={RADIUS}
                fill="none"
                strokeWidth="12"
                className="stroke-white/15"
              />
              <circle
                cx="70"
                cy="70"
                r={RADIUS}
                fill="none"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                className={`${tone.ring} transition-all duration-1000`}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="text-4xl font-extrabold leading-none">{percentage}%</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/65">
                  {result.score}/{result.totalQuestions}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                {gradeLabel(result.grade?.number)}
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                {result.subject?.name}
              </span>
              {result.topic?.name && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                  {result.topic.name}
                </span>
              )}
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {percentage === 100 ? t('student.perfect') : t('student.result')}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
              {result.performanceMessage}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-sm font-bold">
                <Zap size={16} className="text-secondary" /> +{totalXP} XP
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-sm font-bold">
                <CheckCircle2 size={16} /> {result.correctAnswers} {t('common.correct')}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-sm font-bold">
                <Clock3 size={16} /> {formatDuration(result.timeTaken)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            icon: CheckCircle2,
            label: t('common.correct'),
            value: result.correctAnswers,
            tone: 'bg-success/10 text-success',
          },
          {
            icon: XCircle,
            label: t('common.incorrect'),
            value: result.incorrectAnswers,
            tone: 'bg-error/10 text-error',
          },
          {
            icon: Target,
            label: t('common.unanswered'),
            value: result.unanswered,
            tone: 'bg-base-200 text-base-content/60',
          },
          {
            icon: Zap,
            label: t('common.xp'),
            value: `+${result.xpEarned}`,
            tone: 'bg-secondary/15 text-amber-600',
          },
        ].map((item) => (
          <div key={item.label} className="app-card p-4">
            <span className={`grid h-9 w-9 place-items-center rounded-xl ${item.tone}`}>
              <item.icon size={17} />
            </span>
            <p className="mt-3 text-xl font-extrabold">{item.value}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-base-content/45">
              {item.label}
            </p>
          </div>
        ))}
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="app-card p-5">
          <h2 className="flex items-center gap-2 font-bold">
            <BookOpen size={17} className="text-primary" /> {t('student.scoreBreakdown')}
          </h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            {[
              [t('common.questions'), result.totalQuestions],
              [t('common.score'), `${result.score}/${result.totalQuestions}`],
              [t('common.percentage'), `${percentage}%`],
              [t('student.difficulty'), t(`common.${result.difficulty}`) || result.difficulty],
              [t('common.time'), `${formatDuration(result.timeTaken)} / ${result.timeLimitMinutes}m`],
              [t('common.date'), formatDate(result.submittedAt)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 border-b border-base-200 pb-2 last:border-0 last:pb-0">
                <dt className="text-base-content/55">{label}</dt>
                <dd className="font-semibold capitalize">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="app-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold">
              <Award size={17} className="text-secondary" /> {t('student.recentAchievements')}
            </h2>
            <Link to="/student/achievements" className="text-xs font-semibold text-primary hover:underline">
              {t('common.view')} →
            </Link>
          </div>

          {result.achievements?.length ? (
            <div className="mt-4 space-y-2.5">
              {result.achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 rounded-xl bg-secondary/10 p-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary/20 text-amber-600">
                    <DynamicIcon name={achievement.icon} size={19} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{achievement.name}</p>
                    <p className="truncate text-[11px] text-base-content/55">{achievement.description}</p>
                  </div>
                  <span className="shrink-0 text-xs font-extrabold text-amber-600">
                    +{achievement.xpReward} XP
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center rounded-xl bg-base-200/60 px-4 py-8 text-center">
              <Trophy size={26} className="text-base-content/30" />
              <p className="mt-2 text-sm font-semibold text-base-content/60">{t('student.noAchievements')}</p>
              <p className="mt-1 text-xs text-base-content/45">{t('student.achievementsSubtitle')}</p>
            </div>
          )}

          {result.achievementXP > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-success/10 p-3 text-xs font-semibold text-success">
              <Flame size={15} /> +{result.achievementXP} bonus XP from achievements
            </div>
          )}
        </section>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 pb-4 sm:justify-start">
        <Link to={`/student/review/${attemptId}`} className="btn btn-primary gap-1.5">
          <CheckCircle2 size={17} /> {t('student.reviewAnswers')}
        </Link>
        <Link to={retryLink} className="btn btn-outline gap-1.5">
          <RotateCcw size={16} /> {t('student.retry')}
        </Link>
        <button
          type="button"
          onClick={() => navigate('/student/dashboard')}
          className="btn btn-ghost gap-1.5"
        >
          <LayoutDashboard size={16} /> {t('student.backDashboard')}
        </button>
        <Link to="/student/leaderboard" className="btn btn-ghost gap-1.5">
          <Trophy size={16} /> {t('nav.leaderboard')} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
