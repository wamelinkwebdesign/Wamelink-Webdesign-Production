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
    title: 'Concept & Strategie',
    description:
      'We bespreken het doel van je app, de doelgroep en de kernfunctionaliteiten. Samen stellen we een roadmap op die richting geeft aan het hele traject.',
  },
  {
    step: '02',
    title: 'UX Design & Prototype',
    description:
      'Ik ontwerp de gebruikerservaring en bouw een interactief prototype. Zo test je de flow en navigatie voordat er een regel code geschreven wordt.',
  },
  {
    step: '03',
    title: 'Development & Testing',
    description:
      'De app wordt gebouwd met moderne technologie. Gedurende het hele traject test ik op performance, stabiliteit en gebruiksvriendelijkheid op alle apparaten.',
  },
  {
    step: '04',
    title: 'Lancering & Support',
    description:
      'Na uitgebreide testing wordt je app gelanceerd in de App Store en/of Google Play. Ik bied doorlopende support en updates om je app optimaal te houden.',
  },
];

const benefits = [
  'Native & cross-platform development',
  'Intuïtieve gebruikerservaring',
  'Offline-first architectuur',
  'Naadloze API-integraties',
  'Persoonlijk contact, geen tussenpartijen',
  'Doorlopende support na lancering',
];

const results = [
  { value: '4.9★', label: 'App Store Rating' },
  { value: '99.9%', label: 'Uptime' },
  { value: '60fps', label: 'Performance' },
];

const faqs = [
  {
    question: 'Wat kost het om een app te laten maken?',
    answer:
      'De kosten van een app hangen af van de complexiteit, het aantal schermen en de gewenste functionaliteiten. Na een gratis kennismakingsgesprek ontvang je een transparante offerte op maat. Ik denk graag mee over een aanpak die past bij jouw budget.',
  },
  {
    question: 'Bouwen jullie native of cross-platform apps?',
    answer:
      'Beide. Afhankelijk van jouw doelen en budget adviseer ik de beste aanpak. Cross-platform (React Native) is ideaal als je snel op iOS én Android wilt zijn. Native development (Swift/Kotlin) kies je wanneer maximale performance en platform-specifieke features cruciaal zijn.',
  },
  {
    question: 'Hoe lang duurt het om een app te ontwikkelen?',
    answer:
      'Een MVP (Minimum Viable Product) is vaak binnen 6 tot 10 weken klaar. Een volledige app met uitgebreide functionaliteiten kan 3 tot 6 maanden duren. We werken in sprints zodat je tussentijds resultaat ziet en feedback kunt geven.',
  },
  {
    question: 'Bieden jullie ook onderhoud en updates aan?',
    answer:
      'Ja. Na lancering bied ik onderhoudspakketten aan die updates, bug fixes, server monitoring en nieuwe features omvatten. Zo blijft je app veilig, snel en up-to-date met de nieuwste OS-versies.',
  },
  {
    question: 'Kan mijn app koppelen met bestaande systemen?',
    answer:
      'Absoluut. Ik bouw apps die naadloos integreren met bestaande systemen zoals CRM\'s, betaalsystemen, databases en externe API\'s. Zo wordt je app een verlengstuk van je huidige workflow.',
  },
];

const AppLatenMakenAmsterdam: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useSEO({
    title: 'App laten maken Amsterdam | App ontwikkeling | Wamelink Webdesign',
    description: 'App laten maken in Amsterdam? Wamelink Webdesign ontwikkelt maatwerk apps voor iOS en Android. Van concept tot App Store. Vraag een gratis offerte aan.',
    canonical: '/app-laten-maken-amsterdam',
    jsonLd: {
      '@graph': [
        {
          '@type': 'Service',
          name: 'App laten maken Amsterdam',
          description: 'Maatwerk app development in Amsterdam. Native en cross-platform apps voor iOS en Android.',
          provider: {
            '@type': 'ProfessionalService',
            name: 'Wamelink Webdesign',
            url: 'https://wamelinkwebdesign.nl',
          },
          areaServed: { '@type': 'City', name: 'Amsterdam' },
          serviceType: 'Mobile App Development',
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wamelinkwebdesign.nl' },
            { '@type': 'ListItem', position: 2, name: 'App laten maken Amsterdam', item: 'https://wamelinkwebdesign.nl/app-laten-maken-amsterdam' },
          ],
        },
      ],
    },
  });

  return (
    <motion.div
      key="app-laten-maken-amsterdam"
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
                App Ontwikkeling Bureau
              </span>
              <h1 className="text-[11vw] md:text-[5vw] leading-[0.9] font-black tracking-tighter uppercase mb-8">
                App Laten Maken
                <br />
                <span className="text-[#FFD700] [-webkit-text-stroke:1px_black] md:[-webkit-text-stroke:2px_black] whitespace-nowrap">
                  in Amsterdam
                </span>
              </h1>
              <p className="text-xl md:text-2xl font-medium text-gray-500 leading-relaxed max-w-2xl mb-12">
                Van idee tot App Store. Ik ontwikkel apps die gebruikers niet vergeten.
                Snel, betrouwbaar en gebouwd om te groeien.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <MagneticButton
                  href="https://calendar.app.google/DZwS3JYfBFnzHn566"
                  target="_blank"
                  className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-[#FFD700] hover:text-black transition-colors flex items-center justify-center gap-3"
                >
                  Gratis Kennismakingsgesprek <ArrowRight size={18} />
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
                    Waarom een Maatwerk App?
                  </h2>
                  <p className="text-xl font-medium text-gray-500 leading-relaxed">
                    Een app brengt je dichter bij je klanten dan welk ander digitaal kanaal ook.
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
                    Mensen besteden gemiddeld <strong>4,5 uur per dag</strong> op hun smartphone.
                    Een eigen app geeft je directe toegang tot je doelgroep. Met push-notificaties,
                    offline functionaliteit en een ervaring die sneller en persoonlijker is dan een
                    website.
                  </p>
                  <p className="text-lg leading-relaxed mb-10">
                    Bij Wamelink Webdesign bouw ik apps die{' '}
                    <strong>technisch solide en gebruiksvriendelijk</strong> zijn. Geen bloatware,
                    geen onnodige complexiteit. Alleen de features die jouw gebruikers nodig
                    hebben, gebouwd met de nieuwste technologie.
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
                De standaard waar wij naartoe werken bij elke app.
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
                    Van eerste idee tot lancering in de App Store. In vier stappen.
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
                    Alles over het laten maken van een app in Amsterdam.
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
              app die{' '}
              <span className="text-[#FFD700] [-webkit-text-stroke:1px_black] md:[-webkit-text-stroke:2px_black]">
                groeit
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

export default AppLatenMakenAmsterdam;
