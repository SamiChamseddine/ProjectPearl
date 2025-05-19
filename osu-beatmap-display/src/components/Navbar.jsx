// src/components/Navbar.jsx
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="bg-black/80 backdrop-blur-md border-b border-pink-400/30 shadow-[0_0_20px_rgba(255,0,255,0.2)]">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-fuchsia-300 tracking-wide drop-shadow-[0_0_8px_#FF00FF]">
              Project pearl!
            </h1>
          </div>

          {!loading && (
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-pink-300">
                    Welcome,{" "}
                    <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-fuchsia-300 tracking-wide drop-shadow-[0_0_8px_#FF00FF]">
                      {user.username}!
                    </span>
                  </span>
                  <button
                    onClick={logout}
                    className="text-pink-300 hover:text-white font-semibold tracking-wide transition-all hover:underline hover:underline-offset-4"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  className="text-pink-300 hover:text-white font-semibold tracking-wide transition-all hover:underline hover:underline-offset-4"
                >
                  Sign In
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
