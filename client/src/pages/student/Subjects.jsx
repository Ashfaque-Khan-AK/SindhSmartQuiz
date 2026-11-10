import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, ListTree, PlayCircle } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import PageHeader from '../../components/common/PageHeader';
import ProgressBar from '../../components/common/ProgressBar';
import DynamicIcon from '../../components/common/DynamicIcon';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { studentApi } from '../../services';
import { gradeLabel, scoreTone } from '../../utils/helpers';

export default function Subjects() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await studentApi.subjects();
      setData(response);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load, user?.grade]);

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

  const subjects = data?.subjects || [];
  const gradeNumber = data?.grade?.number || user?.grade;

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={t('nav.subjects')}
        title={t('student.chooseSubject')}
        subtitle={t('student.chooseSubjectSubtitle')}
      >
        <Link to="/student/grades" className="btn btn-outline btn-sm gap-1.5">
          <GraduationCap size={15} /> {gradeLabel(gradeNumber)}
        </Link>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">
          {gradeLabel(gradeNumber)}
        </span>
        <span className="rounded-full bg-base-100 px-3 py-1 font-medium text-base-content/55 ring-1 ring-base-300/70">
          {subjects.length} {t('nav.subjects')}
        </span>
        <span className="rounded-full bg-base-100 px-3 py-1 font-medium text-base-content/55 ring-1 ring-base-300/70">
          {subjects.reduce((sum, subject) => sum + subject.questionsCount, 0)} {t('common.questions')}
        </span>
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
        <div className="grid gap-5 md:grid-cols-2">
          {subjects.map((subject) => (
            <div key={subject.id} className="app-card group flex flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <DynamicIcon name={subject.icon} size={26} />
                </span>
                <div className="flex flex-col items-end gap-1">
                  {subject.bestScore > 0 && (
                    <span className="badge badge-success badge-sm badge-outline font-bold">
                      {t('student.bestScore')}: {subject.bestScore}%
                    </span>
                  )}
                  <span className="text-[11px] font-semibold text-base-content/45">
                    {subject.attempts} {t('common.attempts')}
                  </span>
                </div>
              </div>

              <h2 className="mt-5 text-xl font-extrabold">{subject.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-base-content/60">
                {subject.description}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-base-200/70 px-3 py-2">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-base-content/45">
                    <ListTree size={12} /> {t('student.topics')}
                  </p>
                  <p className="mt-0.5 text-sm font-bold">{subject.topicsCount}</p>
                </div>
                <div className="rounded-xl bg-base-200/70 px-3 py-2">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-base-content/45">
                    <BookOpen size={12} /> {t('common.questions')}
                  </p>
                  <p className="mt-0.5 text-sm font-bold">{subject.questionsCount}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-base-content/50">
                  <span>{t('student.yourProgress')}</span>
                  <span>{subject.progress}%</span>
                </div>
                <ProgressBar value={subject.progress} tone={scoreTone(subject.progress)} />
              </div>

              <div className="mt-5 flex items-center gap-2">
                <Link to={`/student/topics/${subject.id}`} className="btn btn-primary btn-sm flex-1 gap-1.5">
                  <PlayCircle size={15} /> {t('student.startQuiz')}
                </Link>
                <Link
                  to={`/student/quiz/setup?subjectId=${subject.id}&subjectName=${encodeURIComponent(subject.name)}&available=${subject.questionsCount}`}
                  className="btn btn-ghost btn-sm border border-base-300"
                >
                  {t('student.practiseWhole')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
