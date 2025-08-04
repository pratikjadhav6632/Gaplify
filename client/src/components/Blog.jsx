import { Link } from 'react-router-dom';
import { FaBookmark, FaCalendar, FaUser, FaClock, FaTag, FaShareAlt } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

// Helper function to generate structured data
const generateBlogStructuredData = (posts) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  "headline": "SkillBridgeAI Blog - Career Development & Skill Enhancement",
  "description": "Discover expert insights, career advice, and the latest trends in professional development and skill enhancement.",
  "publisher": {
    "@type": "Organization",
    "name": "SkillBridgeAI",
    "logo": {
      "@type": "ImageObject",
      "url": "https://skillbridgeai.com/logo.png"
    }
  },
  "blogPost": posts.map(post => ({
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "image": post.image,
    "keywords": post.tags.join(', ')
  }))
});

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI in Career Development",
      slug: "future-of-ai-in-career-development",
      date: "2025-08-03",
      author: "John Smith",
      readingTime: "10 min",
      excerpt: "Explore how artificial intelligence is revolutionizing career development and how SkillBridgeAI is leading the way in personalized career growth solutions.",
      content: `Artificial Intelligence is transforming how professionals approach career development. From personalized learning paths to AI-powered skill assessments, the future of career growth is here. In this comprehensive guide, we'll explore the key ways AI is reshaping professional development and how you can leverage these advancements to stay ahead in your career.\n\n### Key Benefits of AI in Career Development\n- Personalized learning experiences\n- Real-time skill gap analysis\n- Predictive career pathing\n- Automated resume optimization\n- Intelligent job matching\n\nAt SkillBridgeAI, we're at the forefront of this revolution, helping professionals like you navigate the future of work with confidence.`,
      tags: ["AI", "Career Development", "Technology", "Future of Work"],
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 2,
      title: "Top 10 Skills for Future-Proof Careers in 2025",
      slug: "top-10-skills-for-future-proof-careers",
      date: "2025-08-01",
      author: "Jane Doe",
      readingTime: "15 min",
      excerpt: "Discover the essential skills that will ensure your career remains relevant and in-demand in the rapidly evolving job market of 2025 and beyond.",
      content: `The job market is evolving at an unprecedented pace, and staying relevant requires continuous skill development. Based on our research and industry trends, here are the top 10 skills that will be most valuable in 2025 and beyond.\n\n### The Essential Skills\n1. **AI and Machine Learning Literacy**\n2. **Emotional Intelligence**\n3. **Cybersecurity Awareness**\n4. **Data Analysis & Visualization**\n5. **Blockchain Fundamentals**\n6. **Cloud Computing**\n7. **Sustainability Management**\n8. **Remote Collaboration**\n9. **Critical Thinking**\n10. **Adaptability**\n\nEach of these skills represents a critical area of growth for professionals looking to future-proof their careers.`,
      tags: ["Skills Development", "Career Growth", "Future of Work", "Professional Development"],
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 3,
      title: "How to Build a Personal Brand That Gets You Hired",
      slug: "personal-branding-for-career-success",
      date: "2025-07-28",
      author: "Alex Johnson",
      readingTime: "12 min",
      excerpt: "Learn how to create a powerful personal brand that makes you stand out to employers and accelerates your career growth.",
      content: `In today's competitive job market, a strong personal brand is no longer optional—it's essential. Your personal brand is what sets you apart from other candidates and establishes your professional identity.\n\n### Steps to Build Your Personal Brand\n1. **Define Your Unique Value Proposition**\n2. **Optimize Your Online Presence**\n3. **Create Valuable Content**\n4. **Network Strategically**\n5. **Showcase Your Expertise**\n\nBy following these steps, you can create a personal brand that attracts the right opportunities and helps you achieve your career goals.`,
      tags: ["Personal Branding", "Career Growth", "Job Search", "Professional Development"],
      image: "https://images.unsplash.com/photo-1521737711867-0a8c9c0e9d0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
    }
  ];

  const structuredData = generateBlogStructuredData(blogPosts);

  return (
    <>
      <Helmet>
        <title>Career Development Blog | SkillBridgeAI</title>
        <meta name="description" content="Discover expert insights, career advice, and the latest trends in professional development and skill enhancement." />
        <meta name="keywords" content="career development, professional growth, skill enhancement, career advice, future of work" />
        <meta property="og:title" content="Career Development Blog | SkillBridgeAI" />
        <meta property="og:description" content="Expert insights and advice for career growth and professional development" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="https://skillbridgeai.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Development Blog</h1>
          <p className="text-xl text-gray-600">Expert insights and advice for your professional journey</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} itemScope itemType="https://schema.org/BlogPosting" className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-cover bg-center relative" 
                   style={{ backgroundImage: `url(${post.image})` }}>
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="bg-white bg-opacity-80 text-xs px-2 py-1 rounded-full text-gray-800 flex items-center">
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
                    <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
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
                  <Link to={`/blog/${post.slug}`} 
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        aria-label={`Read more about ${post.title}`}>
                    Read more →
                  </Link>
                  <button className="text-gray-400 hover:text-blue-600 transition-colors" 
                          aria-label="Share this article">
                    <FaShareAlt />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <section className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated with Career Insights</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Subscribe to our newsletter for the latest career development tips, industry trends, and exclusive content.</p>
          <div className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow px-4 py-2 rounded-l-lg border border-r-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Email address"
            />
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg transition-colors"
              aria-label="Subscribe to newsletter">
              Subscribe
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Blog;
