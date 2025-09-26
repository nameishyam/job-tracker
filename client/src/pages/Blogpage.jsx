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

  // close on Escape
  useEffect(() => {
    if (!showNewBlog) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShowNewBlog(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showNewBlog]);

  // Optional: focus the panel when opened (improves keyboard UX)
  useEffect(() => {
    if (showNewBlog && panelRef.current) {
      // small timeout so element is mounted
      setTimeout(() => panelRef.current?.focus?.(), 0);
    }
  }, [showNewBlog]);

  return (
    <div className="page-shell">
      <div className="page-width relative space-y-8 py-6">
        <button
          onClick={() => setShowNewBlog(true)}
          aria-label="Add new blog"
          className="dark-icon-btn absolute top-4 right-4 inline-flex items-center justify-center"
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
            <div className="dark-panel dark-panel--tight p-8 text-center text-slate-200/75">
              Loading...
            </div>
          ) : blogs.length > 0 ? (
            blogs.map((blog) => <Blog key={blog.id} data={blog} />)
          ) : (
            <div className="dark-panel dark-panel--tight p-8 text-center text-slate-200/75">
              No reviews yet. Be the first to share your experience!
            </div>
          )}
        </div>
      </div>

      {showNewBlog && (
        // overlay: clicking this overlay (but not the inner panel) will close the modal
        <div
          className="fixed inset-0 z-[90] bg-slate-950/70 backdrop-blur-xl flex items-center justify-center p-4"
          // only close when clicking directly on the overlay (not when clicking children)
          onMouseDown={(e) => {
            // e.currentTarget is this overlay div; if target === currentTarget, user clicked the backdrop
            if (e.target === e.currentTarget) setShowNewBlog(false);
          }}
        >
          <div
            ref={panelRef}
            // make panel focusable for the autofocus above
            tabIndex={-1}
            className="dark-panel dark-panel--surface dark-panel--tight w-full max-w-xl p-6 sm:p-8 relative rounded-2xl shadow-2xl border border-white/6 transition-transform transform-gpu"
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Create new blog"
          >
            <button
              onClick={() => setShowNewBlog(false)}
              className="dark-icon-btn absolute -top-3 -right-3"
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
