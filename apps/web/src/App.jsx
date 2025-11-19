import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./features/auth/hooks/useAuth";
import LoginPage from "./features/auth/pages/LoginPage";
import ChatPage from "./features/chat/pages/ChatPage";
import AuthCallback from "./features/auth/pages/AuthCallback";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/chat" />}
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/chat"
          element={user ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
