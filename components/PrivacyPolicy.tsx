import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import MagneticButton from './MagneticButton';

const PrivacyPolicy: React.FC = () => {

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="min-h-screen bg-white text-black relative z-[60]"
    >
      {/* Navigation / Header */}
      <div className="fixed top-0 left-0 w-full p-8 flex justify-between items-center bg-white/90 backdrop-blur-md z-50 border-b border-black/5">
        <div className="text-sm font-bold uppercase tracking-widest opacity-50">
           Juridisch
        </div>
        <MagneticButton>
           <Link to="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[#FFD700] transition-colors">
              <ArrowLeft size={16} /> Terug naar home
           </Link>
        </MagneticButton>
      </div>

      <div className="container mx-auto px-4 sm:px-8 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left Sidebar - Title */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                Privacy<br />Policy
              </h1>

              <div className="p-6 bg-gray-50 rounded-2xl border border-black/5 mb-8">
                <h4 className="font-bold uppercase tracking-widest mb-4 text-xs">Verwerkingsverantwoordelijke</h4>
                <div className="space-y-2 text-sm leading-relaxed">
                  <p className="font-bold">Wamelink Webdesign</p>
                  <p>Herengracht 320</p>
                  <p>1016CE Amsterdam</p>
                  <p><a href="mailto:dennis@wamelinkwebdesign.nl" className="hover:underline">dennis@wamelinkwebdesign.nl</a></p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Policy Text */}
          <div className="lg:col-span-8">
            <div className="prose prose-lg max-w-none">

              <div className="mb-12">
                <p className="text-xl font-medium leading-relaxed">
                  Wamelink Webdesign, gevestigd aan Herengracht 320 te Amsterdam, is verantwoordelijk voor de verwerking van persoonsgegevens zoals weergegeven in deze privacyverklaring.
                </p>
              </div>

              <Section title="Persoonsgegevens die wij verwerken">
                <p>Wamelink Webdesign verwerkt uw persoonsgegevens omdat u gebruik maakt van onze diensten en/of omdat u deze zelf aan ons verstrekt. Hieronder vindt u een overzicht van de persoonsgegevens die wij verwerken:</p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li>Voor- en achternaam</li>
                  <li>Adresgegevens</li>
                  <li>Telefoonnummer</li>
                  <li>E-mailadres</li>
                  <li>IP-adres</li>
                  <li>Gegevens over uw activiteiten op onze website</li>
                  <li>Internetbrowser en apparaat type</li>
                </ul>
              </Section>

              <Section title="Met welk doel en op basis van welke grondslag wij persoonsgegevens verwerken">
                <p>Wamelink Webdesign verwerkt uw persoonsgegevens voor de volgende doelen:</p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li>Het afhandelen van uw betaling</li>
                  <li>U te kunnen bellen of e-mailen indien dit nodig is om onze dienstverlening uit te kunnen voeren</li>
                  <li>Het leveren van diensten zoals webdesign, logo-ontwerp en branding</li>
                  <li>Het verbeteren van onze website en dienstverlening op basis van analytische gegevens</li>
                  <li>Het versturen van nieuwsbrieven of aanbiedingen als u zich daarvoor hebt aangemeld</li>
                </ul>
              </Section>

              <Section title="Hoe lang we persoonsgegevens bewaren">
                <p>Wamelink Webdesign bewaart uw persoonsgegevens niet langer dan strikt nodig is om de doelen te realiseren waarvoor uw gegevens worden verzameld. Wij hanteren de volgende bewaartermijnen voor de volgende (categorie&euml;n van) persoonsgegevens:</p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li><strong>Contactgegevens:</strong> 1 jaar na laatste contact</li>
                  <li><strong>Factuurgegevens:</strong> 7 jaar, conform de fiscale bewaarplicht</li>
                </ul>
              </Section>

              <Section title="Delen van persoonsgegevens met derden">
                <p>Wamelink Webdesign deelt uw persoonsgegevens alleen met derden als dit noodzakelijk is voor de uitvoering van onze overeenkomst met u of om te voldoen aan een wettelijke verplichting. Wij werken bijvoorbeeld samen met:</p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li>Betalingsproviders (zoals Moneybird)</li>
                  <li>Hostingproviders</li>
                  <li>Leveranciers voor marketingdiensten (zoals Google Analytics)</li>
                </ul>
              </Section>

              <Section title="Cookies, of vergelijkbare technieken, die wij gebruiken">
                <p>Wamelink Webdesign gebruikt functionele, analytische en tracking cookies. Een cookie is een klein tekstbestand dat bij het eerste bezoek aan deze website wordt opgeslagen op uw computer, tablet of smartphone.</p>
                <p>Wij gebruiken cookies met een puur technische functionaliteit. Deze zorgen ervoor dat de website naar behoren werkt en dat uw voorkeursinstellingen worden onthouden.</p>
              </Section>

              <Section title="Gegevens inzien, aanpassen of verwijderen">
                <p>U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. Daarnaast heeft u het recht om uw toestemming voor de gegevensverwerking in te trekken of bezwaar te maken tegen de verwerking van uw persoonsgegevens door Wamelink Webdesign.</p>
                <p>U kunt een verzoek tot inzage, correctie, verwijdering, of gegevensoverdraging van uw persoonsgegevens sturen naar <a href="mailto:dennis@wamelinkwebdesign.nl" className="underline font-bold">dennis@wamelinkwebdesign.nl</a>. Wij reageren zo snel mogelijk, maar binnen vier weken, op uw verzoek.</p>
              </Section>

              <Section title="Hoe wij persoonsgegevens beveiligen">
                <p>Wamelink Webdesign neemt de bescherming van uw gegevens serieus en neemt passende maatregelen om misbruik, verlies, onbevoegde toegang, ongewenste openbaarmaking en ongeoorloofde wijziging tegen te gaan.</p>
              </Section>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper for consistency
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-12">
    <h2 className="text-xl font-bold uppercase tracking-wider mb-4 pb-4 border-b border-black">{title}</h2>
    <div className="space-y-4 text-gray-700 leading-relaxed font-medium">
      {children}
    </div>
  </div>
);

export default PrivacyPolicy;
