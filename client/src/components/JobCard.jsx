// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import JobInfo from "./JobInfo";
// import axios from "axios";
// import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
// import { useAuth } from "../context/AuthContext";

// const JobCard = ({ job, onJobDeleted }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const { token } = useAuth();

//   const handleCardClick = () => setIsExpanded(true);
//   const handleCloseModal = () => setIsExpanded(false);

//   const handleDelete = async (e) => {
//     e.stopPropagation();
//     if (isDeleting) return;

//     setIsDeleting(true);
//     try {
//       const headers = { Authorization: `Bearer ${token}` };
//       const response = await axios.delete(
//         `${import.meta.env.VITE_API_URL}/jobs`,
//         {
//           data: { jobId: job.id },
//           headers,
//         }
//       );

//       if (response.status === 200 && onJobDeleted) {
//         onJobDeleted(job.id);
//       }
//     } catch (error) {
//       console.error("Error deleting job:", error);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Not specified";
//     return new Date(dateString).toLocaleDateString();
//   };

//   const getJobTypeClass = (type) => {
//     switch (type) {
//       case "full-time":
//         return "glass-badge glass-badge--teal";
//       case "part-time":
//         return "glass-badge glass-badge--blue";
//       case "intern":
//         return "glass-badge glass-badge--purple";
//       default:
//         return "glass-badge glass-badge--neutral";
//     }
//   };

//   return (
//     <>
//       <motion.div
//         onClick={handleCardClick}
//         whileHover={{ y: -2 }}
//         className="glass-panel glass-panel--surface glass-panel--hover p-5 sm:p-6 cursor-pointer"
//       >
//         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
//           <div className="flex-1 min-w-0 space-y-3">
//             <div className="flex flex-wrap items-center gap-3">
//               <h3 className="text-lg font-semibold text-slate-100 truncate">
//                 {job.jobtitle}
//               </h3>
//               {job.jobtype && (
//                 <span className={getJobTypeClass(job.jobtype)}>
//                   {job.jobtype.replace("-", " ")}
//                 </span>
//               )}
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-200/80">
//               <p>
//                 <span className="text-slate-100/90 font-medium">Company:</span>{" "}
//                 {job.company}
//               </p>
//               <p>
//                 <span className="text-slate-100/90 font-medium">Location:</span>{" "}
//                 {job.location || "Not specified"}
//               </p>
//               <p>
//                 <span className="text-slate-100/90 font-medium">Applied:</span>{" "}
//                 {formatDate(job.date)}
//               </p>
//               {job.salary && (
//                 <p>
//                   <span className="text-slate-100/90 font-medium">Salary:</span>{" "}
//                   {job.salary}
//                 </p>
//               )}
//             </div>

//             {job.rounds && job.rounds.length > 0 && (
//               <div className="glass-taglist">
//                 {job.rounds.slice(0, 3).map((round, index) => (
//                   <span key={index} className="glass-chip">
//                     {round}
//                   </span>
//                 ))}
//                 {job.rounds.length > 3 && (
//                   <span className="glass-chip">
//                     +{job.rounds.length - 3} more
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="flex items-center gap-2 sm:ml-4">
//             <motion.button
//               onClick={handleCardClick}
//               whileTap={{ scale: 0.95 }}
//               className="glass-icon-btn"
//               title="View details"
//             >
//               <EyeIcon className="w-5 h-5" />
//             </motion.button>

//             <motion.button
//               onClick={handleDelete}
//               disabled={isDeleting}
//               whileTap={{ scale: 0.95 }}
//               className="glass-icon-btn text-red-300 hover:text-red-200 disabled:opacity-60"
//               title="Delete job"
//             >
//               {isDeleting ? (
//                 <div className="loading-spinner w-4 h-4" />
//               ) : (
//                 <TrashIcon className="w-5 h-5" />
//               )}
//             </motion.button>
//           </div>
//         </div>
//       </motion.div>

//       <AnimatePresence>
//         {isExpanded && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={handleCloseModal}
//             className="fixed inset-0 bg-black/70 backdrop-blur-2xl flex items-center justify-center z-50 p-4"
//           >
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               onClick={(e) => e.stopPropagation()}
//               className="glass-panel glass-panel--surface w-full max-w-4xl max-h-[90vh] overflow-hidden"
//             >
//               <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-xl bg-white/10">
//                 <h2 className="text-xl font-semibold text-slate-50">
//                   Job Details
//                 </h2>
//                 <button
//                   onClick={handleCloseModal}
//                   className="glass-icon-btn text-slate-200 hover:text-slate-50"
//                 >
//                   ×
//                 </button>
//               </div>
//               <div className="overflow-y-auto max-h-[calc(90vh-4.5rem)]">
//                 <JobInfo job={job} />
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default JobCard;

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const JobCard = ({ job, onJobDeleted, onJobSelect }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { token } = useAuth();

  const handleCardClick = () => {
    onJobSelect(job);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/jobs/${job.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onJobDeleted(job.id);
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert("Failed to delete job. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getJobTypeClass = (type) => {
    const baseClass = "px-2 py-1 text-xs font-medium rounded-full";
    switch (type?.toLowerCase()) {
      case "full time":
      case "full-time":
        return `${baseClass} bg-emerald-400/20 text-emerald-300 border border-emerald-400/30`;
      case "part time":
      case "part-time":
        return `${baseClass} bg-blue-400/20 text-blue-300 border border-blue-400/30`;
      case "contract":
        return `${baseClass} bg-amber-400/20 text-amber-300 border border-amber-400/30`;
      case "internship":
        return `${baseClass} bg-purple-400/20 text-purple-300 border border-purple-400/30`;
      default:
        return `${baseClass} bg-slate-400/20 text-slate-300 border border-slate-400/30`;
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ y: -2 }}
      className="glass-panel glass-panel--surface glass-panel--hover p-5 sm:p-6 cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-50 leading-tight">
              {job.position}
            </h3>
            {job.jobType && (
              <div className={getJobTypeClass(job.jobType)}>
                {job.jobType}
              </div>
            )}
          </div>

          <h4 className="text-base sm:text-lg font-medium text-slate-200 mb-4">
            {job.company}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
            <div>
              <span className="text-slate-400 font-medium">Location:</span>
              <span className="text-slate-200 ml-2">
                {job.location || "Not specified"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Salary:</span>
              <span className="text-slate-200 ml-2">
                {job.salary || "Not specified"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Applied:</span>
              <span className="text-slate-200 ml-2">
                {formatDate(job.dateApplied)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Status:</span>
              <span className="text-slate-200 ml-2">
                {job.status || "Applied"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:ml-4">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            whileTap={{ scale: 0.95 }}
            className="glass-icon-btn"
            title="View details"
          >
            <EyeIcon className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={handleDelete}
            disabled={isDeleting}
            whileTap={{ scale: 0.95 }}
            className="glass-icon-btn text-rose-300 hover:text-rose-200 disabled:opacity-50"
            title="Delete job"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
            ) : (
              <TrashIcon className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;