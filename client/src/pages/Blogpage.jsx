import { useEffect, useRef, useState } from "react";
import Blog from "../components/Blog";
import NewBlog from "../components/NewBlog";
import { Plus } from "lucide-react";
import axios from "axios";

const Blogpage = () => {
  const [showNewBlog, setShowNewBlog] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const handleSuccess = () => {
    setShowNewBlog(false);
    fetchBlogs();
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`);
      if (response.status === 200) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-[1120px] w-[92vw] mx-auto relative space-y-8 py-6">
        <button
          onClick={() => setShowNewBlog(true)}
          aria-label="Add new blog"
          className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full p-2 bg-slate-700/40 hover:bg-slate-700/60 transition focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <Plus className="w-5 h-5" />
        </button>

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
          {loading ? (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center text-slate-200/75">
              Loading...
            </div>
          ) : blogs.length > 0 ? (
            blogs.map((blog) => <Blog key={blog.id} data={blog} />)
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center text-slate-200/75">
              No reviews yet. Be the first to share your experience!
            </div>
          )}
        </div>
      </div>

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
              className="absolute -top-3 -right-3 inline-flex items-center justify-center rounded-full p-2 bg-slate-700/40 hover:bg-slate-700/60 transition focus:outline-none focus:ring-2 focus:ring-slate-500"
              aria-label="Close"
            >
              ×
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
