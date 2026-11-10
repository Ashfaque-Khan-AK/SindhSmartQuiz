import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BookMarked,
  ClipboardList,
  HelpCircle,
  Layers,
  LayoutDashboard,
  ListTree,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import Avatar from '../components/common/Avatar';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import Logo from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/helpers';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const items = [
    { to: '/admin/dashboard', label: t('admin.overview'), icon: LayoutDashboard },
    { to: '/admin/students', label: t('admin.manageStudents'), icon: Users },
    { to: '/admin/grades', label: t('admin.manageGrades'), icon: Layers },
    { to: '/admin/subjects', label: t('admin.manageSubjects'), icon: BookMarked },
    { to: '/admin/topics', label: t('admin.manageTopics'), icon: ListTree },
    { to: '/admin/questions', label: t('admin.manageQuestions'), icon: HelpCircle },
    { to: '/admin/attempts', label: t('admin.attempts'), icon: ClipboardList },
    { to: '/admin/reports', label: t('admin.reports'), icon: BarChart3 },
  ];

  const handleLogout = () => {
    if (!window.confirm(t('student.sureLogout'))) return;
    logout();
    navigate('/');
  };

  const Sidebar = ({ mobile = false }) => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-base-200 px-4">
        <Logo to="/admin/dashboard" />
        {mobile && (
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-circle"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="px-4 pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
          <ShieldCheck size={13} /> {t('admin.panel')}
        </span>
      </div>

      <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn('nav-item', isActive && 'nav-item-active')}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-base-200 p-3">
        <div className="flex items-center gap-3 rounded-2xl bg-base-200/70 p-3">
          <Avatar name={user?.name} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{user?.name}</p>
            <p className="truncate text-[11px] text-base-content/60">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-error/80 transition hover:bg-error/10 hover:text-error"
        >
          <LogOut size={17} />
          {t('nav.logout')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200">
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-72 border-e border-base-300 bg-base-100 lg:block">
        <Sidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 start-0 w-72 max-w-[85vw] bg-base-100 shadow-2xl">
            <Sidebar mobile />
          </aside>
        </div>
      )}

      <div className="lg:ps-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-base-300/80 bg-base-100/85 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn btn-ghost btn-sm btn-square lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="hidden items-center gap-2 text-sm font-medium text-base-content/60 sm:flex">
              <ShieldCheck size={16} className="text-accent" />
              {t('admin.panel')}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <div className="flex items-center gap-2 rounded-xl px-2 py-1.5">
              <Avatar name={user?.name} size="sm" />
              <span className="hidden max-w-[9rem] truncate text-sm font-semibold sm:block">{user?.name}</span>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
