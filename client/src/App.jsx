import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/context/AuthContext";
import { TagProvider } from "./lib/context/TagContext";
import { useAuth } from "./lib/hooks/useAuth"; // You'll need to make sure this hook exists and is exported correctly
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Board from "./components/Board";
import Layout from "./components/Layout";
import { Toaster } from "react-hot-toast";
import Background from "./components/Background";
import "./styles/premium-theme.css";
import './App.css'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TagProvider>
          <Background />
          <AppRoutes />
          <Toaster position="bottom-right" />
        </TagProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Separate component to use useAuth hook inside AuthProvider
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/" replace />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Board />} />
      </Route>
    </Routes>
  );
}

export default App;

