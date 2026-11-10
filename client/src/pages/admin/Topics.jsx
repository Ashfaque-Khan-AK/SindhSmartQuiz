import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edit3, ListTree, Plus, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { adminApi } from '../../services';
import { cn } from '../../utils/helpers';

const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function AdminTopics() {
  const { t } = useLanguage();
  const [meta, setMeta] = useState({ grades: [], subjects: [] });
  const [metaLoading, setMetaLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ gradeId: '', subjectId: '', search: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', gradeId: '', subjectId: '', difficulty: 'easy', isActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([adminApi.grades(), adminApi.subjects()])
      .then(([grades, subjects]) => setMeta({ grades: grades || [], subjects: subjects || [] }))
      .catch((err) => toast.error(err.message || t('common.error')))
      .finally(() => setMetaLoading(false));
  }, [t]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.topics({
        gradeId: filters.gradeId || undefined,
        subjectId: filters.subjectId || undefined,
        search: filters.search || undefined,
      });
      setTopics(response || []);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [filters, t]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  const setFilter = (field, value) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
      ...(field === 'gradeId' ? { subjectId: '' } : {}),
    }));
  };

  const eligibleSubjects = useMemo(
    () =>
      meta.subjects.filter(
        (subject) =>
          !form.gradeId ||
          (subject.grades || []).some((grade) => String(grade._id || grade) === String(form.gradeId))
      ),
    [meta.subjects, form.gradeId]
  );

  const filterSubjects = useMemo(
    () =>
      meta.subjects.filter(
        (subject) =>
          !filters.gradeId ||
          (subject.grades || []).some((grade) => String(grade._id || grade) === String(filters.gradeId))
      ),
    [meta.subjects, filters.gradeId]
  );

  const openCreate = () => {
    const gradeId = meta.grades[0]?.id || '';
    const subject = meta.subjects.find((item) =>
      (item.grades || []).some((grade) => String(grade._id || grade) === String(gradeId))
    );
    setEditing(null);
    setForm({ name: '', gradeId, subjectId: subject?.id || '', difficulty: 'easy', isActive: true });
    setModalOpen(true);
  };

  const openEdit = (topic) => {
    setEditing(topic);
    setForm({
      name: topic.name,
      gradeId: String(topic.gradeId?._id || topic.gradeId || ''),
      subjectId: String(topic.subjectId?._id || topic.subjectId || ''),
      difficulty: topic.difficulty || 'easy',
      isActive: topic.isActive !== false,
    });
    setModalOpen(true);
  };

  const changeGrade = (gradeId) => {
    const subjectStillValid = meta.subjects.some(
      (subject) =>
        String(subject.id) === String(form.subjectId) &&
        (subject.grades || []).some((grade) => String(grade._id || grade) === String(gradeId))
    );
    setForm((previous) => ({ ...previous, gradeId, subjectId: subjectStillValid ? previous.subjectId : '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error('Topic name is required');
      return;
    }
    if (!form.gradeId || !form.subjectId) {
      toast.error('Choose a grade and subject');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        gradeId: form.gradeId,
        subjectId: form.subjectId,
        difficulty: form.difficulty,
        isActive: form.isActive,
      };
      if (editing) {
        await adminApi.updateTopic(editing.id, payload);
        toast.success('Topic updated.');
      } else {
        await adminApi.createTopic(payload);
        toast.success('Topic created.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (topic) => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    try {
      await adminApi.deleteTopic(topic.id);
      toast.success('Topic deleted.');
      load();
    } catch (err) {
      toast.error(err.message || t('common.error'));
    }
  };

  if (metaLoading) return <Loading full />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('admin.panel')}
        title={t('admin.manageTopics')}
        subtitle={t('admin.topicsSubtitle')}
      >
        <button type="button" onClick={openCreate} className="btn btn-primary btn-sm gap-1.5">
          <Plus size={15} /> {t('admin.addTopic')}
        </button>
      </PageHeader>

      <div className="app-card flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-base-content/35" size={16} />
          <input
            className="app-input ps-9"
            placeholder={`${t('common.search')} ${t('student.topics').toLowerCase()}…`}
            value={filters.search}
            onChange={(event) => setFilter('search', event.target.value)}
          />
        </label>

        <select className="app-select lg:w-40" value={filters.gradeId} onChange={(event) => setFilter('gradeId', event.target.value)}>
          <option value="">{t('admin.allGrades')}</option>
          {meta.grades.map((grade) => (
            <option key={grade.id} value={grade.id}>
              {grade.name}
            </option>
          ))}
        </select>

        <select className="app-select lg:w-48" value={filters.subjectId} onChange={(event) => setFilter('subjectId', event.target.value)}>
          <option value="">{t('admin.allSubjects')}</option>
          {filterSubjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
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
      ) : topics.length === 0 ? (
        <EmptyState
          icon={ListTree}
          title={t('admin.noTopics')}
          description={t('admin.addFirst')}
          action={
            <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
              {t('admin.addTopic')}
            </button>
          }
        />
      ) : (
        <section className="app-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="app-table">
              <thead>
                <tr>
                  <th>{t('common.topic')}</th>
                  <th>{t('common.subject')}</th>
                  <th>{t('common.grade')}</th>
                  <th>{t('common.difficulty')}</th>
                  <th className="text-end">{t('common.questions')}</th>
                  <th>{t('common.status')}</th>
                  <th className="text-end">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((topic) => (
                  <tr key={topic.id}>
                    <td className="font-semibold">{topic.name}</td>
                    <td className="text-base-content/70">{topic.subjectId?.name || '—'}</td>
                    <td className="whitespace-nowrap">{topic.gradeId?.name || '—'}</td>
                    <td>
                      <span className="badge badge-ghost badge-sm capitalize">{t(`common.${topic.difficulty}`)}</span>
                    </td>
                    <td className="text-end">
                      <span className="font-semibold">{topic.questions}</span>
                      <span className="text-[11px] text-base-content/40"> ({topic.activeQuestions} active)</span>
                    </td>
                    <td>
                      <span
                        className={cn(
                          'rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide',
                          topic.isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                        )}
                      >
                        {topic.isActive ? t('common.active') : t('common.inactive')}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => openEdit(topic)} className="btn btn-ghost btn-xs gap-1">
                          <Edit3 size={13} /> <span className="hidden md:inline">{t('common.edit')}</span>
                        </button>
                        <button type="button" onClick={() => handleDelete(topic)} className="btn btn-ghost btn-xs text-error">
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
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t('admin.editTopic') : t('admin.addTopic')}
        size="md"
        footer={
          <>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}>
              {t('common.cancel')}
            </button>
            <button type="submit" form="topic-form" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? t('common.saving') : t('common.save')}
            </button>
          </>
        }
      >
        <form id="topic-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="topic-name">
              {t('admin.topicName')}
            </label>
            <input
              id="topic-name"
              className="app-input"
              value={form.name}
              onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="topic-grade">
                {t('common.grade')}
              </label>
              <select
                id="topic-grade"
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
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="topic-subject">
                {t('common.subject')}
              </label>
              <select
                id="topic-subject"
                className="app-select"
                value={form.subjectId}
                onChange={(event) => setForm((previous) => ({ ...previous, subjectId: event.target.value }))}
              >
                <option value="">{t('admin.allSubjects')}</option>
                {eligibleSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="topic-difficulty">
              {t('common.difficulty')}
            </label>
            <select
              id="topic-difficulty"
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

          <label className="flex items-center gap-3 rounded-xl bg-base-200/60 px-3 py-3">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={form.isActive}
              onChange={(event) => setForm((previous) => ({ ...previous, isActive: event.target.checked }))}
            />
            <span className="text-sm font-semibold">{t('common.active')}</span>
          </label>
        </form>
      </Modal>
    </div>
  );
}
