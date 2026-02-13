import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { blogPosts } from '../data/blogPosts';

const Blog: React.FC = () => {
  useEffect(() => {
    document.title = 'Blog | Wamelink Webdesign';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Lees onze artikelen over webdesign, development, SEO en online groei. Praktische tips en inzichten van Wamelink Webdesign Amsterdam.'
      );
    }
    window.scrollTo(0, 0);
    return () => {
      document.title = 'Website laten maken Amsterdam | Wamelink Webdesign';
    };
  }, []);

  return (
    <motion.div
      key="blog"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header />

      <main>
        {/* Hero */}
        <section className="relative flex items-center py-32 border-b border-black bg-white overflow-hidden">
          <div className="container mx-auto px-4 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <span className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 block">
                Inzichten & Tips
              </span>
              <h1 className="text-[11vw] md:text-[5vw] leading-[0.9] font-black tracking-tighter uppercase mb-8">
                Blog
              </h1>
              <p className="text-xl md:text-2xl font-medium text-gray-500 leading-relaxed max-w-2xl">
                Artikelen over webdesign, development en online groei.
                Praktische kennis die je direct kunt toepassen.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-24 bg-white border-b border-black">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
              {blogPosts.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group block bg-white border border-black rounded-2xl p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 h-full flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFD700] border border-black rounded-full text-xs font-bold uppercase tracking-wider">
                          <Tag size={12} strokeWidth={3} />
                          {post.category}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                          <Clock size={12} strokeWidth={3} />
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4 group-hover:text-[#FFD700] transition-colors leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-lg text-gray-500 font-medium leading-relaxed mb-6">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-black/10">
                      <span className="text-sm font-bold text-gray-400">{post.date}</span>
                      <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest group-hover:text-[#FFD700] transition-colors">
                        Lees meer <ArrowRight size={16} strokeWidth={3} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Blog;
