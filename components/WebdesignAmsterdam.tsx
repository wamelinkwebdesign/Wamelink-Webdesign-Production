import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Plus, Minus, ArrowRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import MagneticButton from './MagneticButton';
import { useSEO } from '../hooks/useSEO';

const process = [
  {
    step: '01',
    title: 'Analyse & Audit',
    description:
      'Ik analyseer je huidige website op design, techniek, SEO en gebruiksvriendelijkheid. Samen bepalen we wat goed werkt en wat beter kan.',
  },
  {
    step: '02',
    title: 'Strategie & Ontwerp',
    description:
      'Op basis van de audit ontwerp ik een volledig nieuw design dat aansluit bij je merk en doelgroep. Je ziet het resultaat op een tijdelijke URL en geeft feedback.',
  },
  {
    step: '03',
    title: 'Development & Migratie',
    description:
      'Het goedgekeurde design wordt gebouwd met schone, snelle code. Bestaande content en SEO-waarde worden zorgvuldig gemigreerd zodat je niets verliest.',
  },
  {
    step: '04',
    title: 'Lancering & Optimalisatie',
    description:
      'Na uitgebreide tests gaat de vernieuwde website live. Ik monitor de performance en blijf beschikbaar voor verdere optimalisaties.',
  },
];

const benefits = [
  'Volledig nieuw maatwerk design',
  'Behoud van SEO-waarde en rankings',
  'Snellere laadtijden en betere performance',
  'Responsive op elk apparaat',
  'Persoonlijke samenwerking, geen tussenpersonen',
  'Zorgvuldige content- en datamigratie',
];

const results = [
  { value: '2.5x', label: 'Meer Conversie' },
  { value: '100%', label: 'SEO Behoud' },
  { value: '<1s', label: 'Laadtijd' },
];

const faqs = [
  {
    question: 'Verlies ik mijn Google-posities bij een redesign?',
    answer:
      'Nee. Ik zorg voor een zorgvuldige migratie waarbij URL-structuren, redirects en meta-informatie behouden blijven. In de meeste gevallen verbeteren je rankings juist door de snellere laadtijden en betere technische SEO.',
  },
  {
    question: 'Hoe lang duurt een website redesign?',
    answer:
      'Een gemiddeld redesign traject duurt 2 tot 4 weken, afhankelijk van de omvang van je huidige website en de gewenste veranderingen. We werken in fases zodat je tussentijds feedback kunt geven.',
  },
  {
    question: 'Kan ik mijn bestaande content behouden?',
    answer:
      'Ja, bestaande teksten, afbeeldingen en andere content worden zorgvuldig gemigreerd naar de nieuwe website. Waar nodig adviseer ik over verbeteringen aan de content voor betere SEO-resultaten.',
  },
  {
    question: 'Wat als mijn huidige website op WordPress draait?',
    answer:
      'Geen probleem. Ik heb ervaring met het migreren van websites vanaf elk platform. Of je nu van WordPress, Wix, Squarespace of een ander systeem komt, de overgang verloopt soepel.',
  },
  {
    question: 'Hoeveel kost een website redesign?',
    answer:
      'De investering hangt af van de omvang en complexiteit van je huidige website. Na een gratis analyse ontvang je een transparante offerte op maat, zonder verrassingen achteraf.',
  },
];

