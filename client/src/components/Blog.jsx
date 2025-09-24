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

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-500 dark:text-green-400";
    if (rating >= 3) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not disclosed";
    return salary;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
            <UserCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Reviewed this position
            </p>
          </div>
        </div>

        {data.rating && (
          <div className="flex items-center space-x-1">
            <StarIcon className={`w-5 h-5 ${getRatingColor(data.rating)}`} />
            <span
              className={`text-sm font-semibold ${getRatingColor(data.rating)}`}
            >
              {data.rating}/5
            </span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <BuildingOfficeIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {data.company}
          </h2>
        </div>

        {data.role && (
          <div className="flex items-center space-x-2">
            <BriefcaseIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {data.role}
            </span>
          </div>
        )}
      </div>

      {data.review && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Review
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
              {data.review}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <CurrencyDollarIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Salary
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatSalary(data.salary)}
            </p>
          </div>
        </div>

        {data.rounds && data.rounds.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Interview Rounds
            </p>
            <div className="flex flex-wrap gap-1">
              {data.rounds.map((round, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium"
                >
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
