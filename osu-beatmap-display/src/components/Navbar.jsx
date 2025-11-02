import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext.";
import { Link } from "react-router-dom";
const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const { theme } = useTheme();

  const themeStyles = {
    neon: {
      bg: "bg-black/80",
      border: "border-pink-400/30",
      shadow: "shadow-[0_0_20px_rgba(255,0,255,0.2)]",
      text: "text-pink-300",
      gradient: "from-pink-300 to-fuchsia-300",
      highlight: "text-white",
      dropShadow: "drop-shadow-[0_0_8px_#FF00FF]",
    },
    flashbang: {
      bg: "bg-white/90",
      border: "border-blue-400/50",
      shadow: "shadow-[0_0_20px_rgba(0,200,255,0.3)]",
      text: "text-blue-700",
      gradient: "from-blue-500 to-cyan-400",
      highlight: "text-black",
      dropShadow: "drop-shadow-[0_0_8px_#00BFFF]",
    },
  };

  const currentTheme = themeStyles[theme];

  return (
    <nav
      className={`${currentTheme.bg} backdrop-blur-md border-b ${currentTheme.border} ${currentTheme.shadow}`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left: Logo + Title */}
          <Link to="/" className="flex items-center space-x-3">
            {/* Logo */}
            <img
              src="/logo/logo2.png"
              alt="Project Pearl Logo"
              className="w-32 h-32 drop-shadow-[0_0_8px_rgba(255,0,255,0.7)] animate-pulse"
            />
          </Link>

          {/* Right: Auth Buttons */}
          {!loading && (
            <>
              <div className="flex items-center space-x-4">
                <Link
                  to="/about"
                  className={`${currentTheme.text} hover:${currentTheme.highlight} font-semibold tracking-wide transition-all hover:underline hover:underline-offset-4`}
                >
                  About
                </Link>
                {/*{user ? (
                  <button
                    onClick={logout}
                    className={`${currentTheme.text} hover:${currentTheme.highlight} font-semibold tracking-wide transition-all hover:underline hover:underline-offset-4`}
                  >
                    Sign Out
                  </button>
                ) : (
                  <a
                    href="/login"
                    className={`${currentTheme.text} hover:${currentTheme.highlight} font-semibold tracking-wide transition-all hover:underline hover:underline-offset-4`}
                  >
                    Sign In
                  </a>
                )}*/}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
