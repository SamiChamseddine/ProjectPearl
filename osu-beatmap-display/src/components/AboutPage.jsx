import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext.";

export default function AboutPage() {
  const { theme } = useTheme();

  const themeStyles = {
    neon: {
      bg: "bg-black",
      text: "text-white",
      accent: "text-pink-400",
      gradient: "from-pink-500 to-purple-600",
      border: "border-pink-500/30",
      card: "bg-gray-900/80 border-pink-500/20",
    },
    flashbang: {
      bg: "bg-white",
      text: "text-black",
      accent: "text-blue-600",
      gradient: "from-blue-500 to-cyan-400",
      border: "border-blue-400/50",
      card: "bg-white/90 border-blue-400/30",
    },
  };

  const currentTheme = themeStyles[theme];



  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} py-12`}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className={`text-5xl font-bold mb-4 bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
            About Project Pearl
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto">
            Advanced beatmap search engine built for the osu! community
          </p>
        </motion.div>

        {/* Search Engine Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`${currentTheme.card} backdrop-blur-sm border rounded-2xl p-8 mb-12`}
        >
          <h2 className={`text-3xl font-bold mb-6 ${currentTheme.accent}`}>Powerful Search Engine</h2>
          <p className="text-lg leading-relaxed mb-6">
            Project Pearl features a highly optimized search engine that can filter through thousands of beatmaps 
            with precision and speed. Built with Django REST Framework and React, it delivers instant results 
            with advanced filtering capabilities.
            Currently, it covers loved/ranked beatmaps.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className={`text-xl font-bold mb-4 ${currentTheme.accent}`}>Search Capabilities</h3>
              <ul className="space-y-2">
                <li>• Range filters (BPM, Stars, AR, CS, Length)</li>
                <li>• Text search across multiple fields</li>
                <li>• Status and game mode filtering</li>
                <li>• Date range and popularity filters</li>
                <li>• Tag-based searching</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={`${currentTheme.card} backdrop-blur-sm border rounded-2xl p-8 mb-12`}
        >
          <h2 className={`text-3xl font-bold mb-6 ${currentTheme.accent}`}>Contact & Support</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className={`text-xl font-bold mb-4 ${currentTheme.accent}`}>Get In Touch</h3>
              <p className="mb-4">Have suggestions, found a bug, or want to contribute?</p>
              <div className="space-y-2">
                <p>Osu: zer0_pearl</p>
                <p>Discord: Zer0_pearl</p>
              </div>
            </div>
            <div>
              <h3 className={`text-xl font-bold mb-4 ${currentTheme.accent}`}>Contribute</h3>
              <p className="mb-4">Project Pearl is open to contributions! Feel free to:</p>
              <ul className="space-y-2">
                <li>• Report bugs and issues</li>
                <li>• Suggest new features</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Legal Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className={`${currentTheme.card} backdrop-blur-sm border rounded-2xl p-6 text-center`}
        >
          <p className="text-sm opacity-70">
            Project Pearl is an independent fan project and is not affiliated with ppy Pty Ltd or the osu! game. 
            All beatmap data is sourced from publicly available osu! APIs. osu! is a registered trademark of ppy Pty Ltd. 
            This project is for educational and personal use only.
          </p>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-12 opacity-70"
        >
          <p>Made with ❤️ for the osu! community</p>
        </motion.div>
      </div>
    </div>
  );
}