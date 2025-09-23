import Blog from "../components/Blog";

const Blogpage = () => {
  const posts = [
    {
      id: 1,
      title: "First Post",
      content: "This is the content of the first post.",
    },
    {
      id: 2,
      title: "Second Post",
      content: "This is the content of the second post.",
    },
  ];
  return (
    <div>
      {posts.map((post) => (
        <Blog key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Blogpage;
