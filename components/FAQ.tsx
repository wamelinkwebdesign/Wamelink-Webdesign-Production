import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Wat kost een website laten maken in Amsterdam?',
    answer:
      'De kosten voor een website laten maken in Amsterdam variëren op basis van de complexiteit en functionaliteit. Een professionele maatwerk website begint vanaf €1.500. Bij Wamelink Webdesign krijg je altijd een transparante offerte op maat, inclusief responsive design, SEO-optimalisatie en persoonlijke begeleiding.',
  },
  {
    question: 'Hoe lang duurt het om een website te laten maken?',
    answer:
      'Een standaard maatwerk website is gemiddeld binnen 2 tot 4 weken klaar. Dit is afhankelijk van de omvang van het project, het aantal pagina\'s en de gewenste functionaliteiten. Bij Wamelink Webdesign houden we je gedurende het hele proces op de hoogte.',
  },
  {
    question: 'Wordt mijn website geoptimaliseerd voor Google (SEO)?',
    answer:
      'Ja, elke website die wij bouwen wordt standaard SEO-geoptimaliseerd. Dit betekent snelle laadtijden, schone code, juiste heading-structuur, meta tags en mobiel-vriendelijk design. Zo scoor je beter in Google en trek je meer bezoekers aan.',
  },
  {
    question: 'Waarom kiezen voor Wamelink Webdesign in Amsterdam?',
    answer:
      'Bij Wamelink Webdesign werk je direct samen met een ervaren designer en developer. Geen tussenpersonen, geen templates. Je krijgt een unieke maatwerk website die past bij jouw merk, razendsnel laadt en hoog scoort in Google. Gevestigd aan de Herengracht in Amsterdam.',
  },
  {
    question: 'Kan ik mijn website zelf beheren na oplevering?',
    answer:
      'Uiteraard. Na oplevering krijg je een uitleg over hoe je content kunt aanpassen. Daarnaast bieden we onderhoudspakketten aan zodat je website altijd up-to-date, veilig en snel blijft.',
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white border-b border-black">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left Column — Heading */}
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
                Alles wat je wilt weten over het laten maken van een website in Amsterdam.
              </p>
            </motion.div>
          </div>

          {/* Right Column — FAQ Items */}
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
                    onClick={() => toggle(index)}
                    className="w-full py-6 flex items-start justify-between gap-4 text-left group"
                    aria-expanded={openIndex === index}
                  >
                    <h3 className="text-lg md:text-xl font-bold tracking-tight group-hover:text-[#FFD700] transition-colors pr-4">
                      {faq.question}
                    </h3>
                    <div className="w-8 h-8 flex-shrink-0 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-[#FFD700] group-hover:text-black transition-colors mt-0.5">
                      {openIndex === index ? (
                        <Minus size={16} strokeWidth={3} />
                      ) : (
                        <Plus size={16} strokeWidth={3} />
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
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
  );
};

export default FAQSection;
