const Blog = ({ data }) => {
  return (
    <div>
      <h2>{data.company}</h2>
      <p>{data.review}</p>
      <p>Rating: {data.rating}</p>
      <p>Salary: {data.salary}</p>
      <p>Role: {data.role}</p>
      <p>Date: {new Date(data.date).toLocaleDateString()}</p>
      <hr className="my-4" />
    </div>
  );
};

export default Blog;
