import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, LogIn, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthCard from '../../components/auth/AuthCard';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Login({ admin = false }) {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: location.state?.email || '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password) {
      toast.error('Please enter your email and password');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(form.email.trim(), form.password, admin ? 'admin' : undefined);
      toast.success(`Welcome, ${user.name.split(' ')[0]}!`);
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(location.state?.from || '/student/dashboard', { replace: true });
      }
    } catch (error) {
      toast.error(error.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      variant={admin ? 'admin' : 'student'}
      title={admin ? t('auth.adminLogin') : t('auth.welcomeBack')}
      subtitle={admin ? t('auth.adminSubtitle') : t('auth.loginSubtitle')}
      footer={
        admin ? (
          <Link to="/login" className="font-semibold text-primary hover:underline">
            ← {t('auth.studentLogin')}
          </Link>
        ) : (
          <span className="text-base-content/60">
            {t('auth.newHere')}{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              {t('auth.createOne')}
            </Link>
            <span className="mx-2 text-base-content/25">·</span>
            <Link to="/admin/login" className="font-semibold text-accent hover:underline">
              {t('auth.adminLogin')}
            </Link>
          </span>
        )
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="email">
            {t('common.email')}
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

        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="password">
            {t('common.password')}
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
              autoComplete="current-password"
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

        <button type="submit" className="btn btn-primary w-full gap-2" disabled={submitting}>
          {admin ? <ShieldCheck size={18} /> : <LogIn size={18} />}
          {submitting ? t('common.loading') : admin ? t('auth.adminButton') : t('auth.loginButton')}
        </button>
      </form>
    </AuthCard>
  );
}
