import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Tag, ArrowRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import MagneticButton from './MagneticButton';
import { blogPosts, BlogSection } from '../data/blogPosts';
import { useSEO } from '../hooks/useSEO';

const renderSection = (section: BlogSection, index: number) => {
  switch (section.type) {
    case 'heading':
      return (
        <h2
          key={index}
          className="text-3xl md:text-4xl font-black tracking-tight mt-12 mb-6"
        >
          {section.text}
        </h2>
      );
    case 'paragraph':
      return (
        <p
          key={index}
          className="text-lg leading-relaxed text-gray-700 mb-6"
          dangerouslySetInnerHTML={{ __html: section.text || '' }}
        />
      );
    case 'list':
      return (
        <ul key={index} className="space-y-3 mb-8 ml-1">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-lg text-gray-700">
              <div className="w-2 h-2 bg-[#FFD700] rounded-full mt-2.5 flex-shrink-0 border border-black" />
              {item}
            </li>
          ))}
        </ul>
      );
    case 'callout':
      return (
        <div
          key={index}
          className={`p-6 rounded-xl border mb-8 ${
            section.variant === 'cta'
              ? 'bg-black text-white border-black'
              : 'bg-[#FFD700]/10 border-[#FFD700] text-black'
          }`}
        >
          <p className={`text-lg font-bold leading-relaxed ${
            section.variant === 'cta' ? 'text-white' : ''
          }`}>
            {section.text}
          </p>
          {section.variant === 'cta' && (
            <div className="mt-4">
              <a
                href="https://calendar.app.google/DZwS3JYfBFnzHn566"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FFD700] text-black px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors"
              >
                Plan een gesprek <ArrowRight size={16} strokeWidth={3} />
              </a>
            </div>
          )}
        </div>
      );
    default:
      return null;
  }
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  const jsonLd = useMemo(() => {
    if (!post) return undefined;
    return {
      '@type': 'Article',
      headline: post.title,
      description: post.metaDescription,
      datePublished: '2026-02-13',
      author: {
        '@type': 'Person',
        name: 'Dennis Wamelink',
        jobTitle: 'Digital Designer & Developer',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Wamelink Webdesign',
        url: 'https://wamelinkwebdesign.nl',
      },
      mainEntityOfPage: `https://wamelinkwebdesign.nl/blog/${post.slug}`,
    };
  }, [post]);

  useSEO({
    title: post?.metaTitle || 'Blog | Wamelink Webdesign',
    description: post?.metaDescription || '',
    canonical: `/blog/${slug}`,
    ogType: 'article',
    jsonLd,
  });

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <motion.div
      key={`blog-${slug}`}
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
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-8"
              >
                <ArrowLeft size={16} strokeWidth={3} />
                Terug naar blog
              </Link>
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1] font-black tracking-tighter mb-6">
                {post.title}
              </h1>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                {post.date}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16 md:py-24 bg-white border-b border-black">
          <div className="container mx-auto px-4 sm:px-8">
            <article className="max-w-3xl">
              {post.content.map((section, index) => renderSection(section, index))}
            </article>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-32 bg-white border-b border-black overflow-hidden relative">
          <div className="container mx-auto px-4 sm:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[10vw] md:text-[5vw] leading-[0.9] font-black tracking-tighter uppercase mb-6 md:mb-8"
            >
              Klaar om te
              <br />
              <span className="text-[#FFD700] [-webkit-text-stroke:1px_black] md:[-webkit-text-stroke:2px_black]">
                starten
              </span>
              ?
            </motion.h2>
            <p className="text-lg md:text-xl text-gray-500 font-medium mb-10 md:mb-12 max-w-xl mx-auto">
              Plan een gratis kennismakingsgesprek. Ik reageer binnen 24 uur.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full px-2 sm:px-0">
              <MagneticButton
                href="https://calendar.app.google/DZwS3JYfBFnzHn566"
                target="_blank"
                className="bg-black text-white px-8 md:px-12 py-5 md:py-6 rounded-full text-lg md:text-xl font-bold uppercase tracking-widest hover:bg-[#FFD700] hover:text-black transition-colors hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-none flex items-center justify-center"
              >
                Plan een gesprek
              </MagneticButton>
              <MagneticButton
                href="mailto:dennis@wamelinkwebdesign.nl"
                className="bg-white text-black border-2 border-black px-8 md:px-12 py-5 md:py-6 rounded-full text-lg md:text-xl font-bold uppercase tracking-widest hover:bg-[#FFD700] hover:text-black transition-colors hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-none flex items-center justify-center"
              >
                Stuur een mail
              </MagneticButton>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default BlogPost;
