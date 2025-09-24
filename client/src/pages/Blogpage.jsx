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
    <div className="relative max-w-4xl mx-auto p-4 sm:p-6 text-gray-900 dark:text-white">
      <button
        onClick={() => setShowNewBlog(true)}
        aria-label="Add new blog"
        className="absolute top-4 right-4 p-3 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        <Plus size={20} />
      </button>

      <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
        Showing <span className="font-semibold">{blogs.length}</span> blogs
      </p>

      {showNewBlog && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 w-full max-w-xl relative shadow-2xl">
            <button
              onClick={() => setShowNewBlog(false)}
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <NewBlog
              onSuccess={handleSuccess}
              onCancel={() => setShowNewBlog(false)}
            />
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Latest Reviews
      </h1>

      <div className="mt-8 space-y-4">
        {blogs.map((blog) => (
          <Blog key={blog.id} data={blog} />
        ))}
      </div>
    </div>
  );
};

export default Blogpage;
