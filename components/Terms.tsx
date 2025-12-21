import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import MagneticButton from './MagneticButton';

interface TermsProps {
  onClose: () => void;
}

const Terms: React.FC<TermsProps> = ({ onClose }) => {
  
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
        <MagneticButton onClick={onClose}>
           <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[#FFD700] transition-colors">
              <ArrowLeft size={16} /> Terug naar home
           </button>
        </MagneticButton>
      </div>

      <div className="container mx-auto px-4 sm:px-8 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Sidebar - Title */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                Algemene<br />Voorwaarden
              </h1>
              <div className="text-sm font-mono text-gray-500 mb-8">
                Opgemaakt 2021 te Amsterdam.
              </div>
              
              <div className="p-6 bg-gray-50 rounded-2xl border border-black/5">
                <h4 className="font-bold uppercase tracking-widest mb-4 text-xs">Bedrijfsinformatie</h4>
                <div className="space-y-2 text-sm leading-relaxed">
                  <p className="font-bold">Wamelink Webdesign</p>
                  <p>KvK: 60225432</p>
                  <p>Btw: NL002265383B56</p>
                  <p><a href="mailto:dennis@wamelinkwebdesign.nl" className="hover:underline">dennis@wamelinkwebdesign.nl</a></p>
                  <p><a href="tel:+31651095919" className="hover:underline">+31 6 510 959 19</a></p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Legal Text */}
          <div className="lg:col-span-8">
            <div className="prose prose-lg max-w-none">
              
              <Article title="Artikel 1. Definities">
                <p>In deze algemene voorwaarden worden de hiernavolgende termen in de navolgende betekenis gebruikt, tenzij uitdrukkelijk anders is aangegeven.</p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li><strong>Opdrachtgever:</strong> de wederpartij van Wamelink Webdesign.</li>
                  <li><strong>Overeenkomst:</strong> de overeenkomst tussen opdrachtgever en Wamelink Webdesign.</li>
                </ul>
              </Article>

              <Article title="Artikel 2. Toepasselijkheid">
                <p>Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, offertes en alle door Wamelink Webdesign gesloten overeenkomsten en verrichtte diensten en alle overige door Wamelink Webdesign verrichtte handelingen.</p>
                <p>Door ondertekening van een overeenkomst met Wamelink Webdesign verklaart de opdrachtgever dat hij kennis heeft genomen van de algemene voorwaarden van Wamelink Webdesign en dat hij met deze voorwaarden akkoord gaat.</p>
                <p>Alle aanbiedingen zijn vrijblijvend, tenzij in het aanbod schriftelijk uitdrukkelijk anders is aangegeven.</p>
                <p>Toepasselijkheid van eventuele inkoop- of andere voorwaarden van de opdrachtgever wordt uitdrukkelijk van de hand gewezen.</p>
                <p>Indien enige bepaling van deze algemene voorwaarden nietig is of vernietigd wordt, zullen de overige bepalingen van deze algemene voorwaarden volledig van kracht blijven en zullen Wamelink Webdesign en opdrachtgever in overleg treden teneinde nieuwe bepalingen ter vervanging van de nietige c.q. vernietigde bepalingen overeen te komen, waarbij zoveel mogelijk het doel en de strekking van de nietige c.q. vernietigde bepaling in acht worden genomen.</p>
              </Article>

              <Article title="Artikel 3. Aanbiedingen en offertes">
                <p>De door Wamelink Webdesign gemaakte offertes zijn vrijblijvend; zij zijn geldig gedurende 3 maanden, tenzij anders aangegeven.</p>
                <p>Wamelink Webdesign is slechts aan de offertes gebonden indien de aanvaarding hiervan door de opdrachtgever schriftelijk en ondertekend binnen 3 maanden, aan Wamelink Webdesign wordt bevestigd, tenzij anders aangegeven.</p>
                <p>Wijzigingen in de oorspronkelijk gesloten overeenkomst tussen de opdrachtgever en Wamelink Webdesign zijn pas geldig vanaf het moment dat deze wijzigingen middels een aanvullende of gewijzigde overeenkomst zijn aanvaard door beide partijen.</p>
                <p>Een samengestelde prijsopgave verplicht Wamelink Webdesign niet tot het verrichten van een gedeelte van de opdracht tegen een overeenkomstig deel van de opgegeven prijs.</p>
                <p>Aanbiedingen of offertes gelden niet automatisch voor toekomstige opdrachten.</p>
              </Article>

              <Article title="Artikel 4. Prijzen, facturatie en betalingen">
                <p>Alle vermelde prijzen zijn exclusief BTW, tenzij anders vermeld.</p>
                <p>In geval van een overeenkomst waarin sprake is van door opdrachtgever te betalen periodiek vervallende bedragen, geldt dat Wamelink Webdesign gerechtigd is door middel van een schriftelijke kennisgeving op een termijn van tenminste drie maanden de geldende prijzen en tarieven aan te passen.</p>
                <p>Tariefswijziging kan plaats vinden bij wijziging van de inhoud van de opdracht, bij verlenging van de opdracht of bij wijzigingen in voor Wamelink Webdesign van toepassing zijnde wet- en regelgeving.</p>
                <p>Tenzij anders overeengekomen: aanbetaling van 50% op de totale kosten na het goedkeuren van de offerte en eerste opzet van de website. De website komt op een tijdelijke plaats op het internet te staan, waar de vorderingen bekeken kunnen worden. Na het gereedkomen van de website wordt het restant bedrag gefactureerd. Na ontvangst van het bedrag wordt de website op de definitieve locatie op het internet geplaatst.</p>
                <p>Facturering van onderhoudskosten, hosting en domeinnaam gebeurt per jaar vooraf (Betaling voor 31 januari van het jaar waarover het contract loopt). Alle overige bedragen worden gefactureerd bij oplevering.</p>
                <p>Een maand na facturatie (nazorgfase) wordt de website als volledig beschouwd en worden verdere veranderingen aan de website niet meer kosteloos uitgevoerd. Zie onderhoudscontracten.</p>
                <p>Betaling van het factuurbedrag dient maximaal 14 dagen na factuurdatum te geschieden, op de door Wamelink Webdesign aan te geven wijze in de valuta waarin is gedeclareerd. Bezwaren tegen de hoogte van de declaraties schorten de betalingsverplichting niet op.</p>
                <p>Alle kosten, vallende op de betaling, waaronder wissel- en bankkosten, zijn voor rekening van opdrachtgever.</p>
                <p>De ondertekenaar van een offerte is solidair aansprakelijk met de opdrachtgever, natuurlijke of rechtspersoon in naam van en voor rekening van wie hij handelt, in geval van machtsmisbruik, evenals in geval een volledige identificatie van deze klant ontbreekt. De overeenkomst tussen de partijen wordt als gesloten beschouwd vanaf het ogenblik dat de klant de offerte ondertekend heeft.</p>
                <p>Indien opdrachtgever de verschuldigde bedragen niet binnen de overeengekomen termijn betaalt, worden aanmaningskosten in rekening gebracht. Deze aanmaningskosten bedragen € 15. Indien opdrachtgever na ingebrekestelling nalatig blijft de vordering te voldoen, kan de vordering uit handen worden gegeven aan een incassobureau, in welk geval opdrachtgever naast het alsdan verschuldigde totale bedrag tevens gehouden zal zijn tot volledige vergoeding van buitengerechtelijke en gerechtelijke kosten.</p>
              </Article>

              <Article title="Artikel 5. Onderhoud van de website en onderhoudscontracten">
                <p>Deze voorwaarden gelden voor een éénjarig onderhoudscontract voor een bestaande website.</p>
                <p>Met onderhoud van de website wordt bedoeld:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>Het verzamelen, ordenen en verwerken van verkregen data van de opdrachtgever op bestaande pagina’s van de website. Het verzamelen, ordenen en verwerken van verkregen data van derden zoals de krant, tijdschriften, internet en andere media op bestaande pagina’s van de website indien toepasselijk.</li>
                    <li>Het toevoegen van nieuwe teksten op bestaande pagina’s. Wijzigingen aan de teksten worden éénmalig uitgevoerd mits binnen 1 week aangeleverd, gerekend vanaf de eerste presentatie. In alle andere gevallen worden de kosten op uurbasis aan de klant doorberekend.</li>
                    <li>Onderhoud van contacten met het hostingbedrijf indien toepasselijk.</li>
                    <li>Update van website Content Management Systeem en onderdelen indien van toepassing, mits deze geplaatst zijn door Wamelink Webdesign.</li>
                </ul>
                <p>Overgebleven uren gaan mee naar de volgende maand. Overgebleven uren gaan niet mee naar het volgende jaar. Geen restitutie van de overgebleven uren. Elk aanvullend uur wordt berekend volgens het uurtarief.</p>
                <p>Kosten van een onderhoudscontract gelden voor één jaar en moeten vooraf, binnen 30 dagen na ondertekening van het contract worden voldaan.</p>
                <p>De opzegtermijn voor een onderhoudscontract is drie maanden voor het einde van de contractdatum.</p>
              </Article>

              <Article title="Artikel 6. Verplichtingen van de opdrachtgever">
                <p>De opdrachtgever draagt zorg voor tijdige aanlevering van het materiaal.</p>
                <p>Wamelink Webdesign mag de website van opdrachtgever gebruiken voor promotie en/of publiciteit. De gebruikelijke vorm hiervoor is een kleine link in de footer van de website met de tekst: ‘Website door Wamelink Webdesign’. Daarnaast wordt er een portfolio afbeelding op wamelinkwebdesign.nl geplaatst met daaronder een korte reactie van de opdrachtgever, tenzij anders afgesproken.</p>
              </Article>

              <Article title="Artikel 7. Uitvoering van de overeenkomst">
                <p>Wamelink Webdesign zal zich naar beste kunnen inspannen de dienstverlening met zorg uit te voeren, in voorkomend geval overeenkomstig de met opdrachtgever schriftelijk vastgelegde afspraken. Webdesign is een creatief proces waarbij de uiteindelijke opgeleverde vorm en functies met de best mogelijke inspanning door Wamelink Webdesign zullen worden nagestreefd.</p>
                <p>De opdrachtgever draagt er zorg voor dat alle gegevens, waarvan Wamelink Webdesign aangeeft dat deze noodzakelijk zijn of waarvan de opdrachtgever redelijkerwijs behoort te begrijpen dat deze noodzakelijk zijn voor het uitvoeren van de overeenkomst, tijdig aan Wamelink Webdesign worden verstrekt. Indien de voor de uitvoering van de overeenkomst benodigde gegevens niet tijdig aan Wamelink Webdesign zijn verstrekt, heeft Wamelink Webdesign het recht de uitvoering van de overeenkomst op te schorten en/of de uit de vertraging voortvloeiende extra kosten aan de opdrachtgever in rekening te brengen.</p>
                <p>Wamelink Webdesign is niet aansprakelijk voor schade, van welke aard ook, doordat gebruiker is uitgegaan van door de opdrachtgever verstrekte onjuiste en/of onvolledige gegevens, tenzij deze onjuistheid of onvolledigheid voor Wamelink Webdesign kenbaar behoorde te zijn.</p>
                <p>Wamelink Webdesign zal de website opleveren binnen de in de offerte aangegeven termijn, tenzij tijdens de uitvoering anders overeengekomen. De opdrachtgever verplicht zich door ondertekening van de offerte zijn/haar medewerking hieraan te verlenen en moet op tijd de benodigde data aanleveren. Indien opdrachtgever dit nalaat zal het totaalbedrag na het verstrijken van de oplevertermijn geheel worden gefactureerd.</p>
              </Article>

              <Article title="Artikel 8. Wijzigingen en meerwerk">
                <p>Indien Wamelink Webdesign op verzoek of met voorafgaande instemming van opdrachtgever werkzaamheden of andere prestaties heeft verricht die buiten de inhoud of omvang de overeengekomen diensten en producten vallen, zullen deze werkzaamheden of prestaties door opdrachtgever aan Wamelink Webdesign worden vergoed volgens de gebruikelijke tarieven van Wamelink Webdesign. Wamelink Webdesign is echter niet verplicht aan een dergelijk verzoek te voldoen en kan verlangen dat daar voor een afzonderlijke schriftelijke overeenkomst wordt gesloten.</p>
                <p>Voor zover voor de diensten en producten een vaste prijs is afgesproken en partijen voornemens zijn om met betrekking tot extra werkzaamheden of prestaties een afzonderlijke overeenkomst te sluiten, zal Wamelink Webdesign opdrachtgever tevoren schriftelijk informeren over de financiële consequenties van die extra werkzaamheden of prestaties.</p>
                <p>Na het goedkeuren van de offerte en het goedkeuren van de eerste opzet van de website is het niet mogelijk om kosteloos veranderingen aan het design te laten uitvoeren.</p>
                <p>Tariefswijziging kan plaats vinden bij wijziging van de inhoud van de opdracht, bij verlenging van de opdracht of bij wijzigingen in voor Wamelink Webdesign van toepassing zijnde wet- en regelgeving.</p>
              </Article>

              <Article title="Artikel 9. Duur en beëindiging">
                <p>Contracten met betrekking tot domeinnaamregistratie en hosting kennen een opzegtermijn van 3 maanden. Deze contracten worden elk jaar stilzwijgend verlengd.</p>
                <p>Onderhoudscontracten kennen een minimale looptijd van 1 jaar en worden ieder jaar stilzwijgend verlengd met 1 jaar. Na het verstrijken van de minimale looptijd kan de overeenkomst op elk moment schriftelijk worden opgezegd, met inachtneming van een opzegtermijn van 3 maanden.</p>
                <p>Wamelink Webdesign kan een overeenkomst met de opdrachtgever direct beëindigen wanneer de opdrachtgever zich niet, onbehoorlijk of onvolledig houdt aan de met Wamelink Webdesign gesloten overeenkomst(en) inclusief de bijbehorende voorwaarden.</p>
                <p>Wamelink Webdesign heeft het recht geleverde producten en diensten tijdelijk of geheel buiten gebruik te stellen en/of het gebruik ervan te beperken indien opdrachtgever de overeenkomst en verplichting jegens Wamelink Webdesign niet nakomt of in strijd handelt met deze algemene voorwaarden. Wamelink Webdesign zal opdrachtgever hiervan tevoren in kennis stellen, tenzij zulks in alle redelijkheid en billijkheid niet van Wamelink Webdesign kan worden verlangd. De verplichting tot betaling van de verschuldigde bedragen blijft ook tijdens de buitengebruikstelling bestaan.</p>
              </Article>

              <Article title="Artikel 10. Levering en levertijd">
                <p>De in de getekende overeenkomst genoemde opleverdatum zal worden aangehouden met eventuele aanpassing van die datum bij overeengekomen meerwerk en/of het te laat aanleveren van data door de opdrachtgever.</p>
                <p>Overschrijding van de levertijd geldt nimmer als wanprestatie en laat de verplichting aan cliënt om de website af te nemen onverlet. In geen geval is opdrachtgever gerechtigd de overeenkomst te annuleren, de ontvangst van de website of de betaling daarvan te weigeren, of op schadevergoeding aanspraak te maken.</p>
              </Article>

              <Article title="Artikel 11. Copyright">
                <p>Alle aan Wamelink Webdesign verstrekte digitale of andere media worden aan opdrachtgever teruggegeven als deze dat wenst.</p>
                <p>Alle door Wamelink Webdesign ontwikkelde websites en promotiematerialen kunnen door Wamelink Webdesign voor eigen promotiedoeleinden worden gebruikt, tenzij schriftelijk anders is overeengekomen met de opdrachtgever.</p>
                <p>Mocht er gebruikt zijn gemaakt van Open Source Oplossingen kan hier nimmer copyright op de geleverde source code kunnen rusten. Zie ook artikel Eigendomsvoorbehoud.</p>
              </Article>

              <Article title="Artikel 12. Aansprakelijkheid en vrijwaring">
                <p>Wamelink Webdesign en personen werkzaam in de opdracht ter uitvoering van de overeenkomst, ons personeel daaronder begrepen, kunnen op geen enkele wijze door de opdrachtgever aansprakelijk worden gesteld voor de schade van welke aard dan ook, bedrijfsschade en andere gevolgschade door wie dan ook geleden, voortvloeiende uit, of in verband staande met door ons geleverde of ter beschikking gestelde producten of diensten, tenzij een dergelijke schade te wijten is aan opzet of grove schuld.</p>
                <p>De aansprakelijkheid van Wamelink Webdesign zal te allen tijden beperkt blijven tot het aan opdrachtgever in rekening gebrachte of nog in rekening te brengen.</p>
              </Article>

              <Article title="Artikel 13. Overmacht">
                <p>In geval van overmacht is Wamelink Webdesign gerechtigd de overeenkomst als ontbonden te beschouwen, zulks zonder rechterlijke tussenkomst en zonder dat zij deswege tot schadeloosstelling verplicht zullen zijn.</p>
                <p>Onder overmacht om aan onze verplichtingen te voldoen geldt elke vreemde oorzaak, welke niet aan ons kan worden toegerekend en die de nakoming van de overeenkomst belet, of in zo ernstige mate belemmert of bezwaarlijk maakt, dat die nakoming in redelijkheid niet van ons kan worden gevergd.</p>
                <p>Wamelink Webdesign is niet aansprakelijk voor de gevolgen van gebeurtenissen bij een hostingprovider, domeinnaamregistrant of anderen waarop Wamelink Webdesign geen invloed kan uitoefenen.</p>
              </Article>

               <Article title="Artikel 14. Diverse bepalingen">
                <p>Mocht enige bepaling van deze voorwaarden naar het oordeel van de bevoegde rechter niet van toepassing zijn of in strijd met de openbare orde of wet zijn, dan zal slechts de betreffende bepaling als niet geschreven worden beschouwd en zullen partijen deze vervangen door één of meer bepalingen welke zo nauw mogelijk aansluiten bij de strijdige bepaling(en) en zullen overigens deze algemene voorwaarden volledig van kracht blijven.</p>
                <p>Op al onze aanbiedingen en met ons gesloten overeenkomsten is het Nederlands recht van toepassing.</p>
                <p>Wamelink Webdesign kan op ieder gewenst moment zonder voorafgaande kennisgeving en opgaaf van redenen de algemene voorwaarden wijzigen en aanvullen. Wijzigingen gelden ook ten aanzien van reeds gesloten overeenkomsten met inachtneming van een termijn van 30 dagen na bekendmaking van de wijzigingen. Indien de opdrachtgever een wijziging in deze voorwaarden niet wil accepteren, kan hij de overeenkomst ontbinden. Dit ontslaat de opdrachtgever echter niet van zijn verplichtingen tot betalen voor de reeds geleverde diensten.</p>
                <p>Wamelink Webdesign heeft het recht om geleverde producten en diensten tijdelijk buiten gebruik te stellen indien onderhoudswerkzaamheden noodzakelijk zijn.</p>
              </Article>

              <Article title="Artikel 15. Derden">
                <p>Wamelink Webdesign is niet aansprakelijk voor prijswijzigingen die door de hostingproviders of derden worden doorgevoerd. Deze prijzen worden zonder kennisgeving door Wamelink Webdesign doorgevoerd.</p>
                <p>Wamelink Webdesign is niet aansprakelijk voor de gevolgen van het registreren (met persoonsgegevens) van domeinnaam en hosting bij een hostingprovider en/of domeinnaamregistrant.</p>
              </Article>

              <Article title="Artikel 16. Eigendomsvoorbehoud">
                <p>De opdrachtgever is verplicht de benodigde gegevens met betrekking tot de website, domeinnaam en hosting door te geven aan Wamelink Webdesign. Opdrachtgever is en blijft eigenaar van alle wachtwoorden en andere verkregen documenten die betrekking hebben op de website, domeinnaam en hosting. Deze gegevens worden niet aan derden verstrekt zonder uitdrukkelijk tevoren gevraagde en gegeven toestemming van de opdrachtgever.</p>
                <p>De door Wamelink Webdesign vervaardigde website is en blijft na betaling van de overeengekomen verschuldigde vergoeding eigendom van de opdrachtgever.</p>
                <p>Door Wamelink Webdesign of anderen ontwikkelde scripts en programma’s gebruikt in en/of bij het tot stand komen van de website blijven eigendom van Wamelink Webdesign.</p>
              </Article>

              <Article title="Artikel 17. Privacybepalingen">
                <p>Uw persoonsgegevens worden door Wamelink Webdesign slechts gebruikt om uw aanmelding bij het aanvragen van een domeinnaam en/of hosting aan te vragen. Daarnaast voor de administratie van Wamelink Webdesign. De gegevens zullen niet aan derden ter beschikking worden gesteld, tenzij met uw uitdrukkelijk tevoren gevraagde en gegeven toestemming.</p>
                <p>Uw persoonlijke informatie, aangeleverde documenten, beeld- en geluidsmateriaal blijven vertrouwelijk. Wamelink Webdesign verstrekt informatie als naam, adres, e-mailadres, telefoonnummer, etc. nooit aan derden zonder uw uitdrukkelijke tevoren gevraagde en gegeven toestemming.</p>
              </Article>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper for consistency
const Article: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-12">
    <h3 className="text-xl font-bold uppercase tracking-wider mb-4 pb-4 border-b border-black">{title}</h3>
    <div className="space-y-4 text-gray-700 leading-relaxed font-medium">
      {children}
    </div>
  </div>
);

export default Terms;
