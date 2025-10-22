import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Auth from "./Components/auth";
import PrimarySearchAppBar from "./Components/Appbar";
import ResponsiveGrid from "./Components/Grid";
import Profile from "./Components/Profile";

function AppContent() {
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (token && storedUserId) {
      console.log("Restoring session with userId:", storedUserId);
      setUserId(storedUserId);
      navigate("/grid");
    }
  }, [navigate]);

  const handleLogin = (userId) => {
    console.log("Login success, setting userId:", userId);
    setUserId(userId);
    localStorage.setItem("userId", userId);
    navigate("/grid");
  };

  const handleLogout = () => {
    console.log("Logging out");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUserId(null);
    setSearchQuery("");
    navigate("/login");
  };

  const handleSearch = (query) => {
    console.log("Search query received in App.js:", query);
    setSearchQuery(query);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={<Auth onLogin={handleLogin} />}
      />
      <Route
        path="/grid"
        element={
          userId ? (
            <>
              <PrimarySearchAppBar onLogout={handleLogout} onSearch={handleSearch} />
              <ResponsiveGrid userId={userId} searchQuery={searchQuery} />
            </>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/profile"
        element={
          userId ? (
            <>
              <PrimarySearchAppBar onLogout={handleLogout} onSearch={handleSearch} />
              <Profile userId={userId} />
            </>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;