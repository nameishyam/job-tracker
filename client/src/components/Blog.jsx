import { motion } from "framer-motion";

const Blog = ({ data }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? "text-yellow-300" : "text-white/30"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="glass-card p-6 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-2">{data.company}</h2>
          {data.role && (
            <p className="text-white/80 mb-3">
              <span className="font-medium">Role:</span> {data.role}
            </p>
          )}
        </div>
        {data.rating && (
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <div className="flex">{renderStars(data.rating)}</div>
            <span className="text-white/70 text-sm">({data.rating}/5)</span>
          </div>
        )}
      </div>

      {data.review && (
        <div className="glass-effect-subtle p-4 rounded-lg mb-4">
          <p className="text-white/90 leading-relaxed">{data.review}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {data.salary && (
          <div className="glass-effect-subtle p-3 rounded-lg">
            <span className="text-white/60 text-sm font-medium">Salary:</span>
            <p className="text-white">{data.salary}</p>
          </div>
        )}
        {data.rounds && data.rounds.length > 0 && (
          <div className="glass-effect-subtle p-3 rounded-lg">
            <span className="text-white/60 text-sm font-medium">Rounds:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {data.rounds.map((round, index) => (
                <span
                  key={index}
                  className="glass-badge px-2 py-1 text-xs"
                >
                  {round}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <hr className="border-white/10 my-4" />
    </motion.div>
  );
};

export default Blog;