import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';
import { useLanguage } from './context/LanguageContext';

import Landing from './pages/public/Landing';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import AdminLogin from './pages/auth/AdminLogin';

import Dashboard from './pages/student/Dashboard';
import Grades from './pages/student/Grades';
import Subjects from './pages/student/Subjects';
import Topics from './pages/student/Topics';
import QuizSetup from './pages/student/QuizSetup';
import QuizGame from './pages/student/QuizGame';
import Result from './pages/student/Result';
import Review from './pages/student/Review';
import Leaderboard from './pages/student/Leaderboard';
import History from './pages/student/History';
import Achievements from './pages/student/Achievements';
import Profile from './pages/student/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminGrades from './pages/admin/Grades';
import AdminSubjects from './pages/admin/Subjects';
import AdminTopics from './pages/admin/Topics';
import AdminQuestions from './pages/admin/Questions';
import AdminAttempts from './pages/admin/Attempts';
import AdminReports from './pages/admin/Reports';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function PublicNotFound() {
  const { t } = useLanguage();

  return (
    <div className="grid min-h-screen place-items-center bg-base-200 px-4">
      <div className="app-card w-full max-w-lg p-8 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <SearchX size={30} />
        </span>
        <p className="mt-5 text-5xl font-extrabold tracking-tight text-primary">404</p>
        <h1 className="mt-2 text-xl font-bold">{t('errors.notFoundTitle')}</h1>
        <p className="mt-2 text-sm leading-relaxed text-base-content/60">{t('errors.notFoundText')}</p>
        <Link to="/" className="btn btn-primary mt-6 gap-1.5">
          <Home size={16} /> {t('errors.goHome')}
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="grades" element={<Grades />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="topics/:subjectId" element={<Topics />} />
          <Route path="quiz/setup" element={<QuizSetup />} />
          <Route path="quiz/:attemptId" element={<QuizGame />} />
          <Route path="result/:attemptId" element={<Result />} />
          <Route path="review/:attemptId" element={<Review />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="history" element={<History />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="grades" element={<AdminGrades />} />
          <Route path="subjects" element={<AdminSubjects />} />
          <Route path="topics" element={<AdminTopics />} />
          <Route path="questions" element={<AdminQuestions />} />
          <Route path="attempts" element={<AdminAttempts />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        <Route path="*" element={<PublicNotFound />} />
      </Routes>
    </>
  );
}
