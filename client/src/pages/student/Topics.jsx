import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  PlayCircle,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import DynamicIcon from '../../components/common/DynamicIcon';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import PageHeader from '../../components/common/PageHeader';
import ProgressBar from '../../components/common/ProgressBar';
import { useLanguage } from '../../context/LanguageContext';
import { studentApi } from '../../services';
import { gradeLabel, scoreTone } from '../../utils/helpers';

const DIFFICULTY_STYLES = {
  easy: 'badge-success',
  medium: 'badge-warning',
  hard: 'badge-error',
};

export default function Topics() {
  const { subjectId } = useParams();
  const { t, pick } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await studentApi.topics(subjectId);
      setData(response);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [subjectId, t]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loading full />;

  if (error) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="app-card max-w-md p-6 text-center">
          <p className="font-semibold text-error">{error}</p>
          <div className="mt-4 flex justify-center gap-2">
            <Link to="/student/subjects" className="btn btn-ghost btn-sm">
              {t('common.back')}
            </Link>
            <button type="button" className="btn btn-primary btn-sm" onClick={load}>
              {t('common.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subject = data?.subject;
  const topics = data?.topics || [];
  const totalQuestions = data?.totalQuestions || 0;

  return (
    <div className="space-y-7">
      <Link
        to="/student/subjects"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-base-content/55 transition hover:text-primary"
      >
        <ArrowLeft size={15} /> {t('nav.subjects')}
      </Link>

      <PageHeader
        eyebrow={`${gradeLabel(data?.grade?.number)} · ${t('nav.subjects')}`}
        title={subject?.name || t('nav.subjects')}
        subtitle={subject?.description || t('student.chooseSubjectSubtitle')}
      >
        {totalQuestions > 0 && (
          <Link
            to={`/student/quiz/setup?subjectId=${subjectId}&subjectName=${encodeURIComponent(
              subject?.name || ''
            )}&available=${totalQuestions}`}
            className="btn btn-primary btn-sm gap-1.5"
          >
            <PlayCircle size={15} /> {t('student.practiseWhole')}
          </Link>
        )}
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-base-100 px-3 py-1 font-medium text-base-content/60 ring-1 ring-base-300/70">
          <BookOpen size={13} /> {totalQuestions} {t('common.questions')}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-base-100 px-3 py-1 font-medium text-base-content/60 ring-1 ring-base-300/70">
          <Sparkles size={13} /> {topics.length} {t('student.topics')}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-base-100 px-3 py-1 font-medium text-base-content/60 ring-1 ring-base-300/70">
          <Clock3 size={13} /> 5 / 10 / 15 min {t('student.timeLimit').toLowerCase()}
        </span>
      </div>

      {topics.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={t('student.noTopics')}
          description={t('student.noTopicsHint')}
          action={
            <Link to="/student/subjects" className="btn btn-primary btn-sm">
              {t('common.back')}
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {topics.map((topic) => {
            const hasQuestions = topic.questionsCount > 0;
            return (
              <div key={topic.id} className="app-card flex flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <BookOpen size={19} />
                  </span>
                  <span className={`badge badge-sm font-semibold capitalize ${DIFFICULTY_STYLES[topic.difficulty] || 'badge-ghost'}`}>
                    {t(`common.${topic.difficulty}`) || topic.difficulty}
                  </span>
                </div>

                <h2 className="mt-4 text-base font-bold">{topic.name}</h2>
                <p className="mt-1 text-xs text-base-content/50">
                  {topic.questionsCount} {t('common.questions')} · {topic.attempts} {t('common.attempts')}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-base-200/70 px-3 py-2">
                    <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-base-content/45">
                      <Trophy size={11} /> {t('student.bestScore')}
                    </p>
                    <p className="mt-0.5 text-sm font-bold">{topic.bestScore}%</p>
                  </div>
                  <div className="rounded-xl bg-base-200/70 px-3 py-2">
                    <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-base-content/45">
                      <Target size={11} /> {t('student.lastScore')}
                    </p>
                    <p className="mt-0.5 text-sm font-bold">
                      {topic.lastPercentage !== null ? `${topic.lastPercentage}%` : '—'}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <ProgressBar value={topic.bestScore} tone={scoreTone(topic.bestScore)} />
                </div>

                <Link
                  to={
                    hasQuestions
                      ? `/student/quiz/setup?subjectId=${subjectId}&topicId=${topic.id}&subjectName=${encodeURIComponent(
                          subject?.name || ''
                        )}&topicName=${encodeURIComponent(topic.name)}&available=${topic.questionsCount}`
                      : '#'
                  }
                  aria-disabled={!hasQuestions}
                  className={`btn btn-sm mt-5 w-full gap-1.5 ${hasQuestions ? 'btn-primary' : 'btn-disabled'}`}
                >
                  {hasQuestions ? (
                    <>
                      <PlayCircle size={15} /> {t('student.startQuiz')}
                    </>
                  ) : (
                    t('student.noTopics')
                  )}
                  {hasQuestions && <ArrowRight size={14} />}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
