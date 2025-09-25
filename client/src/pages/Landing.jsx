import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const Landing = () => {
  const features = [
    {
      icon: ClipboardDocumentListIcon,
      title: "Track Applications",
      description: "Keep all your job applications organized in one place",
      accent: "from-emerald-400/20 to-emerald-600/10",
    },
    {
      icon: ChartBarIcon,
      title: "Monitor Progress",
      description: "Track interview rounds and application status",
      accent: "from-sky-400/20 to-blue-500/10",
    },
    {
      icon: BellIcon,
      title: "Stay Updated",
      description: "Never miss important deadlines or follow-ups",
      accent: "from-violet-400/20 to-indigo-500/10",
    },
    {
      icon: CheckCircleIcon,
      title: "Achieve Goals",
      description: "Land your dream job with better organization",
      accent: "from-rose-400/20 to-fuchsia-500/10",
    },
  ];

  return (
    <section className="relative page-shell overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-[640px] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/15 to-transparent opacity-80 mix-blend-overlay" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="page-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h1
                id="hero-heading"
                className="heading-xl leading-tight drop-shadow-xl"
              >
                Track Every Job
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400">
                  Application Effortlessly
                </span>
              </h1>

              <p className="text-lg text-slate-200/85 max-w-xl">
                Organize your job search with a calm, glassy dashboard. Monitor
                applications, map interview rounds, and stay ahead of every
                opportunity in your career journey.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/signup"
                    className="glass-button glass-button--primary px-6 py-3"
                  >
                    Get Started
                  </Link>
                </motion.div>

                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/login" className="glass-button px-6 py-3">
                    Sign In
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.2 + index * 0.08 }}
                    className="glass-panel glass-panel--tight glass-panel--hover p-6 space-y-4"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.accent} border border-white/15 flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-slate-100" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-slate-100 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-200/80 leading-relaxed">
                        {feature.description}
                      </p>
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
