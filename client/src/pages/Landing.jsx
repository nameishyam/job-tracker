import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  CheckCircleIcon,
  NewspaperIcon,
  StarIcon,
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
    {
      icon: NewspaperIcon,
      title: "Company Reviews & Blogs",
      description:
        "Read verified reviews and long-form blog posts about companies to make informed decisions.",
      accent: "from-yellow-300/20 to-amber-500/10",
    },
  ];

  const sampleBlogs = [
    {
      company: "StellarTech",
      title: "What it's like working at StellarTech — an honest review",
      excerpt:
        "Hiring process, interview difficulty, salary bands and culture notes from recent hires.",
      rating: 4.5,
      slug: "stellartech-review",
    },
    {
      company: "Nimbus Labs",
      title: "Nimbus Labs: Interview experience & growth opportunities",
      excerpt:
        "A rundown of interview rounds, expected timelines, and tips for applicants.",
      rating: 4.0,
      slug: "nimbuslabs-review",
    },
    {
      company: "AstraWorks",
      title: "AstraWorks compensation and benefits review",
      excerpt:
        "Benefits breakdown, remote policy, and early-career mentorship notes.",
      rating: 3.8,
      slug: "astraworks-review",
    },
  ];

  return (
    <div>
      <main className="relative z-10 py-12">
        <div className="page-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              aria-labelledby="hero-heading"
              className="space-y-6"
            >
              <h1
                id="hero-heading"
                className="heading-xxl leading-tight max-w-lg"
              >
                Track every job application —
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400">
                  effortlessly and informed
                </span>
              </h1>

              <p className="text-lg text-slate-200/85 max-w-xl">
                A calm, glassy dashboard to manage your job search, map
                interview rounds, and read community-driven company reviews so
                you can make confident decisions about where to apply.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/signup"
                    className="glass-button glass-button--primary px-6 py-3"
                  >
                    Create Account
                  </Link>
                </motion.div>

                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/features" className="glass-button px-6 py-3">
                    See Features
                  </Link>
                </motion.div>
              </div>

              <dl className="mt-6 grid grid-cols-3 gap-4 max-w-md">
                <div>
                  <dt className="text-sm text-slate-300">Applications</dt>
                  <dd className="text-lg font-semibold">1,240+</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-300">Companies</dt>
                  <dd className="text-lg font-semibold">560+</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-300">Avg Rating</dt>
                  <dd className="text-lg font-semibold">4.1 ⭐</dd>
                </div>
              </dl>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.article
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.2 + index * 0.06 }}
                    className="glass-panel glass-panel--tight glass-panel--hover p-6 flex gap-4 items-start"
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.accent} border border-white/10 flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-slate-100" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-100 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-200/80 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </motion.section>
          </div>

          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  Latest Company Reviews
                </h2>
                <p className="text-sm text-slate-300">
                  Community-written reviews & posts
                </p>
              </div>

              <Link to="/blogs" className="text-sm underline">
                View all reviews
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {sampleBlogs.map((b) => (
                <article
                  key={b.slug}
                  className="glass-panel p-5 space-y-3 hover:scale-[1.01] transition-transform"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-100">
                        {b.title}
                      </h3>
                      <p className="text-xs text-slate-300">{b.company}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <StarIcon className="w-5 h-5 text-amber-400" />
                      <span className="font-medium">{b.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-200/80 leading-relaxed">
                    {b.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <Link to={`/blogs/${b.slug}`} className="text-sm underline">
                      Read more
                    </Link>

                    <div className="text-xs text-slate-300">
                      Updated 2 weeks ago
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Footer CTA */}
          <section className="mt-12 glass-panel p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-semibold">
                Ready to organize your job search?
              </h4>
              <p className="text-sm text-slate-300">
                Create an account and start tracking applications and reading
                company reviews.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                to="/signup"
                className="glass-button glass-button--primary px-5 py-2"
              >
                Sign up — it’s free
              </Link>
              <Link to="/login" className="glass-button px-5 py-2">
                Sign in
              </Link>
            </div>
          </section>
        </div>
      </main>

      <footer className="relative z-10 py-8">
        <div className="page-width text-sm text-slate-400 flex items-center justify-between">
          <div>© {new Date().getFullYear()} PlacementsTracker</div>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:underline">
              Terms
            </Link>
            <Link to="/privacy" className="hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