const WebsiteRedesignAmsterdam: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useSEO({
    title: 'Website redesign Amsterdam | Vernieuw je website | Wamelink Webdesign',
    description: 'Website redesign in Amsterdam? Wamelink Webdesign vernieuwt je website met maatwerk design, snellere performance en betere SEO. Behoud je rankings. Vraag een gratis analyse aan.',
    canonical: '/website-redesign-amsterdam',
    jsonLd: {
      '@type': 'Service',
      name: 'Website redesign Amsterdam',
      description: 'Website redesign in Amsterdam. Vernieuw je website met maatwerk design, snellere performance en betere SEO.',
      provider: {
        '@type': 'ProfessionalService',
        name: 'Wamelink Webdesign',
        url: 'https://wamelinkwebdesign.nl',
      },
      areaServed: { '@type': 'City', name: 'Amsterdam' },
      serviceType: 'Website Redesign',
    },
  });

  return (
    <motion.div
      key="website-redesign-amsterdam"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >

      <Header />

      <main>
        {/* Hero */}
        <section className="relative min-h-[80vh] flex items-center py-32 border-b border-black bg-white overflow-hidden">
          <div className="container mx-auto px-4 sm:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl"
            >
              <span className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 block">
                Website Redesign Bureau
              </span>
              <h1 className="text-[11vw] md:text-[5vw] leading-[0.9] font-black tracking-tighter uppercase mb-8">
                Website Redesign
                <br />
                <span className="text-[#FFD700] [-webkit-text-stroke:1px_black] md:[-webkit-text-stroke:2px_black] whitespace-nowrap">
                  Amsterdam
                </span>
              </h1>
              <p className="text-xl md:text-2xl font-medium text-gray-500 leading-relaxed max-w-2xl mb-12">
                Je website verouderd? Tijd voor een upgrade. Ik vernieuw je website met een strak
                design, snellere performance en betere vindbaarheid in Google.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <MagneticButton
                  href="https://calendar.app.google/DZwS3JYfBFnzHn566"
                  target="_blank"
                  className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-[#FFD700] hover:text-black transition-colors flex items-center justify-center gap-3"
                >
                  Gratis Website Analyse <ArrowRight size={18} />
                </MagneticButton>
                <MagneticButton
                  href="mailto:dennis@wamelinkwebdesign.nl"
                  className="bg-white text-black border-2 border-black px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-[#FFD700] hover:text-black transition-colors flex items-center justify-center"
                >
                  Stuur een mail
                </MagneticButton>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pain Points + Benefits */}
        <section className="py-24 bg-white border-b border-black">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-6">
                    Waarom een Website Redesign?
                  </h2>
                  <p className="text-xl font-medium text-gray-500 leading-relaxed">
                    Een verouderde website kost je dagelijks klanten en geloofwaardigheid.
                  </p>
                </motion.div>
              </div>

              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-lg leading-relaxed mb-6">
                    Webdesign trends en technologie veranderen snel. Een website die drie jaar
                    geleden modern was, kan vandaag verouderd overkomen. Trage laadtijden, een
                    niet-responsive design of een onduidelijke navigatie zorgen ervoor dat bezoekers{' '}
                    <strong>binnen 3 seconden afhaken</strong>.
                  </p>
                  <p className="text-lg leading-relaxed mb-10">
                    Bij een redesign bouw ik je website{' '}
                    <strong>vanaf de grond opnieuw op</strong>, met behoud van je bestaande
                    SEO-waarde en content. Het resultaat: een snellere, mooiere website die weer
                    converteert en aansluit bij waar je bedrijf nu staat.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {benefits.map((benefit, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle
                          size={20}
                          className="text-[#FFD700] flex-shrink-0"
                          strokeWidth={3}
                        />
                        <span className="text-base font-bold">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-24 bg-black text-white border-b border-black">
          <div className="container mx-auto px-4 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-4">
                Resultaten
              </h2>
              <p className="text-xl font-medium text-gray-400">
                Gemiddelde resultaten na een website redesign.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-3xl mx-auto">
              {results.map((result, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="text-center"
                >
                  <div className="text-6xl md:text-7xl font-black tracking-tighter text-[#FFD700] mb-2">
                    {result.value}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {result.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-24 bg-white border-b border-black">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="sticky top-32"
                >
                  <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-6">
                    Werkwijze
                  </h2>
                  <p className="text-xl font-medium text-gray-500 leading-relaxed">
                    Van analyse tot lancering, in vier duidelijke stappen.
                  </p>
                </motion.div>
              </div>

              <div className="lg:col-span-8">
                <div className="space-y-0 divide-y divide-black">
                  {process.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="py-8 grid grid-cols-12 gap-6 items-start"
                    >
                      <div className="col-span-2 md:col-span-1">
                        <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">
                          {item.step}
                        </span>
                      </div>
                      <div className="col-span-10 md:col-span-3">
                        <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
                      </div>
                      <div className="col-span-12 md:col-span-8">
                        <p className="text-lg text-gray-600 leading-relaxed font-medium">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-white border-b border-black">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="sticky top-32"
                >
                  <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-6">
                    Veelgestelde Vragen
                  </h2>
                  <p className="text-xl font-medium text-gray-500 leading-relaxed">
                    Alles over het redesignen van je website.
                  </p>
                </motion.div>
              </div>

              <div className="lg:col-span-8">
                <div className="divide-y divide-black">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full py-6 flex items-start justify-between gap-4 text-left group"
                        aria-expanded={openFaq === index}
                      >
                        <h3 className="text-lg md:text-xl font-bold tracking-tight group-hover:text-[#FFD700] transition-colors pr-4">
                          {faq.question}
                        </h3>
                        <div className="w-8 h-8 flex-shrink-0 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-[#FFD700] group-hover:text-black transition-colors mt-0.5">
                          {openFaq === index ? (
                            <Minus size={16} strokeWidth={3} />
                          ) : (
                            <Plus size={16} strokeWidth={3} />
                          )}
                        </div>
                      </button>
                      <AnimatePresence>
                        {openFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="pb-6 text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
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
              Klaar voor een
              <br />
              website die weer{' '}
              <span className="text-[#FFD700] [-webkit-text-stroke:1px_black] md:[-webkit-text-stroke:2px_black]">
                scoort
              </span>
              ?
            </motion.h2>
            <p className="text-lg md:text-xl text-gray-500 font-medium mb-10 md:mb-12 max-w-xl mx-auto">
              <span className="block">Vraag een gratis website analyse aan.</span>
              <span className="block">Ik reageer binnen 24 uur.</span>
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full px-2 sm:px-0">
              <MagneticButton
                href="https://calendar.app.google/DZwS3JYfBFnzHn566"
                target="_blank"
                className="bg-black text-white px-8 md:px-12 py-5 md:py-6 rounded-full text-lg md:text-xl font-bold uppercase tracking-widest hover:bg-[#FFD700] hover:text-black transition-colors hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-none flex items-center justify-center"
              >
                Gratis analyse
              </MagneticButton>
              <MagneticButton
                href="mailto:dennis@wamelinkwebdesign.nl"
                className="bg-white text-black border-2 border-black px-8 md:px-12 py-5 md:py-6 rounded-full text-lg md:text-xl font-bold uppercase tracking-widest hover:bg-[#FFD700] hover:text-black transition-colors hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-none flex items-center justify-center"
              >
                Stuur een mail
              </MagneticButton>
            </div>
          </div>

          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-full -z-10 pointer-events-none opacity-5">
            <div className="w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-black rounded-full blur-[100px] absolute -left-1/4 -bottom-1/2" />
            <div className="w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#FFD700] rounded-full blur-[100px] absolute -right-1/4 -top-1/2" />
          </div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default WebsiteRedesignAmsterdam;
