import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Flag,
  Loader2,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import ProgressBar from '../../components/common/ProgressBar';
import { useLanguage } from '../../context/LanguageContext';
import { quizApi } from '../../services';
import { cn, formatClock } from '../../utils/helpers';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizGame() {
  const { attemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [quiz, setQuiz] = useState(location.state?.quiz || null);
  const [loading, setLoading] = useState(!location.state?.quiz);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const answersRef = useRef({});
  const submittedRef = useRef(false);
  const deadlineRef = useRef(0);
  const storageKey = `ssq_answers_${attemptId}`;

  const contentLanguage = quiz?.language || language;
  const contentDir = contentLanguage === 'en' ? 'ltr' : 'rtl';

  const localPick = useCallback(
    (value) => {
      if (!value) return '';
      if (typeof value === 'string') return value;
      return value[contentLanguage] || value.en || value.ur || value.sd || '';
    },
    [contentLanguage]
  );

  const loadQuiz = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await quizApi.get(attemptId);
      if (data.expired) {
        toast(t('student.timeUp'), { icon: '⏰' });
        navigate(`/student/result/${attemptId}`, { replace: true });
        return;
      }
      setQuiz(data);
    } catch (err) {
      if (err.status === 409) {
        navigate(`/student/result/${attemptId}`, { replace: true });
        return;
      }
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [attemptId, navigate, t]);

  useEffect(() => {
    if (!location.state?.quiz) {
      loadQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  useEffect(() => {
    if (!quiz) return;

    deadlineRef.current = Date.now() + Math.max(0, Number(quiz.remainingSeconds) || 0) * 1000;
    setRemaining(Math.max(0, Number(quiz.remainingSeconds) || 0));

    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      const validIds = new Set(quiz.questions.map((question) => String(question.id)));
      const restored = Object.fromEntries(
        Object.entries(saved).filter(([questionId]) => validIds.has(String(questionId)))
      );
      setAnswers(restored);
      answersRef.current = restored;
    } catch {
      setAnswers({});
      answersRef.current = {};
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz?.attemptId]);

  const submitQuiz = useCallback(
    async (auto = false) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setSubmitting(true);
      setConfirmOpen(false);

      try {
        const payload = Object.entries(answersRef.current).map(([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        }));
        const result = await quizApi.submit(attemptId, payload, auto);
        localStorage.removeItem(storageKey);
        toast.success(auto ? t('student.timeUp') : t('student.quizSubmitted'));
        navigate(`/student/result/${attemptId}`, { replace: true, state: { result } });
      } catch (err) {
        submittedRef.current = false;
        if (err.status === 409) {
          navigate(`/student/result/${attemptId}`, { replace: true });
          return;
        }
        toast.error(err.message || t('common.error'));
      } finally {
        setSubmitting(false);
      }
    },
    [attemptId, navigate, storageKey, t]
  );

  useEffect(() => {
    if (!quiz || submittedRef.current) return undefined;

    const tick = () => {
      const left = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        submitQuiz(true);
      }
    };

    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [quiz, submitQuiz]);

  useEffect(() => {
    const handler = (event) => {
      if (submittedRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const selectAnswer = (optionIndex) => {
    if (!quiz || remaining <= 0 || submitting) return;
    const question = quiz.questions[current];
    setAnswers((previous) => {
      const next = { ...previous, [question.id]: optionIndex };
      answersRef.current = next;
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Storage can be unavailable in private mode; the quiz still works.
      }
      return next;
    });
  };

  const answeredCount = useMemo(
    () => (quiz ? Object.keys(answers).filter((id) => answers[id] !== undefined).length : 0),
    [answers, quiz]
  );

  if (loading) return <Loading full />;

  if (error) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="app-card max-w-md p-6 text-center">
          <p className="font-semibold text-error">{error}</p>
          <div className="mt-4 flex justify-center gap-2">
            <Link to="/student/dashboard" className="btn btn-ghost btn-sm">
              {t('student.backDashboard')}
            </Link>
            <button type="button" className="btn btn-primary btn-sm" onClick={loadQuiz}>
              {t('common.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  const question = quiz.questions[current];
  const selected = answers[question.id];
  const unansweredNumbers = quiz.questions
    .map((item, index) => (answers[item.id] === undefined ? index + 1 : null))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {submitting && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-base-100/85 backdrop-blur">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <p className="mt-3 text-sm font-semibold">{t('common.saving')}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            {quiz.subject?.name}
            {quiz.topic?.name ? ` · ${quiz.topic.name}` : ''}
          </p>
          <h1 className="mt-1 text-xl font-extrabold sm:text-2xl">
            {t('student.quiz')} · {t('common.questions')} {quiz.totalQuestions}
          </h1>
        </div>
        <div
          className={cn(
            'flex items-center gap-2 rounded-2xl border px-4 py-2.5 font-extrabold tabular-nums',
            remaining <= 60
              ? 'animate-pulse border-error/30 bg-error/10 text-error'
              : 'border-primary/20 bg-primary/10 text-primary'
          )}
          aria-live="polite"
        >
          <Clock3 size={18} />
          {formatClock(remaining)}
        </div>
      </div>

      <div className="app-card p-4">
        <div className="mb-2 flex items-center justify-between gap-3 text-[11px] font-semibold text-base-content/50">
          <span>
            {t('student.questionOf', { current: current + 1, total: quiz.totalQuestions })}
          </span>
          <span>
            {answeredCount}/{quiz.totalQuestions} answered
          </span>
        </div>
        <ProgressBar value={((current + 1) / quiz.totalQuestions) * 100} />
      </div>

      <div className="app-card p-5 sm:p-7" dir={contentDir}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
            Q{current + 1}
          </span>
          <span className="rounded-full bg-base-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-base-content/50">
            {t('common.oneMark') || '1 mark'}
          </span>
        </div>

        <h2 className="mt-4 text-lg font-bold leading-relaxed sm:text-xl">{localPick(question.text)}</h2>
        <p className="mt-2 text-xs text-base-content/45">{t('student.selectAnswer')}</p>

        <div className="mt-5 grid gap-2.5">
          {question.options.map((option, index) => {
            const isSelected = selected === index;
            return (
              <button
                key={`${question.id}-${index}`}
                type="button"
                onClick={() => selectAnswer(index)}
                disabled={remaining <= 0}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-start text-sm transition sm:text-base',
                  isSelected
                    ? 'border-primary bg-primary/10 font-semibold text-primary shadow-sm'
                    : 'border-base-300 bg-base-100 text-base-content/75 hover:border-primary/40 hover:bg-primary/5',
                  remaining <= 0 && 'cursor-not-allowed opacity-60'
                )}
              >
                <span
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-extrabold',
                    isSelected ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content/60'
                  )}
                >
                  {LETTERS[index]}
                </span>
                <span className="flex-1 leading-relaxed">{localPick(option)}</span>
                {isSelected && <CheckCircle2 size={19} className="shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium text-success">
            {selected !== undefined ? (
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 size={13} /> {t('student.answerSaved')}
              </span>
            ) : (
              <span className="text-base-content/40">{t('student.selectAnswer')}</span>
            )}
          </p>
          {remaining <= 0 && (
            <p className="inline-flex items-center gap-1 text-[11px] font-bold text-error">
              <AlertTriangle size={13} /> {t('student.timeUp')}
            </p>
          )}
        </div>
      </div>

      <div className="app-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/45">
            {t('common.questions')}
          </p>
          <span className="text-[11px] font-semibold text-base-content/45">
            {answeredCount}/{quiz.totalQuestions}
          </span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {quiz.questions.map((item, index) => {
            const isAnswered = answers[item.id] !== undefined;
            const isCurrent = index === current;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrent(index)}
                className={cn(
                  'h-8 w-8 rounded-lg text-xs font-bold transition',
                  isAnswered
                    ? 'bg-primary text-primary-content'
                    : 'bg-base-200 text-base-content/60 hover:bg-base-300',
                  isCurrent && 'ring-2 ring-primary ring-offset-1'
                )}
                aria-label={`Question ${index + 1}${isAnswered ? ' answered' : ''}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
        <button
          type="button"
          onClick={() => setCurrent((value) => Math.max(0, value - 1))}
          disabled={current === 0}
          className="btn btn-outline btn-sm gap-1.5"
        >
          <ArrowLeft size={15} /> {t('common.previous')}
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {current < quiz.questions.length - 1 && (
            <button
              type="button"
              onClick={() => setCurrent((value) => Math.min(quiz.questions.length - 1, value + 1))}
              className="btn btn-outline btn-sm gap-1.5"
            >
              {t('common.next')} <ArrowRight size={15} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={submitting}
            className="btn btn-primary btn-sm gap-1.5"
          >
            <Send size={15} /> {t('student.submitQuiz')}
          </button>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t('student.confirmSubmit')}
        size="sm"
        footer={
          <>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmOpen(false)}>
              {t('student.keepGoing')}
            </button>
            <button type="button" className="btn btn-primary btn-sm gap-1.5" onClick={() => submitQuiz(false)}>
              <Flag size={15} /> {t('student.submitAnyway')}
            </button>
          </>
        }
      >
        <p className="text-sm text-base-content/70">
          {t('student.confirmSubmitText', { answered: answeredCount, total: quiz.totalQuestions })}
        </p>
        {unansweredNumbers.length > 0 && (
          <div className="mt-4 rounded-xl bg-warning/10 p-3">
            <p className="text-xs font-semibold text-amber-700">
              {t('common.unanswered')}: {unansweredNumbers.join(', ')}
            </p>
            <p className="mt-1 text-[11px] text-amber-700/80">
              Unanswered questions receive zero marks. There is no negative marking.
            </p>
          </div>
        )}
        {unansweredNumbers.length === 0 && (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-success/10 p-3 text-xs font-semibold text-success">
            <CheckCircle2 size={15} /> All questions answered.
          </p>
        )}
      </Modal>
    </div>
  );
}
