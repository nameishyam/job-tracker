import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  PencilIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Prism from "../styles/Prism";

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : "John Doe",
    email: user?.email || "john.doe@example.com",
    location: user?.location || "New York, NY",
    joinDate: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "January 2024",
    totalApplications: 0,
    pendingApplications: 0,
    interviewsScheduled: 0,
    bio: "Passionate developer looking for new opportunities in tech.",
  });

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full relative prism-container">
          <Prism
            animationType="hover"
            timeScale={0.4}
            height={3.2}
            baseWidth={5.2}
            scale={3.2}
            hueShift={120}
            colorFrequency={0.9}
            noise={0.05}
            glow={0.6}
          />
          <div className="absolute inset-0 glass-overlay" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 mb-8 border border-yellow-400/30"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-yellow-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h1 className="text-sm font-medium text-yellow-200">
                Development Notice
              </h1>
              <p className="text-sm text-yellow-100/80 mt-1">
                This profile page is currently under testing and development.
                Features may be incomplete or subject to change.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-card p-8 sticky top-24"
            >
              <div className="text-center mb-8">
                <div className="w-24 h-24 glass-effect-strong rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserCircleIcon className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">
                  {profileData.name}
                </h1>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button px-6 py-3 font-semibold text-white hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit Profile
                </motion.button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white/80">
                  <EnvelopeIcon className="w-5 h-5 text-cyan-300" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center gap-4 text-white/80">
                  <MapPinIcon className="w-5 h-5 text-cyan-300" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-4 text-white/80">
                  <CalendarDaysIcon className="w-5 h-5 text-cyan-300" />
                  <span>Member since {profileData.joinDate}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-sm font-semibold text-white/90 mb-4">
                  About Me
                </h3>
                <div className="glass-effect-subtle p-4 rounded-lg border-l-4 border-cyan-400">
                  <p className="text-white/80 leading-relaxed">
                    {profileData.bio}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="glass-card p-8"
              >
                <h2 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-white/10">
                  Job Search Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    whileHover={{ y: -2, scale: 1.02 }}
                    className="glass-effect-subtle p-6 rounded-lg flex items-center gap-4 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-12 h-12 glass-effect-strong rounded-full flex items-center justify-center flex-shrink-0">
                      <BriefcaseIcon className="w-6 h-6 text-green-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white">
                        {profileData.totalApplications}
                      </h3>
                      <p className="text-white/70 text-xs uppercase tracking-wide">
                        Total Applications
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -2, scale: 1.02 }}
                    className="glass-effect-subtle p-6 rounded-lg flex items-center gap-4 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-12 h-12 glass-effect-strong rounded-full flex items-center justify-center flex-shrink-0">
                      <CalendarDaysIcon className="w-6 h-6 text-yellow-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white">
                        {profileData.pendingApplications}
                      </h3>
                      <p className="text-white/70 text-xs uppercase tracking-wide">
                        Pending Applications
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -2, scale: 1.02 }}
                    className="glass-effect-subtle p-6 rounded-lg flex items-center gap-4 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-12 h-12 glass-effect-strong rounded-full flex items-center justify-center flex-shrink-0">
                      <UserCircleIcon className="w-6 h-6 text-blue-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white">
                        {profileData.interviewsScheduled}
                      </h3>
                      <p className="text-white/70 text-xs uppercase tracking-wide">
                        Interviews Scheduled
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card p-8"
              >
                <h2 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-white/10">
                  Recent Activity
                </h2>
                <div className="glass-effect-subtle p-6 rounded-lg">
                  <div className="flex items-center gap-4 p-4 glass-effect-subtle rounded-lg">
                    <div className="w-10 h-10 glass-effect-strong rounded-full flex items-center justify-center flex-shrink-0">
                      <BriefcaseIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        You haven't submitted any applications yet.
                      </p>
                      <p className="text-white/60 text-sm">
                        Start your job search today!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;