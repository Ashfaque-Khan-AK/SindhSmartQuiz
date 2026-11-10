import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, Lock, Mail, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthCard from '../../components/auth/AuthCard';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Register() {
  const { register } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialGrade = Number(searchParams.get('grade')) || 8;

  const [form, setForm] = useState({
    name: '',
    email: '',
    grade: initialGrade,
    language,
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.name.trim().length < 2) {
      toast.error('Please enter your full name');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (form.password.length < 6) {
      toast.error(t('auth.passwordShort'));
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error(t('auth.passwordMismatch'));
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        grade: Number(form.grade),
        language: form.language,
      });
      toast.success(t('auth.registerSuccess'));
      navigate('/login', { state: { email: form.email.trim().toLowerCase() }, replace: true });
    } catch (error) {
      toast.error(error.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title={t('auth.createAccount')}
      subtitle={t('auth.createSubtitle')}
      footer={
        <span className="text-base-content/60">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            {t('auth.signIn')}
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="name">
            {t('auth.fullName')}
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-base-content/35" size={17} />
            <input
              id="name"
              className="app-input ps-10"
              placeholder="Ali Raza"
              value={form.name}
              onChange={update('name')}
              autoComplete="name"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="email">
            {t('auth.email')}
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-base-content/35" size={17} />
            <input
              id="email"
              type="email"
              className="app-input ps-10"
              placeholder="you@example.com"
              value={form.email}
              onChange={update('email')}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="grade">
              {t('common.grade')}
            </label>
            <select id="grade" className="app-select" value={form.grade} onChange={update('grade')}>
              {[6, 7, 8, 9, 10].map((grade) => (
                <option key={grade} value={grade}>
                  {t('common.grade')} {grade}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="language">
              {t('auth.language')}
            </label>
            <select id="language" className="app-select" value={form.language} onChange={update('language')}>
              <option value="en">English</option>
              <option value="ur">اردو</option>
              <option value="sd">سنڌي</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="password">
            {t('auth.password')}
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-base-content/35" size={17} />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="app-input px-10"
              placeholder="••••••••"
              value={form.password}
              onChange={update('password')}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute end-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-base-content/40 hover:text-base-content"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="confirmPassword">
            {t('auth.confirmPassword')}
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-base-content/35" size={17} />
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              className="app-input ps-10"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full gap-2" disabled={submitting}>
          <GraduationCap size={18} />
          {submitting ? t('common.saving') : t('auth.submitRegister')}
        </button>
      </form>
    </AuthCard>
  );
}
