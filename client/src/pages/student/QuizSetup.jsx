import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Check,
  Clock3,
  Gauge,
  Languages,
  ListChecks,
  PlayCircle,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Loading from '../../components/common/Loading';
import PageHeader from '../../components/common/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { quizApi, studentApi } from '../../services';
import { clamp } from '../../utils/helpers';

const COUNTS = [5, 10, 15];
const TIMES = [5, 10, 15];
const DIFFICULTIES = ['mixed', 'easy', 'medium', 'hard'];

export default function QuizSetup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  const subjectId = searchParams.get('subjectId');
  const topicId = searchParams.get('topicId');
  const initialSubjectName = searchParams.get('subjectName') || '';
  const initialTopicName = searchParams.get('topicName') || '';
  const initialAvailable = Number(searchParams.get('available')) || 0;

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(10);
  const [difficulty, setDifficulty] = useState('mixed');
  const [quizLanguage, setQuizLanguage] = useState(language);
  const [starting, setStarting] = useState(false);

  const load = useCallback(async () => {
    if (!subjectId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await studentApi.topics(subjectId);
      const topic = topicId ? data.topics.find((item) => item.id === topicId) : null;
      setDetails({
        subjectName: data.subject?.name || initialSubjectName,
        subjectIcon: data.subject?.icon,
        topicName: topic?.name || initialTopicName,
        available: topic ? topic.questionsCount : data.totalQuestions || initialAvailable,
      });
    } catch {
      setDetails({
        subjectName: initialSubjectName,
        topicName: initialTopicName,
        available: initialAvailable,
        subjectIcon: null,
      });
    } finally {
      setLoading(false);
    }
  }, [subjectId, topicId, initialSubjectName, initialTopicName, initialAvailable]);

  useEffect(() => {
    load();
  }, [load]);

  const available = details?.available || 0;

  useEffect(() => {
    if (available > 0 && questionCount > available) {
      const fallback = COUNTS.filter((count) => count <= available).pop();
      setQuestionCount(fallback || 5);
    }
  }, [available, questionCount]);

  const maxXP = useMemo(
    () => questionCount * 10 + 20 + 30,
    [questionCount]
  );

  const handleStart = async () => {
    if (!subjectId) return;
    setStarting(true);
    try {
      const payload = {
        subjectId,
        questionCount,
        timeLimit,
        difficulty,
        language: quizLanguage,
      };
      if (topicId) payload.topicId = topicId;
      const data = await quizApi.start(payload);
      if (data.partial) {
        toast(`Only ${data.totalQuestions} questions matched your filters.`, { icon: 'ℹ️' });
      }
      navigate(`/student/quiz/${data.attemptId}`, { state: { quiz: data }, replace: true });
    } catch (error) {
      toast.error(error.message || t('common.error'));
    } finally {
      setStarting(false);
    }
  };

  if (!subjectId) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('student.configure')} subtitle={t('student.configureSubtitle')} />
        <div className="app-card p-8 text-center">
          <p className="font-semibold">{t('student.selectSubjectFirst') || 'Select a subject first'}</p>
          <Link to="/student/subjects" className="btn btn-primary btn-sm mt-4">
            {t('nav.subjects')}
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <Loading full />;

  return (
    <div className="space-y-7">
      <Link
        to={topicId ? `/student/topics/${subjectId}` : '/student/subjects'}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-base-content/55 transition hover:text-primary"
      >
        <ArrowLeft size={15} /> {t('common.back')}
      </Link>

      <PageHeader eyebrow={t('student.quiz')} title={t('student.configure')} subtitle={t('student.configureSubtitle')} />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="app-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
              <BookOpen size={13} /> {details?.subjectName || t('common.subject')}
            </span>
            {details?.topicName && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-base-200 px-3 py-1 text-[11px] font-bold text-base-content/60">
                <ListChecks size={13} /> {details.topicName}
              </span>
            )}
            <span className="ms-auto text-[11px] font-semibold text-base-content/45">
              {available} {t('student.availableQuestions')}
            </span>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold">
                <ListChecks size={16} className="text-primary" /> {t('student.numberOfQuestions')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {COUNTS.map((count) => {
                  const disabled = available > 0 && count > available;
                  const active = questionCount === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      disabled={disabled}
                      onClick={() => setQuestionCount(count)}
                      className={`flex flex-col items-center rounded-xl border-2 px-3 py-3 transition ${
                        active
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-base-300 bg-base-100 text-base-content/70 hover:border-primary/40'
                      } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                      <span className="text-xl font-extrabold">{count}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider">
                        {t('common.questions')}
                      </span>
                    </button>
                  );
                })}
              </div>
              {available > 0 && available < 15 && (
                <p className="mt-2 text-xs text-base-content/45">
                  {available} {t('student.availableQuestions')} — larger quizzes will use the available pool.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold">
                <Clock3 size={16} className="text-primary" /> {t('student.timeLimit')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIMES.map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    onClick={() => setTimeLimit(minutes)}
                    className={`rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition ${
                      timeLimit === minutes
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-base-300 bg-base-100 text-base-content/70 hover:border-primary/40'
                    }`}
                  >
                    {minutes} {t('common.minutes')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold">
                <Gauge size={16} className="text-primary" /> {t('student.difficulty')}
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {DIFFICULTIES.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold capitalize transition ${
                      difficulty === level
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-base-300 bg-base-100 text-base-content/70 hover:border-primary/40'
                    }`}
                  >
                    {t(`common.${level}`)}
                  </button>
                ))}
              </div>
              {difficulty === 'mixed' && (
                <p className="mt-1.5 text-xs text-base-content/45">{t('student.mixedHint')}</p>
              )}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold">
                <Languages size={16} className="text-primary" /> {t('common.language')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'ur', label: 'اردو' },
                  { code: 'sd', label: 'سنڌي' },
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setQuizLanguage(item.code);
                      setLanguage(item.code);
                    }}
                    className={`rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition ${
                      quizLanguage === item.code
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-base-300 bg-base-100 text-base-content/70 hover:border-primary/40'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="app-card overflow-hidden">
            <div className="bg-gradient-to-br from-primary via-teal-700 to-emerald-800 p-5 text-primary-content">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                {t('student.quiz')} summary
              </p>
              <h3 className="mt-1.5 text-lg font-extrabold">{details?.subjectName}</h3>
              {details?.topicName && <p className="text-sm text-white/70">{details.topicName}</p>}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-white/55">{t('common.questions')}</p>
                  <p className="text-lg font-extrabold">{questionCount}</p>
                </div>
                <div className="rounded-xl bg-white/10 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-white/55">{t('common.time')}</p>
                  <p className="text-lg font-extrabold">{timeLimit}m</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-base-content/55">{t('student.difficulty')}</span>
                <span className="font-semibold capitalize">{t(`common.${difficulty}`)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/55">{t('common.language')}</span>
                <span className="font-semibold">
                  {quizLanguage === 'en' ? 'English' : quizLanguage === 'ur' ? 'اردو' : 'سنڌي'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/55">Marks</span>
                <span className="font-semibold">1 / {t('common.correct').toLowerCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/55">Negative marking</span>
                <span className="inline-flex items-center gap-1 font-semibold text-success">
                  <Check size={14} /> None
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-base-200 pt-3">
                <span className="flex items-center gap-1.5 text-base-content/55">
                  <Zap size={14} className="text-secondary" /> Max XP
                </span>
                <span className="font-extrabold text-amber-600">{maxXP}</span>
              </div>

              <button
                type="button"
                onClick={handleStart}
                disabled={starting}
                className="btn btn-primary mt-2 w-full gap-2"
              >
                <PlayCircle size={18} /> {starting ? t('common.loading') : t('student.startQuizButton')}
              </button>
              <p className="text-center text-[10px] leading-relaxed text-base-content/40">
                <Sparkles size={10} className="inline" /> The timer starts immediately. Quizzes auto-submit when time
                runs out.
              </p>
            </div>
          </div>

          <div className="app-card flex items-start gap-3 p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary/15 text-amber-600">
              <Target size={17} />
            </span>
            <div>
              <p className="text-xs font-bold">XP rules</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-base-content/55">
                10 XP per correct answer + 20 XP completion bonus + 30 XP perfect-score bonus.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
