import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { studentApi } from '../../services';

const GRADES = [
  {
    number: 6,
    gradient: 'from-teal-500 to-emerald-600',
    description: 'Build strong foundations in numbers, nature and language.',
  },
  {
    number: 7,
    gradient: 'from-sky-500 to-blue-600',
    description: 'Explore the human body, forces and everyday grammar.',
  },
  {
    number: 8,
    gradient: 'from-indigo-500 to-violet-600',
    description: 'Dive into cells, chemical reactions, algebra and more.',
  },
  {
    number: 9,
    gradient: 'from-amber-500 to-orange-600',
    description: 'Study ecosystems, light, sound and advanced algebra.',
  },
  {
    number: 10,
    gradient: 'from-rose-500 to-pink-600',
    description: 'Master genetics, electricity, functions and exam skills.',
  },
];

export default function Grades() {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(null);

  const chooseGrade = async (grade) => {
    if (Number(user?.grade) === grade) {
      navigate('/student/subjects');
      return;
    }

    setSaving(grade);
    try {
      await studentApi.updateProfile({ grade });
      updateUser({ grade });
      toast.success(t('auth.gradeUpdated'));
      navigate('/student/subjects');
    } catch (error) {
      toast.error(error.message || t('auth.gradeUpdateFailed'));
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={t('nav.grades')}
        title={t('student.chooseGrade')}
        subtitle={t('student.chooseGradeSubtitle')}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {GRADES.map((grade) => {
          const isCurrent = Number(user?.grade) === grade.number;
          return (
            <button
              key={grade.number}
              type="button"
              onClick={() => chooseGrade(grade.number)}
              disabled={saving !== null}
              className={`app-card group relative flex flex-col items-start p-6 text-start transition hover:-translate-y-0.5 hover:shadow-lg ${
                isCurrent ? 'ring-2 ring-primary' : ''
              }`}
            >
              {isCurrent && (
                <span className="absolute end-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                  <CheckCircle2 size={12} /> {t('common.active')}
                </span>
              )}

              <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${grade.gradient} text-white shadow-md`}>
                <GraduationCap size={26} />
              </span>

              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-base-content/40">
                Class
              </p>
              <h2 className="text-2xl font-extrabold">
                {t('common.grade')} {grade.number}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-base-content/60">{grade.description}</p>

              <div className="mt-5 flex w-full items-center justify-between border-t border-base-200 pt-4">
                <span className="flex items-center gap-3 text-[11px] font-semibold text-base-content/50">
                  <span className="inline-flex items-center gap-1">
                    <BookOpen size={12} /> 4 {t('nav.subjects')}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Layers size={12} /> 8 {t('student.topics')}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                  {saving === grade.number ? t('common.saving') : isCurrent ? t('common.view') : t('student.continueToSubjects')}
                  <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="rounded-2xl bg-base-100 px-4 py-3 text-xs text-base-content/50 ring-1 ring-base-300/70">
        {t('student.noSubjectsHint')}
      </p>
    </div>
  );
}
