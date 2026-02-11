import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  const benefits = [
    'Maatwerk design — geen templates',
    'SEO-geoptimaliseerd vanaf dag één',
    'Razendsnelle laadtijden',
    'Responsive op elk apparaat',
    'Persoonlijk contact — geen tussenpersonen',
    'Onderhoud & support na oplevering',
  ];

  return (
    <section id="about" className="py-24 bg-white border-b border-black">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left Column — Heading */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-6">
                Website Laten Maken in Amsterdam
              </h2>
              <p className="text-xl font-medium text-gray-500 leading-relaxed">
                Wamelink Webdesign bouwt maatwerk websites die jouw bedrijf laten groeien.
              </p>
            </motion.div>
          </div>

          {/* Right Column — Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-lg leading-relaxed mb-6">
                Op zoek naar een betrouwbare partner om je <strong>website te laten maken in Amsterdam</strong>?
                Bij Wamelink Webdesign werk je rechtstreeks samen met een ervaren designer en developer.
                Geen standaard templates, maar een unieke website die volledig aansluit bij jouw merk en doelgroep.
              </p>
              <p className="text-lg leading-relaxed mb-8">
                Elke website die ik bouw is <strong>geoptimaliseerd voor Google</strong>, razendsnel en
                volledig responsive. Of je nu een zakelijke website, portfolio of webshop nodig hebt —
                ik lever een professioneel eindresultaat dat bezoekers omzet in klanten.
              </p>

              {/* Benefits Grid */}
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
                    <CheckCircle size={20} className="text-[#FFD700] flex-shrink-0" strokeWidth={3} />
                    <span className="text-base font-bold">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
