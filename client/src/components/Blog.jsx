import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  StarIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

const ratingColorMap = {
  high: "text-emerald-300",
  medium: "text-amber-300",
  low: "text-rose-300",
};

const Blog = ({ data }) => {
  const [user, setUser] = useState(null);
  const userId = data.userId;

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`
      );
      if (response.status === 200) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  const getRatingVariant = (rating) => {
    if (!rating) return "low";
    if (rating >= 4) return "high";
    if (rating >= 3) return "medium";
    return "low";
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not disclosed";
    return salary;
  };

  const ratingVariant = getRatingVariant(data.rating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass-panel glass-panel--tight glass-panel--hover p-6"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 glass-panel glass-panel--tight flex items-center justify-center rounded-full border border-white/15">
            <UserCircleIcon className="w-6 h-6 text-slate-100" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-100">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-slate-300/70">Reviewed this position</p>
          </div>
        </div>

        {data.rating && (
          <div className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 border border-white/15">
            <StarIcon className={`w-5 h-5 ${ratingColorMap[ratingVariant]}`} />
            <span
              className={`text-sm font-semibold ${ratingColorMap[ratingVariant]}`}
            >
              {data.rating}/5
            </span>
          </div>
        )}
      </div>

      <div className="mb-5 space-y-2">
        <div className="flex items-center gap-2">
          <BuildingOfficeIcon className="w-5 h-5 text-slate-300/70" />
          <h2 className="text-lg font-semibold text-slate-100 tracking-tight">
            {data.company}
          </h2>
        </div>

        {data.role && (
          <div className="flex items-center gap-2 text-slate-200/80">
            <BriefcaseIcon className="w-4 h-4" />
            <span className="text-sm">{data.role}</span>
          </div>
        )}
      </div>

      {data.review && (
        <div className="mb-5 space-y-2">
          <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
            Review
          </h3>
          <div className="glass-panel glass-panel--tight bg-white/10 border border-white/10 p-4">
            <p className="text-slate-200/85 whitespace-pre-wrap leading-relaxed">
              {data.review}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-panel glass-panel--tight bg-white/10 border border-white/10 p-4">
          <div className="flex items-center gap-2 text-slate-200/85">
            <CurrencyDollarIcon className="w-4 h-4" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Salary
              </p>
              <p className="text-sm font-medium text-slate-100">
                {formatSalary(data.salary)}
              </p>
            </div>
          </div>
        </div>

        {data.rounds && data.rounds.length > 0 && (
          <div className="glass-panel glass-panel--tight bg-white/10 border border-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
              Interview Rounds
            </p>
            <div className="flex flex-wrap gap-2">
              {data.rounds.map((round, index) => (
                <span key={index} className="glass-chip">
                  {round}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Blog;
