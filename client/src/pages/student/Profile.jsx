import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CalendarDays,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  Target,
  UserRound,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Avatar from '../../components/common/Avatar';
import Loading from '../../components/common/Loading';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { studentApi } from '../../services';
import { formatDate } from '../../utils/helpers';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    grade: user?.grade || 8,
    language: user?.language || language,
  });
  const [stats, setStats] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    studentApi
      .dashboard()
      .then((data) => setStats(data.stats))
      .catch(() => {});
  }, []);

  const handleProfile = async (event) => {
    event.preventDefault();
    if (profile.name.trim().length < 2) {
      toast.error('Please enter your full name');
      return;
    }

    setSavingProfile(true);
    try {
      const data = await studentApi.updateProfile({
        name: profile.name.trim(),
        grade: Number(profile.grade),
        language: profile.language,
      });
      updateUser({
        name: data.user?.name || profile.name.trim(),
        grade: data.user?.grade ?? Number(profile.grade),
        language: data.user?.language || profile.language,
      });
      setLanguage(profile.language);
      toast.success(t('student.profileUpdated'));
    } catch (error) {
      toast.error(error.message || t('common.error'));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePassword = async (event) => {
    event.preventDefault();
    if (passwords.newPassword.length < 6) {
      toast.error(t('auth.passwordShort'));
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error(t('auth.passwordMismatch'));
      return;
    }

    setSavingPassword(true);
    try {
      await studentApi.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success(t('student.passwordChanged'));
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || t('common.error'));
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    if (!window.confirm(t('student.sureLogout'))) return;
    logout();
    navigate('/');
  };

  const handlePasswordUpdate = (field) => (event) => {
    setPasswords((previous) => ({ ...previous, [field]: event.target.value }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('nav.profile')}
        title={t('student.profileDetails')}
        subtitle={t('student.profileSubtitle')}
      />

      <section className="app-card flex flex-col items-start gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        <Avatar name={user?.name} size="xl" />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-extrabold">{user?.name}</h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-base-content/55">
            <Mail size={14} /> {user?.email}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
              {t('common.grade')} {user?.grade || '—'}
            </span>
            <span className="rounded-full bg-secondary/15 px-2.5 py-1 text-amber-700">
              {user?.totalXP || 0} XP
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-base-200 px-2.5 py-1 text-base-content/55">
              <CalendarDays size={11} /> {t('student.memberSince')} {formatDate(user?.createdAt)}
            </span>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="btn btn-outline btn-sm gap-1.5 text-error">
          <LogOut size={15} /> {t('nav.logout')}
        </button>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Zap, label: t('student.totalXP'), value: stats?.totalXP ?? user?.totalXP ?? 0, tone: 'bg-secondary/15 text-amber-600' },
          { icon: BookOpen, label: t('student.quizzesTaken'), value: stats?.quizzesAttempted ?? 0, tone: 'bg-primary/10 text-primary' },
          { icon: Target, label: t('student.averageScore'), value: `${stats?.averageScore ?? 0}%`, tone: 'bg-success/10 text-success' },
          { icon: ShieldCheck, label: t('nav.achievements'), value: `${stats?.achievementsEarned ?? 0}/${stats?.totalAchievements ?? 0}`, tone: 'bg-accent/10 text-accent' },
        ].map((item) => (
          <div key={item.label} className="app-card p-4">
            <span className={`grid h-9 w-9 place-items-center rounded-xl ${item.tone}`}>
              <item.icon size={17} />
            </span>
            <p className="mt-2.5 text-xl font-extrabold">{item.value}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-base-content/45">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleProfile} className="app-card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-bold">
            <UserRound size={17} className="text-primary" /> {t('student.editProfile')}
          </h2>
          <p className="mt-1 text-xs text-base-content/50">
            Update your display name, grade and preferred language.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="profile-name">
                {t('auth.fullName')}
              </label>
              <input
                id="profile-name"
                className="app-input"
                value={profile.name}
                onChange={(event) => setProfile((previous) => ({ ...previous, name: event.target.value }))}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="profile-email">
                {t('auth.email')}
              </label>
              <input id="profile-email" className="app-input opacity-60" value={user?.email || ''} disabled />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="profile-grade">
                  {t('common.grade')}
                </label>
                <select
                  id="profile-grade"
                  className="app-select"
                  value={profile.grade}
                  onChange={(event) => setProfile((previous) => ({ ...previous, grade: Number(event.target.value) }))}
                >
                  {[6, 7, 8, 9, 10].map((grade) => (
                    <option key={grade} value={grade}>
                      {t('common.grade')} {grade}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="profile-language">
                  {t('auth.language')}
                </label>
                <select
                  id="profile-language"
                  className="app-select"
                  value={profile.language}
                  onChange={(event) => setProfile((previous) => ({ ...previous, language: event.target.value }))}
                >
                  <option value="en">English</option>
                  <option value="ur">اردو</option>
                  <option value="sd">سنڌي</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-5 w-full gap-1.5" disabled={savingProfile}>
            <Save size={16} /> {savingProfile ? t('common.saving') : t('student.saveChanges')}
          </button>
        </form>

        <form onSubmit={handlePassword} className="app-card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-bold">
            <KeyRound size={17} className="text-primary" /> {t('student.accountSecurity')}
          </h2>
          <p className="mt-1 text-xs text-base-content/50">{t('student.changePassword')}</p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="current-password">
                {t('student.currentPassword')}
              </label>
              <input
                id="current-password"
                type={showPasswords ? 'text' : 'password'}
                className="app-input"
                value={passwords.currentPassword}
                onChange={handlePasswordUpdate('currentPassword')}
                autoComplete="current-password"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="new-password">
                {t('student.newPassword')}
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPasswords ? 'text' : 'password'}
                  className="app-input pe-10"
                  value={passwords.newPassword}
                  onChange={handlePasswordUpdate('newPassword')}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((value) => !value)}
                  className="absolute end-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-base-content/40 hover:text-base-content"
                  aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
                >
                  {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="confirm-password">
                {t('student.confirmNewPassword')}
              </label>
              <input
                id="confirm-password"
                type={showPasswords ? 'text' : 'password'}
                className="app-input"
                value={passwords.confirmPassword}
                onChange={handlePasswordUpdate('confirmPassword')}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-outline mt-5 w-full gap-1.5" disabled={savingPassword}>
            <ShieldCheck size={16} /> {savingPassword ? t('common.saving') : t('student.changePassword')}
          </button>
        </form>
      </div>
    </div>
  );
}
