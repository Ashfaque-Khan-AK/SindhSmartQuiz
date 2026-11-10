import { useCallback, useEffect, useState } from 'react';
import { BookMarked, Edit3, HelpCircle, ListTree, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import DynamicIcon from '../../components/common/DynamicIcon';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { adminApi } from '../../services';
import { SUBJECT_ICON_OPTIONS, cn } from '../../utils/helpers';

const COLORS = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'];

const EMPTY_FORM = {
  name: '',
  description: '',
  icon: 'BookOpen',
  color: 'primary',
  grades: [],
  isActive: true,
};

export default function AdminSubjects() {
  const { t } = useLanguage();
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [subjectList, gradeList] = await Promise.all([adminApi.subjects(), adminApi.grades()]);
      setSubjects(subjectList || []);
      setGrades(gradeList || []);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (subject) => {
    setEditing(subject);
    setForm({
      name: subject.name || '',
      description: subject.description || '',
      icon: subject.icon || 'BookOpen',
      color: subject.color || 'primary',
      grades: (subject.grades || []).map((grade) => String(grade._id || grade)),
      isActive: subject.isActive !== false,
    });
    setModalOpen(true);
  };

  const toggleGrade = (gradeId) => {
    setForm((previous) => ({
      ...previous,
      grades: previous.grades.includes(gradeId)
        ? previous.grades.filter((id) => id !== gradeId)
        : [...previous.grades, gradeId],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error('Subject name is required');
      return;
    }
    if (form.grades.length === 0) {
      toast.error('Assign the subject to at least one grade');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        icon: form.icon,
        color: form.color,
        grades: form.grades,
        isActive: form.isActive,
      };
      if (editing) {
        await adminApi.updateSubject(editing.id, payload);
        toast.success('Subject updated.');
      } else {
        await adminApi.createSubject(payload);
        toast.success('Subject created.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (subject) => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    try {
      await adminApi.deleteSubject(subject.id);
      toast.success('Subject deleted.');
      load();
    } catch (err) {
      toast.error(err.message || t('common.error'));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('admin.panel')}
        title={t('admin.manageSubjects')}
        subtitle={t('admin.subjectsSubtitle')}
      >
        <button type="button" onClick={openCreate} className="btn btn-primary btn-sm gap-1.5">
          <Plus size={15} /> {t('admin.addSubject')}
        </button>
      </PageHeader>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="app-card p-6 text-center">
          <p className="font-semibold text-error">{error}</p>
          <button type="button" className="btn btn-primary btn-sm mt-4" onClick={load}>
            {t('common.retry')}
          </button>
        </div>
      ) : subjects.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title={t('admin.noSubjects')}
          description={t('admin.addFirst')}
          action={
            <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
              {t('admin.addSubject')}
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {subjects.map((subject) => (
            <article key={subject.id} className="app-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <DynamicIcon name={subject.icon} size={23} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-base font-extrabold">{subject.name}</h2>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-base-content/55">
                      {subject.description || '—'}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
                    subject.isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                  )}
                >
                  {subject.isActive ? t('common.active') : t('common.inactive')}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {(subject.grades || []).map((grade) => (
                  <span
                    key={grade._id || grade}
                    className="rounded-full bg-base-200 px-2.5 py-1 text-[10px] font-bold text-base-content/60"
                  >
                    {grade.number ? `${t('common.grade')} ${grade.number}` : grade.name || grade}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-base-200/70 px-3 py-2">
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-base-content/45">
                    <ListTree size={11} /> {t('student.topics')}
                  </p>
                  <p className="mt-0.5 font-bold">{subject.topics}</p>
                </div>
                <div className="rounded-xl bg-base-200/70 px-3 py-2">
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-base-content/45">
                    <HelpCircle size={11} /> {t('common.questions')}
                  </p>
                  <p className="mt-0.5 font-bold">{subject.questions}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-base-200 pt-4">
                <button type="button" onClick={() => openEdit(subject)} className="btn btn-outline btn-sm flex-1 gap-1.5">
                  <Edit3 size={14} /> {t('common.edit')}
                </button>
                <button type="button" onClick={() => handleDelete(subject)} className="btn btn-ghost btn-sm text-error">
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t('admin.editSubject') : t('admin.addSubject')}
        size="lg"
        footer={
          <>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}>
              {t('common.cancel')}
            </button>
            <button type="submit" form="subject-form" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? t('common.saving') : t('common.save')}
            </button>
          </>
        }
      >
        <form id="subject-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="subject-name">
              {t('admin.subjectName')}
            </label>
            <input
              id="subject-name"
              className="app-input"
              value={form.name}
              onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="subject-description">
              {t('admin.description')}
            </label>
            <textarea
              id="subject-description"
              className="app-textarea"
              rows={3}
              value={form.description}
              onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="subject-icon">
                {t('admin.icon')}
              </label>
              <div className="flex items-center gap-2">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <DynamicIcon name={form.icon} size={19} />
                </span>
                <select
                  id="subject-icon"
                  className="app-select"
                  value={form.icon}
                  onChange={(event) => setForm((previous) => ({ ...previous, icon: event.target.value }))}
                >
                  {SUBJECT_ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="subject-color">
                {t('admin.color')}
              </label>
              <select
                id="subject-color"
                className="app-select capitalize"
                value={form.color}
                onChange={(event) => setForm((previous) => ({ ...previous, color: event.target.value }))}
              >
                {COLORS.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-semibold">{t('admin.assignGrades')}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {grades.map((grade) => (
                <label
                  key={grade.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm',
                    form.grades.includes(String(grade.id))
                      ? 'border-primary bg-primary/10 font-semibold text-primary'
                      : 'border-base-300 bg-base-100 text-base-content/70'
                  )}
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-xs"
                    checked={form.grades.includes(String(grade.id))}
                    onChange={() => toggleGrade(String(grade.id))}
                  />
                  {grade.name}
                </label>
              ))}
            </div>
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
