import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaCalendar, FaUser, FaClock, FaTag, FaShareAlt } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '../data/blogPosts';

// Helper function to generate schema.org structured data
const generateBlogStructuredData = (posts) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  headline: "SkillBridgeAI Blog - Career Development & Skill Enhancement",
  description:
    "Discover expert insights, career advice, and the latest trends in professional development and skill enhancement.",
  publisher: {
    "@type": "Organization",
    name: "Gaplify",
    logo: {
      "@type": "ImageObject",
      url: "https://gaplify.com/logo.png",
    },
  },
  blogPost: posts.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    image: post.image,
    keywords: post.tags.join(', '),
  })),
});

const Blog = () => {
  const { slug } = useParams();
  const selectedPost = blogPosts.find((p) => p.slug === slug);

  // local state for markdown content when not embedded in blogPosts data
  const [mdContent, setMdContent] = useState(selectedPost?.content || '');
  // fetch markdown when navigating to detail view and content not preloaded
  useEffect(() => {
    if (slug && selectedPost && !mdContent) {
      fetch(`/posts/${selectedPost.file}`)
        .then((res) => res.text())
        .then((text) => setMdContent(text))
        .catch((err) => console.error('Failed to load blog markdown:', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, selectedPost]);
  // Detailed view
  if (slug && selectedPost) {
    if (!mdContent) {
      return (
        <main className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Loading article...</p>
        </main>
      );
    }

    const postStructuredData = generateBlogStructuredData([selectedPost]);
    
    

    return (
      <>
        <Helmet>
          <title>{selectedPost.title} | Gaplify Blog</title>
          <meta name="description" content={selectedPost.excerpt} />
          <meta property="og:title" content={`${selectedPost.title} | Gaplify Blog`} />
          <meta property="og:description" content={selectedPost.excerpt} />
          <meta property="og:type" content="article" />
          <meta property="og:image" content={selectedPost.image} />
          <script type="application/ld+json">{JSON.stringify(postStructuredData)}</script>
        </Helmet>

        <main className="container mx-auto px-4 py-12 max-w-3xl">
          <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-64 object-cover rounded-lg mb-6" />

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedPost.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8">
            <span className="flex items-center">
              <FaCalendar className="mr-1" />
              {new Date(selectedPost.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center">
              <FaUser className="mr-1" /> {selectedPost.author}
            </span>
            <span className="flex items-center">
              <FaClock className="mr-1" /> {selectedPost.readingTime} read
            </span>
          </div>

          <div className="prose lg:prose-xl text-gray-800 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {mdContent}
            </ReactMarkdown>
          </div>

          <div className="mt-10">
            <Link to="/blog" className="text-blue-600 hover:text-blue-800 underline">
              ← Back to all posts
            </Link>
          </div>
        </main>
      </>
    );
  }
  const structuredData = generateBlogStructuredData(blogPosts);

  return (
    <>
      <Helmet>
        <title>Career Development Blog | Gaplify</title>
        <meta
          name="description"
          content="Discover expert insights, career advice, and the latest trends in professional development and skill enhancement."
        />
        <meta
          name="keywords"
          content="career development, professional growth, skill enhancement, career advice, future of work"
        />
        <meta property="og:title" content="Career Development Blog | Gaplify" />
        <meta
          property="og:description"
          content="Expert insights and advice for career growth and professional development"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content="https://gaplify.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <main className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Development Blog</h1>
          <p className="text-xl text-gray-600">Expert insights and advice for your professional journey</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              itemScope
              itemType="https://schema.org/BlogPosting"
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300"
            >
              <div
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${post.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-white bg-opacity-80 text-xs px-2 py-1 rounded-full text-gray-800 flex items-center"
                      >
                        <FaTag className="mr-1 text-xs" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                  <span className="flex items-center">
                    <FaCalendar className="mr-1" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </span>
                  <span className="flex items-center">
                    <FaUser className="mr-1" />
                    <span itemProp="author">{post.author}</span>
                  </span>
                  <span className="flex items-center">
                    <FaClock className="mr-1" />
                    {post.readingTime} read
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                  <Link to={`/blog/${post.slug}`} className="hover:underline" itemProp="headline">
                    {post.title}
                  </Link>
                </h2>

                <p className="text-gray-600 mb-4 flex-grow" itemProp="description">
                  {post.excerpt}
                </p>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    aria-label={`Read more about ${post.title}`}
                  >
                    Read more →
                  </Link>
                  <button
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label="Share this article"
                  >
                    <FaShareAlt />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <section className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated with Career Insights</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest career development tips, industry trends, and exclusive content.
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-2 rounded-l-lg border border-r-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Email address"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg transition-colors"
              aria-label="Subscribe to newsletter"
            >
              Subscribe
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Blog;
