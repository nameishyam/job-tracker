import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Prism from "../styles/Prism";

const Landing = () => {
  const features = [
    {
      icon: ClipboardDocumentListIcon,
      title: "Track Applications",
      description: "Keep all your job applications organized in one place",
    },
    {
      icon: ChartBarIcon,
      title: "Monitor Progress",
      description: "Track interview rounds and application status",
    },
    {
      icon: BellIcon,
      title: "Stay Updated",
      description: "Never miss important deadlines or follow-ups",
    },
    {
      icon: CheckCircleIcon,
      title: "Achieve Goals",
      description: "Land your dream job with better organization",
    },
  ];

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-[600px] relative">
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Prism
              animationType="hover"
              timeScale={0.5}
              height={3.5}
              baseWidth={5.5}
              scale={3.6}
              hueShift={0}
              colorFrequency={1}
              noise={0}
              glow={0.5}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent dark:via-black/30 mix-blend-overlay" />
        </div>
      </div>

      <div className="relative z-10 min-h-[calc(100vh-3.5rem)] flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 lg:pr-8"
            >
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white drop-shadow-sm"
              >
                Track Every Job
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                  Application
                </span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl drop-shadow-sm">
                Organize your job search with our intuitive tracker. Monitor
                applications, track interview rounds, and stay on top of your
                career journey.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full 
                         font-semibold text-white shadow-lg transform transition-all duration-300
                         bg-cyan-500/20 hover:bg-cyan-500/30
                         border border-cyan-400/50 hover:border-cyan-400/70
                         backdrop-blur-lg hover:scale-[1.02]"
                >
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full 
                         font-semibold shadow-lg transform transition-all duration-300
                         backdrop-blur-lg hover:scale-[1.02]
                         border bg-white/20 border-gray-300/50 text-gray-800 hover:bg-white/40
                         dark:border-white/20 dark:bg-black/20 dark:text-white dark:hover:bg-black/30"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + index * 0.08,
                    }}
                    className="p-6 rounded-3xl backdrop-blur-xl shadow-lg
                           transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                           border border-white/20 hover:border-white/40
                           bg-white/10 dark:bg-white/5"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex-none w-12 h-12 rounded-xl flex items-center justify-center
                               bg-gradient-to-br from-teal-400/20 to-blue-400/20 
                               dark:from-teal-800/20 dark:to-blue-700/20
                               ring-1 ring-white/20 shadow-inner"
                      >
                        <Icon className="w-6 h-6 text-cyan-700 dark:text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white drop-shadow-sm">
                          {feature.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
