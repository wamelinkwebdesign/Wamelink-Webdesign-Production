import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { blogPosts } from '../data/blogPosts';
import { useSEO } from '../hooks/useSEO';

const Blog: React.FC = () => {
  useSEO({
    title: 'Blog | Wamelink Webdesign',
    description: 'Lees onze artikelen over webdesign, development, SEO en online groei. Praktische tips en inzichten van Wamelink Webdesign Amsterdam.',
    canonical: '/blog',
    jsonLd: {
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: 'Blog - Wamelink Webdesign',
          description: 'Tips over webdesign, SEO en online groei voor MKB',
          url: 'https://wamelinkwebdesign.nl/blog',
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wamelinkwebdesign.nl' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://wamelinkwebdesign.nl/blog' },
          ],
        },
      ],
    },
  });

  const [featured, ...rest] = blogPosts;

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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-end">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-7"
              >
                <span className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 block">
                  Inzichten & tips
                </span>
                <h1 className="text-[15vw] md:text-[8vw] leading-[0.85] font-black tracking-tighter uppercase">
                  Blog
                  <span className="text-[#FFD700]">.</span>
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-5"
              >
                <p className="text-xl md:text-2xl font-medium text-gray-500 leading-relaxed">
                  Artikelen over webdesign, development en online groei.
                  Praktische kennis die je direct kunt toepassen.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featured && (
          <section className="border-b border-black bg-white">
            <Link to={`/blog/${featured.slug}`} className="group block">
              <div className="container mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-16 py-16 md:py-24">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="lg:col-span-5 flex flex-col justify-center mb-8 lg:mb-0"
                  >
                    <span className="text-[20vw] md:text-[12vw] lg:text-[8vw] font-black tracking-tighter leading-none text-[#FFD700] [-webkit-text-stroke:1px_black] md:[-webkit-text-stroke:2px_black] select-none">
                      01
                    </span>
                    <div className="flex items-center gap-4 mt-4 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFD700] border border-black rounded-full text-xs font-bold uppercase tracking-wider">
                        <Tag size={12} strokeWidth={3} />
                        {featured.category}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <Clock size={12} strokeWidth={3} />
                        {featured.readTime}
                      </span>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="lg:col-span-7 flex flex-col justify-center"
                  >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1] mb-6 group-hover:text-[#FFD700] transition-colors duration-300">
                      {featured.title}
                    </h2>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed mb-8 max-w-xl">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{featured.date}</span>
                      <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest group-hover:text-[#FFD700] transition-colors">
                        Lees artikel <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Other Posts */}
        {rest.length > 0 && (
          <section className="bg-white border-b border-black">
            {rest.map((post, i) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block border-b border-black/10 last:border-b-0"
              >
                <div className="container mx-auto px-4 sm:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-10 md:py-14 items-center"
                  >
                    <div className="md:col-span-1">
                      <span className="text-5xl md:text-6xl font-black tracking-tighter text-gray-200 group-hover:text-[#FFD700] transition-colors duration-300 leading-none">
                        {String(i + 2).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFD700] border border-black rounded-full text-xs font-bold uppercase tracking-wider">
                          {post.category}
                        </span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                    <div className="md:col-span-7">
                      <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2 group-hover:text-[#FFD700] transition-colors duration-300 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-lg text-gray-500 font-medium leading-relaxed hidden md:block">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="md:col-span-2 flex md:justify-end">
                      <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest group-hover:text-[#FFD700] transition-colors">
                        Lees <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </motion.div>
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>

      <Footer />
    </motion.div>
  );
};

export default Blog;
