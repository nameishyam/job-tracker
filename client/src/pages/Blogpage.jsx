import { useEffect, useState } from "react";
import Blog from "../components/Blog";
import NewBlog from "../components/NewBlog";
import { Plus } from "lucide-react";
import axios from "axios";
import Prism from "../styles/Prism";
import { motion } from "framer-motion";

const Blogpage = () => {
  const [showNewBlog, setShowNewBlog] = useState(false);
  const [blogs, setBlogs] = useState([]);

  const handleSuccess = () => {
    setShowNewBlog(false);
    fetchBlogs();
    console.log("Success! Time to refresh the blog list.");
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`);
      if (response.status === 200) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full relative prism-container">
          <Prism
            animationType="3drotate"
            timeScale={0.5}
            height={3.8}
            baseWidth={5.5}
            scale={3.5}
            hueShift={200}
            colorFrequency={1.1}
            noise={0.1}
            glow={0.5}
          />
          <div className="absolute inset-0 glass-overlay" />
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto p-4 sm:p-6 text-white z-10">
        <motion.button
          onClick={() => setShowNewBlog(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Add new blog"
          className="fixed top-24 right-6 glass-button p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-20"
        >
          <Plus size={24} />
        </motion.button>

        {showNewBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-modal p-8 w-full max-w-xl relative"
            >
              <button
                onClick={() => setShowNewBlog(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl transition-colors"
                aria-label="Close"
              >
                &times;
              </button>
              <NewBlog
                onSuccess={handleSuccess}
                onCancel={() => setShowNewBlog(false)}
              />
            </motion.div>
          </motion.div>
        )}

        <div className="glass-card p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Latest Reviews
          </h1>
          <p className="text-white/70">
            Discover insights from fellow job seekers
          </p>
        </div>

        <div className="space-y-6">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Blog data={blog} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogpage;