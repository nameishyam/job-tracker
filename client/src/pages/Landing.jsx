import { Link } from "react-router-dom";
import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  CheckCircleIcon,
  NewspaperIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { SiLeetcode } from "react-icons/si";

const Landing = () => {
  const features = [
    {
      icon: ClipboardDocumentListIcon,
      title: "Track Applications",
      description: "Keep all your job applications organized in one place.",
      accentBg: "bg-emerald-600/20",
      accentColor: "text-emerald-300",
    },
    {
      icon: ChartBarIcon,
      title: "Monitor Progress",
      description: "Track interview rounds and application status.",
      accentBg: "bg-sky-600/20",
      accentColor: "text-sky-300",
    },
    {
      icon: BellIcon,
      title: "Stay Updated",
      description: "Never miss important deadlines or follow-ups.",
      accentBg: "bg-violet-600/20",
      accentColor: "text-violet-300",
    },
    {
      icon: CheckCircleIcon,
      title: "Achieve Goals",
      description: "Land your dream job with better organization.",
      accentBg: "bg-rose-600/20",
      accentColor: "text-rose-300",
    },
    {
      icon: NewspaperIcon,
      title: "Company Reviews & Blogs",
      description:
        "Read verified reviews and blog posts to make informed decisions.",
      accentBg: "bg-amber-500/20",
      accentColor: "text-amber-300",
    },
  ];

  const socialLinks = [
    {
      href: "mailto:geddamgowtham4@gmail.com",
      label: "Email",
      icon: <HiOutlineMail className="w-5 h-5" />,
    },
    {
      href: "https://github.com/nameishyam",
      label: "GitHub",
      icon: <FaGithub className="w-5 h-5" />,
    },
    {
      href: "https://www.linkedin.com/in/nameishyam",
      label: "LinkedIn",
      icon: <FaLinkedin className="w-5 h-5" />,
    },
    {
      href: "https://leetcode.com/nameishyam",
      label: "LeetCode",
      icon: <SiLeetcode className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen text-slate-100 bg-slate-950">
      <main className="relative z-10 pb-12">
        <div className="max-w-[1120px] w-[92vw] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <section aria-labelledby="hero-heading" className="space-y-6">
              <h1
                id="hero-heading"
                className="text-4xl md:text-5xl font-bold leading-tight max-w-lg"
              >
                Track every job application —
                <span className="block text-emerald-300">
                  effortlessly and informed
                </span>
              </h1>
              <p className="text-lg text-slate-300 max-w-xl">
                A calm, organized dashboard to manage your job search, map
                interview rounds, and read community-driven company reviews so
                you can make confident decisions about where to apply.
              </p>
              <div className="flex gap-3 flex-shrink-0">
                <Link
                  to="/signup"
                  className="rounded-lg bg-emerald-500 px-5 py-2 font-semibold text-slate-900 hover:bg-emerald-400 transition-colors duration-150"
                >
                  Sign up — it's free
                </Link>
                <Link
                  to="/login"
                  className="rounded-lg border border-slate-700 px-5 py-2 text-slate-100 hover:border-slate-500 transition-colors duration-150"
                >
                  Sign in
                </Link>
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={feature.title}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex gap-4 items-start"
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-lg ${feature.accentBg} border border-slate-800 flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${feature.accentColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-100 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-800 bg-slate-950">
        <div className="max-w-[1120px] w-[92vw] mx-auto py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left text-sm text-slate-400">
              <p>
                &copy; {new Date().getFullYear()} Career Dock. All rights
                reserved.
              </p>
              <p className="mt-1">
                Designed & Developed by{" "}
                <a
                  href="https://portfolio-syam.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-slate-300 hover:text-white transition-colors duration-150"
                >
                  Syam Gowtham <LinkIcon className="inline w-4 h-4 mb-0.5" />
                </a>
                .
              </p>
            </div>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="text-slate-400 hover:text-white transition-colors duration-150"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
