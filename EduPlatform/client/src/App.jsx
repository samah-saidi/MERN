import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import MyReviews from './pages/MyReviews';
import NotFound from './pages/NotFound';
import CourseAnalysis from "./pages/CourseAnalysis";
import GenerateDescription from "./pages/GenerateDescription";
import PersonalizedCourses from "./pages/PersonalizedCourses";
import AdminDashboard from "./pages/AdminDashboard";
import CourseQuiz from "./pages/CourseQuiz";
import Chatbot from './pages/Chatbot';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        
        <Route path="/chatbot" element={<Chatbot />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <ProfileEdit />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/my-reviews"
          element={
            <ProtectedRoute>
              <MyReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id/analysis"
          element={
            <ProtectedRoute>
              <CourseAnalysis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/:id/quiz"
          element={
            <ProtectedRoute>
              <CourseQuiz />
            </ProtectedRoute>
          }
        />

        <Route
          path="/generate-description"
          element={
            <ProtectedRoute>
              <GenerateDescription />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/personalized-courses"
          element={
            <ProtectedRoute>
              <PersonalizedCourses />
            </ProtectedRoute>
          }
        />

        {/* 404 - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;