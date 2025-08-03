import { Link } from 'react-router-dom';
import { FaBookmark, FaCalendar, FaUser, FaClock } from 'react-icons/fa';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI in Career Development",
      slug: "future-of-ai-in-career-development",
      date: "2025-08-03",
      author: "John Smith",
      readingTime: "10 min",
      excerpt: "Explore how artificial intelligence is revolutionizing career development and how Gaplify is leading the way...",
      tags: ["AI", "Career Development", "Technology"],
      image: "https://source.unsplash.com/random/800x600/?career,development"
    },
    {
      id: 2,
      title: "Top 10 Skills for Future-Proof Careers",
      slug: "top-10-skills-for-future-proof-careers",
      date: "2025-08-01",
      author: "Jane Doe",
      readingTime: "15 min",
      excerpt: "Discover the essential skills that will ensure your career remains relevant in the rapidly evolving job market...",
      tags: ["Skills", "Career Development", "Future"],
      image: "https://source.unsplash.com/random/800x600/?skills,development"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-cover bg-center" 
                 style={{ backgroundImage: `url(${post.image})` }}>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm text-gray-500">
                  <FaCalendar className="inline mr-1" />
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-500">
                  <FaUser className="inline mr-1" />
                  {post.author}
                </span>
                <span className="text-sm text-gray-500">
                  <FaClock className="inline mr-1" />
                  {post.readingTime}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex space-x-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-sm bg-primary-100 text-primary-800 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <Link 
                to={`/blog/${post.slug}`}
                className="mt-4 inline-block bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
              >
                Read More
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12">
        <Link 
          to="/submit-guest-post"
          className="inline-block bg-primary-500 text-white px-6 py-3 rounded-md hover:bg-primary-600 transition-colors"
        >
          Submit a Guest Post
        </Link>
      </div>
    </div>
  );
};

export default Blog;
