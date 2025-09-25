import { useEffect, useState } from "react";
import Blog from "../components/Blog";
import NewBlog from "../components/NewBlog";
import { Plus } from "lucide-react";
import axios from "axios";

const Blogpage = () => {
  const [showNewBlog, setShowNewBlog] = useState(false);
  const [blogs, setBlogs] = useState([]);

  const handleSuccess = () => {
    setShowNewBlog(false);
    fetchBlogs();
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
    <div className="page-shell">
      <div className="page-width relative space-y-8">
        <button
          onClick={() => setShowNewBlog(true)}
          aria-label="Add new blog"
          className="glass-icon-btn absolute top-0 right-0"
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
          {blogs.length > 0 ? (
            blogs.map((blog) => <Blog key={blog.id} data={blog} />)
          ) : (
            <div className="glass-panel glass-panel--tight p-8 text-center text-slate-200/75">
              No reviews yet. Be the first to share your experience!
            </div>
          )}
        </div>
      </div>

      {showNewBlog && (
        <div className="fixed inset-0 z-[90] bg-slate-950/70 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass-panel glass-panel--surface glass-panel--tight w-full max-w-xl p-8 relative">
            <button
              onClick={() => setShowNewBlog(false)}
              className="glass-icon-btn absolute -top-3 -right-3"
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
