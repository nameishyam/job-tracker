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
      className="relative w-full overflow-hidden min-h-screen pt-16"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full relative prism-container">
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
          <div className="absolute inset-0 glass-overlay" />
        </div>
      </div>

      <div className="relative z-10 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 lg:pr-8"
            >
              <div className="glass-card p-8">
                <h1
                  id="hero-heading"
                  className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-lg mb-6"
                >
                  Track Every Job
                  <span className="block text-gradient mt-2">
                    Application
                  </span>
                </h1>

                <p className="text-lg text-white/80 max-w-2xl drop-shadow-sm mb-8">
                  Organize your job search with our intuitive tracker. Monitor
                  applications, track interview rounds, and stay on top of your
                  career journey.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/signup"
                    className="glass-button px-6 py-3 font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Get Started
                  </Link>

                  <Link
                    to="/login"
                    className="glass-button px-6 py-3 font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </div>
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
                    className="glass-card p-6 hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-none w-12 h-12 rounded-xl flex items-center justify-center glass-effect-strong">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white drop-shadow-sm mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-white/70">
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