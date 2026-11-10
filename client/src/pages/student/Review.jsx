import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  ListChecks,
  XCircle,
  CircleSlash,
} from 'lucide-react';
import Loading from '../../components/common/Loading';
import PageHeader from '../../components/common/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { quizApi } from '../../services';
import { cn, formatDate } from '../../utils/helpers';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function Review() {
  const { attemptId } = useParams();
  const { t, language } = useLanguage();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await quizApi.review(attemptId);
      setReview(data);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [attemptId, t]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loading full />;

  if (error || !review) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="app-card max-w-md p-6 text-center">
          <p className="font-semibold text-error">{error || t('common.error')}</p>
          <div className="mt-4 flex justify-center gap-2">
            <Link to="/student/history" className="btn btn-ghost btn-sm">
              {t('nav.history')}
            </Link>
            <button type="button" className="btn btn-primary btn-sm" onClick={load}>
              {t('common.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const contentLanguage = review.language || language;
  const dir = contentLanguage === 'en' ? 'ltr' : 'rtl';
  const localPick = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[contentLanguage] || value.en || value.ur || value.sd || '';
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        to={`/student/result/${attemptId}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-base-content/55 transition hover:text-primary"
      >
        <ArrowLeft size={15} /> {t('student.backToResult')}
      </Link>

      <PageHeader
        eyebrow={`${review.subject?.name || ''}${review.topic?.name ? ` · ${review.topic.name}` : ''}`}
        title={t('student.answerReview')}
        subtitle={`${formatDate(review.submittedAt)} · ${review.correctAnswers}/${review.totalQuestions} ${t(
          'common.correct'
        ).toLowerCase()}`}
      >
        <Link to="/student/dashboard" className="btn btn-outline btn-sm">
          {t('student.backDashboard')}
        </Link>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: ListChecks, label: t('common.questions'), value: review.totalQuestions, tone: 'bg-primary/10 text-primary' },
          { icon: CheckCircle2, label: t('common.correct'), value: review.correctAnswers, tone: 'bg-success/10 text-success' },
          { icon: XCircle, label: t('common.incorrect'), value: review.incorrectAnswers, tone: 'bg-error/10 text-error' },
          { icon: CircleSlash, label: t('common.unanswered'), value: review.unanswered, tone: 'bg-base-200 text-base-content/60' },
        ].map((item) => (
          <div key={item.label} className="app-card flex items-center gap-3 p-4">
            <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', item.tone)}>
              <item.icon size={17} />
            </span>
            <div>
              <p className="text-lg font-extrabold leading-none">{item.value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-base-content/45">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {review.questions.map((question) => {
          const status = question.isCorrect === true ? 'correct' : question.selectedAnswer === null ? 'skipped' : 'wrong';
          const explanation = localPick(question.explanation);

          return (
            <article
              key={`${question.questionId}-${question.number}`}
              className={cn(
                'app-card overflow-hidden border-s-4',
                status === 'correct'
                  ? 'border-s-success'
                  : status === 'wrong'
                    ? 'border-s-error'
                    : 'border-s-base-300'
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-base-200 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-base-200 text-xs font-extrabold text-base-content/65">
                    {question.number}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/45">
                    {t('common.question')}
                  </span>
                  <span className="badge badge-ghost badge-sm capitalize">{question.difficulty}</span>
                </div>

                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold',
                    status === 'correct'
                      ? 'bg-success/10 text-success'
                      : status === 'wrong'
                        ? 'bg-error/10 text-error'
                        : 'bg-base-200 text-base-content/55'
                  )}
                >
                  {status === 'correct' ? (
                    <>
                      <CheckCircle2 size={13} /> {t('common.correct')}
                    </>
                  ) : status === 'wrong' ? (
                    <>
                      <XCircle size={13} /> {t('common.incorrect')}
                    </>
                  ) : (
                    <>
                      <CircleSlash size={13} /> {t('student.notAnswered')}
                    </>
                  )}
                </span>
              </div>

              <div className="px-5 py-4" dir={dir}>
                <h3 className="text-base font-bold leading-relaxed sm:text-lg">{localPick(question.text)}</h3>

                <div className="mt-4 grid gap-2">
                  {question.options.map((option, index) => {
                    const isCorrect = index === question.correctAnswer;
                    const isSelected = index === question.selectedAnswer;

                    return (
                      <div
                        key={`${question.questionId}-option-${index}`}
                        className={cn(
                          'flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm',
                          isCorrect
                            ? 'border-success/40 bg-success/10 font-semibold text-success'
                            : isSelected
                              ? 'border-error/40 bg-error/10 font-semibold text-error'
                              : 'border-base-200 bg-base-100 text-base-content/70'
                        )}
                      >
                        <span
                          className={cn(
                            'grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-extrabold',
                            isCorrect
                              ? 'bg-success text-white'
                              : isSelected
                                ? 'bg-error text-white'
                                : 'bg-base-200 text-base-content/55'
                          )}
                        >
                          {LETTERS[index]}
                        </span>
                        <span className="flex-1 leading-relaxed">{localPick(option)}</span>
                        {isCorrect && <CheckCircle2 size={17} className="shrink-0" />}
                        {!isCorrect && isSelected && <XCircle size={17} className="shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-medium">
                  <span className="rounded-full bg-base-200 px-2.5 py-1 text-base-content/55">
                    {t('student.yourAnswer')}:{' '}
                    {question.selectedAnswer === null ? t('student.notAnswered') : LETTERS[question.selectedAnswer]}
                  </span>
                  <span className="rounded-full bg-success/10 px-2.5 py-1 text-success">
                    {t('student.correctAnswer')}: {LETTERS[question.correctAnswer]}
                  </span>
                </div>

                {explanation && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-primary/5 p-3.5">
                    <Lightbulb size={17} className="mt-0.5 shrink-0 text-amber-500" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        {t('student.explanation')}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-base-content/70">{explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 pb-4">
        <Link to={`/student/result/${attemptId}`} className="btn btn-primary btn-sm gap-1.5">
          <ArrowLeft size={15} /> {t('student.backToResult')}
        </Link>
        <Link to="/student/dashboard" className="btn btn-ghost btn-sm">
          {t('student.backDashboard')}
        </Link>
      </div>
    </div>
  );
}
