import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  EyeOff,
  HelpCircle,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { adminApi } from '../../services';
import { cn } from '../../utils/helpers';

const LETTERS = ['A', 'B', 'C', 'D'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const EDITOR_LANGUAGES = [
  { code: 'en', native: 'English', dir: 'ltr' },
  { code: 'ur', native: 'اردو', dir: 'rtl' },
  { code: 'sd', native: 'سنڌي', dir: 'rtl' },
];

function emptyForm(gradeId = '') {
  return {
    gradeId,
    subjectId: '',
    topicId: '',
    question: { en: '', ur: '', sd: '' },
    options: [
      { en: '', ur: '', sd: '' },
      { en: '', ur: '', sd: '' },
      { en: '', ur: '', sd: '' },
      { en: '', ur: '', sd: '' },
    ],
    correctAnswer: 0,
    explanation: { en: '', ur: '', sd: '' },
    difficulty: 'easy',
    isActive: true,
  };
}

export default function AdminQuestions() {
  const { t } = useLanguage();
  const [meta, setMeta] = useState({ grades: [], subjects: [], topics: [] });
  const [metaLoading, setMetaLoading] = useState(true);

  const [filters, setFilters] = useState({
    gradeId: '',
    subjectId: '',
    topicId: '',
    difficulty: '',
    status: '',
    search: '',
  });
  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editorLang, setEditorLang] = useState('en');
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([adminApi.grades(), adminApi.subjects(), adminApi.topics()])
      .then(([grades, subjects, topics]) =>
        setMeta({ grades: grades || [], subjects: subjects || [], topics: topics || [] })
      )
      .catch((err) => toast.error(err.message || t('common.error')))
      .finally(() => setMetaLoading(false));
  }, [t]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.questions({
        page,
        limit: 8,
        gradeId: filters.gradeId || undefined,
        subjectId: filters.subjectId || undefined,
        topicId: filters.topicId || undefined,
        difficulty: filters.difficulty || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
      });
      setQuestions(response.items || []);
      setPagination(response.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [filters, page, t]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  const setFilter = (field, value) => {
    setPage(1);
    setFilters((previous) => ({
      ...previous,
      [field]: value,
      ...(field === 'gradeId' ? { subjectId: '', topicId: '' } : {}),
      ...(field === 'subjectId' ? { topicId: '' } : {}),
    }));
  };

  const filterSubjects = useMemo(
    () =>
      meta.subjects.filter(
        (subject) =>
          !filters.gradeId ||
          (subject.grades || []).some((grade) => String(grade._id || grade) === String(filters.gradeId))
      ),
    [meta.subjects, filters.gradeId]
  );

  const filterTopics = useMemo(
    () =>
      meta.topics.filter(
        (topic) =>
          (!filters.subjectId || String(topic.subjectId?._id || topic.subjectId) === String(filters.subjectId)) &&
          (!filters.gradeId || String(topic.gradeId?._id || topic.gradeId) === String(filters.gradeId))
      ),
    [meta.topics, filters.gradeId, filters.subjectId]
  );

  const modalSubjects = useMemo(
    () =>
      meta.subjects.filter(
        (subject) =>
          !form.gradeId ||
          (subject.grades || []).some((grade) => String(grade._id || grade) === String(form.gradeId))
      ),
    [meta.subjects, form.gradeId]
  );

  const modalTopics = useMemo(
    () =>
      meta.topics.filter(
        (topic) =>
          (!form.subjectId || String(topic.subjectId?._id || topic.subjectId) === String(form.subjectId)) &&
          (!form.gradeId || String(topic.gradeId?._id || topic.gradeId) === String(form.gradeId))
      ),
    [meta.topics, form.gradeId, form.subjectId]
  );

  const openCreate = () => {
    const gradeId = meta.grades[0]?.id || '';
    setEditing(null);
    setEditorLang('en');
    setForm(emptyForm(gradeId));
    setModalOpen(true);
  };

  const openEdit = (question) => {
    setEditing(question);
    setEditorLang('en');
    setForm({
      gradeId: String(question.gradeId?._id || ''),
      subjectId: String(question.subjectId?._id || ''),
      topicId: String(question.topicId?._id || ''),
      question: {
        en: question.question?.en || '',
        ur: question.question?.ur || '',
        sd: question.question?.sd || '',
      },
      options: (question.options || []).map((option) => ({
        en: option.en || '',
        ur: option.ur || '',
        sd: option.sd || '',
      })),
      correctAnswer: question.correctAnswer ?? 0,
      explanation: {
        en: question.explanation?.en || '',
        ur: question.explanation?.ur || '',
        sd: question.explanation?.sd || '',
      },
      difficulty: question.difficulty || 'easy',
      isActive: question.isActive !== false,
    });
    setModalOpen(true);
  };

  const changeGrade = (gradeId) => {
    const subjectValid = meta.subjects.some(
      (subject) =>
        String(subject.id) === String(form.subjectId) &&
        (subject.grades || []).some((grade) => String(grade._id || grade) === String(gradeId))
    );
    setForm((previous) => ({
      ...previous,
      gradeId,
      subjectId: subjectValid ? previous.subjectId : '',
      topicId: '',
    }));
  };

  const changeSubject = (subjectId) => {
    const topicValid = meta.topics.some(
      (topic) =>
        String(topic.id) === String(form.topicId) &&
        String(topic.subjectId?._id || topic.subjectId) === String(subjectId)
    );
    setForm((previous) => ({
      ...previous,
      subjectId,
      topicId: topicValid ? previous.topicId : '',
    }));
  };

  const updateText = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: { ...previous[field], [editorLang]: value } }));
  };

  const updateOption = (index, value) => {
    setForm((previous) => ({
      ...previous,
      options: previous.options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, [editorLang]: value } : option
      ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.topicId) {
      toast.error('Choose a grade, subject and topic');
      return;
    }
    if (!form.question.en.trim()) {
      toast.error('English question text is required');
      return;
    }
    if (form.options.some((option) => !option.en.trim())) {
      toast.error('All four English answer options are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        topicId: form.topicId,
        question: form.question,
        options: form.options,
        correctAnswer: form.correctAnswer,
        explanation: form.explanation,
        difficulty: form.difficulty,
        isActive: form.isActive,
      };

      if (editing) {
        await adminApi.updateQuestion(editing._id || editing.id, payload);
        toast.success('Question updated.');
      } else {
        await adminApi.createQuestion(payload);
        toast.success('Question created.');
        setPage(1);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (question) => {
    try {
      await adminApi.setQuestionStatus(question._id, !question.isActive);
      toast.success(question.isActive ? 'Question unpublished.' : 'Question published.');
      setQuestions((previous) =>
        previous.map((item) =>
          item._id === question._id ? { ...item, isActive: !item.isActive } : item
        )
      );
    } catch (err) {
      toast.error(err.message || t('common.error'));
    }
  };

  const handleDelete = async (question) => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    try {
      await adminApi.deleteQuestion(question._id);
      toast.success('Question deleted.');
      load();
    } catch (err) {
      toast.error(err.message || t('common.error'));
    }
  };

  if (metaLoading) return <Loading full />;

  const editorDir = editorLang === 'en' ? 'ltr' : 'rtl';

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('admin.panel')}
        title={t('admin.manageQuestions')}
        subtitle={t('admin.questionsSubtitle')}
      >
        <button type="button" onClick={openCreate} className="btn btn-primary btn-sm gap-1.5">
          <Plus size={15} /> {t('admin.addQuestion')}
        </button>
      </PageHeader>

      <div className="app-card space-y-3 p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-base-content/35" size={16} />
            <input
              className="app-input ps-9"
              placeholder={`${t('common.search')} ${t('common.questions').toLowerCase()}…`}
              value={filters.search}
              onChange={(event) => setFilter('search', event.target.value)}
            />
          </label>

          <select className="app-select lg:w-36" value={filters.gradeId} onChange={(event) => setFilter('gradeId', event.target.value)}>
            <option value="">{t('admin.allGrades')}</option>
            {meta.grades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.name}
              </option>
            ))}
          </select>

          <select className="app-select lg:w-44" value={filters.subjectId} onChange={(event) => setFilter('subjectId', event.target.value)}>
            <option value="">{t('admin.allSubjects')}</option>
            {filterSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <select className="app-select flex-1" value={filters.topicId} onChange={(event) => setFilter('topicId', event.target.value)}>
            <option value="">{t('admin.allTopics')}</option>
            {filterTopics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>

          <select className="app-select lg:w-40" value={filters.difficulty} onChange={(event) => setFilter('difficulty', event.target.value)}>
            <option value="">{t('common.difficulty')}</option>
            {DIFFICULTIES.map((level) => (
              <option key={level} value={level}>
                {t(`common.${level}`)}
              </option>
            ))}
          </select>

          <select className="app-select lg:w-40" value={filters.status} onChange={(event) => setFilter('status', event.target.value)}>
            <option value="">{t('common.status')}</option>
            <option value="active">{t('admin.published')}</option>
            <option value="inactive">{t('admin.unpublished')}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="app-card p-6 text-center">
          <p className="font-semibold text-error">{error}</p>
          <button type="button" className="btn btn-primary btn-sm mt-4" onClick={load}>
            {t('common.retry')}
          </button>
        </div>
      ) : questions.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title={t('admin.noQuestions')}
          description={t('admin.addFirst')}
          action={
            <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
              {t('admin.addQuestion')}
            </button>
          }
        />
      ) : (
        <>
          <section className="app-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>{t('common.question')}</th>
                    <th>{t('common.subject')}</th>
                    <th>{t('common.topic')}</th>
                    <th className="hidden lg:table-cell">{t('common.grade')}</th>
                    <th>{t('common.difficulty')}</th>
                    <th>{t('common.status')}</th>
                    <th className="text-end">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question) => (
                    <tr key={question._id}>
                      <td className="max-w-xs">
                        <p className="truncate font-medium" title={question.question?.en}>
                          {question.question?.en}
                        </p>
                        <p className="text-[11px] text-base-content/40">
                          {question.options?.length || 0} {t('admin.options').toLowerCase()}
                        </p>
                      </td>
                      <td className="whitespace-nowrap text-base-content/70">{question.subjectId?.name || '—'}</td>
                      <td className="whitespace-nowrap text-base-content/70">{question.topicId?.name || '—'}</td>
                      <td className="hidden whitespace-nowrap lg:table-cell">{question.gradeId?.name || '—'}</td>
                      <td>
                        <span className="badge badge-ghost badge-sm capitalize">{t(`common.${question.difficulty}`)}</span>
                      </td>
                      <td>
                        <span
                          className={cn(
                            'rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide',
                            question.isActive ? 'bg-success/10 text-success' : 'bg-base-200 text-base-content/45'
                          )}
                        >
                          {question.isActive ? t('admin.published') : t('admin.unpublished')}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => togglePublish(question)}
                            className="btn btn-ghost btn-xs gap-1"
                            title={question.isActive ? t('admin.unpublish') : t('admin.publish')}
                          >
                            {question.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                            <span className="hidden xl:inline">
                              {question.isActive ? t('admin.unpublish') : t('admin.publish')}
                            </span>
                          </button>
                          <button type="button" onClick={() => openEdit(question)} className="btn btn-ghost btn-xs gap-1">
                            <Edit3 size={13} /> <span className="hidden xl:inline">{t('common.edit')}</span>
                          </button>
                          <button type="button" onClick={() => handleDelete(question)} className="btn btn-ghost btn-xs text-error">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-base-content/55">
              {t('common.page')} {pagination.page} {t('common.of')} {pagination.pages} · {pagination.total}{' '}
              {t('common.questions').toLowerCase()}
            </p>
            <div className="flex items-center gap-2">
              <button type="button" className="btn btn-outline btn-sm gap-1" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={pagination.page <= 1}>
                <ChevronLeft size={15} /> {t('common.previous')}
              </button>
              <button type="button" className="btn btn-outline btn-sm gap-1" onClick={() => setPage((value) => Math.min(pagination.pages, value + 1))} disabled={pagination.page >= pagination.pages}>
                {t('common.next')} <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t('admin.editQuestion') : t('admin.addQuestion')}
        description={t('admin.translationsHint')}
        size="xl"
        footer={
          <>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}>
              {t('common.cancel')}
            </button>
            <button type="submit" form="question-form" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? t('common.saving') : t('common.save')}
            </button>
          </>
        }
      >
        <form id="question-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="question-grade">
                {t('common.grade')}
              </label>
              <select
                id="question-grade"
                className="app-select"
                value={form.gradeId}
                onChange={(event) => changeGrade(event.target.value)}
              >
                <option value="">{t('admin.allGrades')}</option>
                {meta.grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="question-subject">
                {t('common.subject')}
              </label>
              <select
                id="question-subject"
                className="app-select"
                value={form.subjectId}
                onChange={(event) => changeSubject(event.target.value)}
              >
                <option value="">{t('admin.allSubjects')}</option>
                {modalSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="question-topic">
                {t('common.topic')}
              </label>
              <select
                id="question-topic"
                className="app-select"
                value={form.topicId}
                onChange={(event) => setForm((previous) => ({ ...previous, topicId: event.target.value }))}
              >
                <option value="">{form.subjectId ? t('common.topic') : t('admin.selectSubjectFirst')}</option>
                {modalTopics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-base-200/70 p-1.5">
            <div className="flex gap-1">
              {EDITOR_LANGUAGES.map((item) => {
                const filled = Boolean(form.question[item.code]?.trim());
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setEditorLang(item.code)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition',
                      editorLang === item.code
                        ? 'bg-base-100 text-primary shadow-sm'
                        : 'text-base-content/55 hover:text-base-content'
                    )}
                  >
                    {item.native}
                    {filled && <span className="h-1.5 w-1.5 rounded-full bg-success" />}
                  </button>
                );
              })}
            </div>
            <span className="px-2 text-[10px] font-semibold uppercase tracking-wide text-base-content/40">
              {editorLang === 'en' ? 'Required' : 'Optional'}
            </span>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="question-text">
              {t('admin.questionText')} {editorLang === 'en' && <span className="text-error">*</span>}
            </label>
            <textarea
              id="question-text"
              dir={editorDir}
              rows={3}
              className={cn('app-textarea', editorLang !== 'en' && 'font-arabic')}
              value={form.question[editorLang]}
              onChange={(event) => updateText('question', event.target.value)}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">{t('admin.options')}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-base-content/40">
                {t('admin.correctOption')}
              </p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {form.options.map((option, index) => (
                <div
                  key={`option-${index}`}
                  className={cn(
                    'rounded-xl border-2 p-3 transition',
                    form.correctAnswer === index
                      ? 'border-success bg-success/5'
                      : 'border-base-300 bg-base-100'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        'grid h-7 w-7 place-items-center rounded-lg text-xs font-extrabold',
                        form.correctAnswer === index ? 'bg-success text-white' : 'bg-base-200 text-base-content/55'
                      )}
                    >
                      {LETTERS[index]}
                    </span>
                    <label className="flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-base-content/55">
                      <input
                        type="radio"
                        name="correct-answer"
                        className="radio radio-success radio-xs"
                        checked={form.correctAnswer === index}
                        onChange={() => setForm((previous) => ({ ...previous, correctAnswer: index }))}
                      />
                      {t('admin.correctOption')}
                    </label>
                  </div>
                  <input
                    dir={editorDir}
                    className={cn('app-input mt-2 text-sm', editorLang !== 'en' && 'font-arabic')}
                    placeholder={`${t('admin.options')} ${LETTERS[index]} (${editorLang.toUpperCase()})`}
                    value={option[editorLang]}
                    onChange={(event) => updateOption(index, event.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="question-explanation">
              {t('admin.explanation')}
            </label>
            <textarea
              id="question-explanation"
              dir={editorDir}
              rows={2}
              className={cn('app-textarea', editorLang !== 'en' && 'font-arabic')}
              value={form.explanation[editorLang]}
              onChange={(event) => updateText('explanation', event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="question-difficulty">
                {t('common.difficulty')}
              </label>
              <select
                id="question-difficulty"
                className="app-select capitalize"
                value={form.difficulty}
                onChange={(event) => setForm((previous) => ({ ...previous, difficulty: event.target.value }))}
              >
                {DIFFICULTIES.map((level) => (
                  <option key={level} value={level}>
                    {t(`common.${level}`)}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-3 self-end rounded-xl bg-base-200/60 px-3 py-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={form.isActive}
                onChange={(event) => setForm((previous) => ({ ...previous, isActive: event.target.checked }))}
              />
              <span className="text-sm font-semibold">{t('admin.published')}</span>
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}
