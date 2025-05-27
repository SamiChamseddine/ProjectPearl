import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { AuthProvider } from "./context/AuthContext";
import BeatmapSlider from "./components/BeatmapSlider";
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
//import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const VITE_API_LINK = import.meta.env.VITE_API_LINK
  const [beatmaps, setBeatmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBeatmaps = async () => {
      try {
        const res = await axios.get(
          `${VITE_API_LINK}/api/beatmaps/search/`
        );
        setBeatmaps(res.data.results);
      } catch (err) {
        setError("Failed to load beatmaps");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBeatmaps();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-black text-white">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route 
                path="/" 
                element={
                  loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center text-red-400 py-8">{error}</div>
                  ) : (
                    <ProtectedRoute>
                    <BeatmapSlider beatmaps={beatmaps} />
                    </ProtectedRoute>
                  )
                } 
              />
              <Route path="/login" element={<LoginForm />} />
              {/*<Route path="/register" element={<RegisterForm />} />*/}
              
              {/* Example protected route */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <div className="text-center">
                      <h2 className="text-2xl text-pink-400 mb-4">User Profile</h2>
                      {/* Profile content goes here */}
                    </div>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}