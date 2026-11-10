import { useCallback, useEffect, useState } from 'react';
import { Edit3, GraduationCap, Layers, Plus, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { adminApi } from '../../services';
import { cn } from '../../utils/helpers';

export default function AdminGrades() {
  const { t } = useLanguage();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ number: 6, name: '', isActive: true });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.grades();
      setGrades(response || []);
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
    const used = new Set(grades.map((grade) => grade.number));
    const next = [6, 7, 8, 9, 10, 11, 12].find((number) => !used.has(number)) || 6;
    setEditing(null);
    setForm({ number: next, name: `Grade ${next}`, isActive: true });
    setModalOpen(true);
  };

  const openEdit = (grade) => {
    setEditing(grade);
    setForm({ number: grade.number, name: grade.name, isActive: grade.isActive });
    setModalOpen(true);
  };

  const handleNumber = (value) => {
    const number = Number(value);
    setForm((previous) => ({
      ...previous,
      number,
      name:
        !previous.name || previous.name === `Grade ${previous.number}`
          ? `Grade ${number}`
          : previous.name,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        number: Number(form.number),
        name: form.name.trim() || `Grade ${form.number}`,
        isActive: form.isActive,
      };
      if (editing) {
        await adminApi.updateGrade(editing.id, payload);
        toast.success('Grade updated.');
      } else {
        await adminApi.createGrade(payload);
        toast.success('Grade created.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (grade) => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    try {
      await adminApi.deleteGrade(grade.id);
      toast.success('Grade deleted.');
      load();
    } catch (err) {
      toast.error(err.message || t('common.error'));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('admin.panel')}
        title={t('admin.manageGrades')}
        subtitle={t('admin.gradesSubtitle')}
      >
        <button type="button" onClick={openCreate} className="btn btn-primary btn-sm gap-1.5">
          <Plus size={15} /> {t('admin.addGrade')}
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
      ) : grades.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={t('admin.noGrades') || 'No grades yet'}
          description={t('admin.addFirst')}
          action={
            <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
              {t('admin.addGrade')}
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {grades.map((grade) => (
            <article key={grade.id} className="app-card p-5">
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-teal-600 text-white shadow-md">
                  <GraduationCap size={23} />
                </span>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
                    grade.isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                  )}
                >
                  {grade.isActive ? t('common.active') : t('common.inactive')}
                </span>
              </div>

              <h2 className="mt-4 text-lg font-extrabold">{grade.name}</h2>
              <p className="text-xs text-base-content/45">
                {t('admin.gradeNumber')} {grade.number}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-base-200/70 px-3 py-2">
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-base-content/45">
                    <Users size={11} /> {t('common.students')}
                  </p>
                  <p className="mt-0.5 font-bold">{grade.students}</p>
                </div>
                <div className="rounded-xl bg-base-200/70 px-3 py-2">
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-base-content/45">
                    <Layers size={11} /> {t('student.topics')}
                  </p>
                  <p className="mt-0.5 font-bold">{grade.topics}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-base-200 pt-4">
                <button type="button" onClick={() => openEdit(grade)} className="btn btn-outline btn-sm flex-1 gap-1.5">
                  <Edit3 size={14} /> {t('common.edit')}
                </button>
                <button type="button" onClick={() => handleDelete(grade)} className="btn btn-ghost btn-sm text-error">
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
        title={editing ? t('admin.editGrade') : t('admin.addGrade')}
        size="sm"
        footer={
          <>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}>
              {t('common.cancel')}
            </button>
            <button type="submit" form="grade-form" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? t('common.saving') : t('common.save')}
            </button>
          </>
        }
      >
        <form id="grade-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="grade-number">
              {t('admin.gradeNumber')}
            </label>
            <select
              id="grade-number"
              className="app-select"
              value={form.number}
              onChange={(event) => handleNumber(event.target.value)}
            >
              {[6, 7, 8, 9, 10, 11, 12].map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="grade-name">
              {t('admin.gradeName')}
            </label>
            <input
              id="grade-name"
              className="app-input"
              value={form.name}
              onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
              placeholder={`Grade ${form.number}`}
            />
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
