import React, { useMemo, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Tag } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import MagneticButton from './MagneticButton';
import { blogPosts, BlogSection } from '../data/blogPosts';
import { useSEO } from '../hooks/useSEO';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);
  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const nextPost = postIndex >= 0 && blogPosts.length > 1
    ? blogPosts[(postIndex + 1) % blogPosts.length]
    : null;
  const articleNumber = postIndex >= 0 ? String(postIndex + 1).padStart(2, '0') : '01';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const headingIndices = useMemo(() => {
    const indices: Record<number, number> = {};
    let count = 0;
    post?.content.forEach((section, i) => {
      if (section.type === 'heading') {
        count++;
        indices[i] = count;
      }
    });
    return indices;
  }, [post]);

  const firstParagraphIndex = useMemo(() => {
    return post?.content.findIndex((s) => s.type === 'paragraph') ?? -1;
  }, [post]);

  const jsonLd = useMemo(() => {
    if (!post) return undefined;
    return {
      '@graph': [
        {
          '@type': 'Article',
          headline: post.title,
          description: post.metaDescription,
          datePublished: '2026-02-13',
          dateModified: '2026-02-13',
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
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wamelinkwebdesign.nl' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://wamelinkwebdesign.nl/blog' },
            { '@type': 'ListItem', position: 3, name: post.title, item: `https://wamelinkwebdesign.nl/blog/${post.slug}` },
          ],
        },
      ],
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

  const renderSection = (section: BlogSection, index: number) => {
    switch (section.type) {
      case 'heading':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 mb-8"
          >
            <div className="flex items-baseline gap-4 md:gap-6">
              <span className="text-5xl md:text-7xl font-black text-gray-100 tracking-tighter leading-none select-none hidden md:block min-w-[56px] text-right">
                {String(headingIndices[index] || 0).padStart(2, '0')}
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                {section.text}
              </h2>
            </div>
          </motion.div>
        );

      case 'paragraph':
        const isFirst = index === firstParagraphIndex;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {isFirst ? (
              <p
                className="text-lg md:text-xl leading-relaxed text-gray-600 mb-6 first-letter:text-7xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.75] first-letter:text-black"
                dangerouslySetInnerHTML={{ __html: section.text || '' }}
              />
            ) : (
              <p
                className="text-lg leading-relaxed text-gray-600 mb-6"
                dangerouslySetInnerHTML={{ __html: section.text || '' }}
              />
            )}
          </motion.div>
        );

      case 'list':
        return (
          <motion.ul
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4 mb-8"
          >
            {section.items?.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-start gap-4 text-lg text-gray-600 leading-relaxed"
              >
                <span className="text-sm font-black text-[#FFD700] mt-1.5 min-w-[24px] tracking-tighter select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </motion.li>
            ))}
          </motion.ul>
        );

      case 'callout':
        if (section.variant === 'cta') {
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="my-12 bg-black text-white p-8 md:p-12 rounded-3xl border border-black relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD700] rounded-full -translate-y-1/2 translate-x-1/2 opacity-20" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FFD700] rounded-full translate-y-1/2 -translate-x-1/2 opacity-10" />
              <p className="text-xl md:text-2xl font-bold leading-relaxed mb-6 relative z-10">
                {section.text}
              </p>
              <a
                href="https://calendar.app.google/DZwS3JYfBFnzHn566"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FFD700] text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors relative z-10 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
              >
                Plan een gesprek <ArrowRight size={16} strokeWidth={3} />
              </a>
            </motion.div>
          );
        }
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="my-10 relative"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFD700]" />
            <div className="pl-8">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFD700] mb-2 block">
                Tip
              </span>
              <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-800">
                {section.text}
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      key={`blog-${slug}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#FFD700] z-[60] origin-left"
        style={{ scaleX }}
      />

      <Header />

      <main>
        {/* Hero */}
        <section className="relative flex items-end py-32 md:py-40 border-b border-black bg-white overflow-hidden">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
              {/* Left: Number + Meta */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-4"
              >
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-8"
                >
                  <ArrowLeft size={16} strokeWidth={3} />
                  Terug naar blog
                </Link>
                <span className="text-[20vw] md:text-[12vw] lg:text-[8vw] font-black tracking-tighter leading-none text-[#FFD700] [-webkit-text-stroke:1px_black] md:[-webkit-text-stroke:2px_black] select-none block">
                  {articleNumber}
                </span>
                <div className="flex items-center gap-4 mt-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFD700] border border-black rounded-full text-xs font-bold uppercase tracking-wider">
                    <Tag size={12} strokeWidth={3} />
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <Clock size={12} strokeWidth={3} />
                    {post.readTime}
                  </span>
                </div>
              </motion.div>

              {/* Right: Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-8"
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[0.95] font-black tracking-tighter mb-6">
                  {post.title}
                  <span className="text-[#FFD700]">.</span>
                </h1>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    {post.date}
                  </span>
                  <span className="h-[2px] w-16 bg-black" />
                  <span className="text-sm font-bold uppercase tracking-widest">
                    Dennis Wamelink
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16 md:py-24 bg-white border-b border-black">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              {/* Sticky sidebar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="hidden lg:block lg:col-span-2"
              >
                <div className="sticky top-32">
                  <div className="border-l-2 border-black pl-4 space-y-6">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                        Categorie
                      </span>
                      <span className="text-sm font-bold block">{post.category}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                        Leestijd
                      </span>
                      <span className="text-sm font-bold block">{post.readTime}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                        Datum
                      </span>
                      <span className="text-sm font-bold block">{post.date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                        Auteur
                      </span>
                      <span className="text-sm font-bold block">Dennis Wamelink</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Article body */}
              <article className="lg:col-span-8 lg:col-start-3">
                {post.content.map((section, index) => renderSection(section, index))}
              </article>
            </div>
          </div>
        </section>

        {/* Next Article Band */}
        {nextPost && nextPost.slug !== post.slug && (
          <Link
            to={`/blog/${nextPost.slug}`}
            className="group block border-b border-black bg-white hover:bg-black transition-colors duration-500"
          >
            <div className="container mx-auto px-4 sm:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="py-16 md:py-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-500 transition-colors mb-4 block">
                    Volgend artikel
                  </span>
                  <h3 className="text-3xl md:text-5xl font-black tracking-tighter group-hover:text-white transition-colors duration-500 leading-tight">
                    {nextPost.title}
                    <span className="text-[#FFD700]">.</span>
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  <span className="w-16 h-16 md:w-20 md:h-20 bg-[#FFD700] rounded-full flex items-center justify-center border border-black group-hover:scale-110 transition-transform duration-500">
                    <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            </div>
          </Link>
        )}

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
              <span className="block">Plan een gratis kennismakingsgesprek.</span>
              <span className="block">Ik reageer binnen 24 uur.</span>
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
