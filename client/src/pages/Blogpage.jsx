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
    <div className="relative max-w-4xl mx-auto p-4">
      <button
        onClick={() => setShowNewBlog(true)}
        className="absolute top-4 right-4 p-3 rounded-full bg-sky-600 text-white shadow-lg hover:bg-sky-700 transition-transform hover:scale-110"
      >
        <Plus size={20} />
      </button>

      {showNewBlog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl relative shadow-2xl">
            <button
              onClick={() => setShowNewBlog(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
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

      <h1 className="text-3xl font-bold mb-6">Latest Reviews</h1>

      <div className="mt-8 space-y-4">
        {blogs.map((blog) => (
          <Blog key={blog.id} data={blog} />
        ))}
      </div>
    </div>
  );
};

export default Blogpage;
