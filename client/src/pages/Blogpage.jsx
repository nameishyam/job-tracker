import { useEffect, useRef, useState } from "react";
import Blog from "../components/Blog";
import NewBlog from "../components/NewBlog";
import axios from "axios";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const Blogpage = () => {
  const [showNewBlog, setShowNewBlog] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const panelRef = useRef(null);

  const handleSuccess = () => {
    setShowNewBlog(false);
    fetchBlogs();
  };

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`);
      if (response.status === 200) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (!showNewBlog) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShowNewBlog(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showNewBlog]);

  useEffect(() => {
    if (showNewBlog && panelRef.current) {
      setTimeout(() => panelRef.current?.focus?.(), 0);
    }
  }, [showNewBlog]);

  if (isLoading) {
    return (
      <section className="flex flex-col min-h-screen items-center justify-center">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-2 text-sm">
          <span className="inline-block w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
          Loading Reviews…
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col min-h-[80vh] pt-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-[1120px] w-[92vw] mx-auto relative space-y-6"
      >
        <div className="absolute top-0 right-0 pt-6 pr-6">
          <motion.button
            onClick={() => setShowNewBlog(true)}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center rounded-full h-9 px-4 font-semibold text-sm border border-emerald-500 bg-emerald-500 text-slate-900 transition hover:bg-emerald-400 hover:border-emerald-400"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            {"Add Review"}
          </motion.button>
        </div>

        <div className="pt-2 space-y-2">
          <p className="text-sm text-slate-200/70">
            Showing{" "}
            <span className="font-semibold text-slate-100">{blogs.length}</span>{" "}
            blogs
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-100 tracking-tight">
            Latest Reviews
          </h1>
        </div>

        <div className="space-y-5">
          {blogs.length > 0 ? (
            blogs.map((blog) => <Blog key={blog.id} data={blog} />)
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center text-slate-200/75">
              No reviews yet. Be the first to share your experience!
            </div>
          )}
        </div>
      </motion.div>

      {showNewBlog && (
        <div
          className="fixed inset-0 z-[90] bg-slate-950/70 backdrop-blur-xl flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowNewBlog(false);
          }}
        >
          <div
            ref={panelRef}
            tabIndex={-1}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 w-full max-w-xl relative shadow-2xl transition-transform transform-gpu"
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Create new blog"
          >
            <button
              onClick={() => setShowNewBlog(false)}
              className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full p-2 bg-slate-700/40 hover:bg-slate-700/60 transition focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-300 hover:text-slate-100"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>

            <NewBlog
              onSuccess={handleSuccess}
              onCancel={() => setShowNewBlog(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogpage;
