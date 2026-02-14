export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: BlogSection[];
}

export interface BlogSection {
  type: 'paragraph' | 'heading' | 'list' | 'callout';
  text?: string;
  items?: string[];
  variant?: 'tip' | 'warning' | 'cta';
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'wordpress-vs-maatwerk-website',
    title: 'WordPress vs maatwerk website: wat is beter voor jouw bedrijf?',
    metaTitle: 'WordPress vs maatwerk website | Vergelijking 2026 | Wamelink Webdesign',
    metaDescription: 'WordPress of een maatwerk website? Ontdek de voor- en nadelen van beide opties en leer welke keuze het beste past bij jouw bedrijf en groeiverwachtingen.',
    excerpt: 'Je wilt een nieuwe website, maar welke route kies je? We vergelijken WordPress met een maatwerk website in React/Next.js op snelheid, veiligheid, SEO en schaalbaarheid.',
    date: '13 februari 2026',
    readTime: '6 min',
    category: 'Webdevelopment',
    content: [
      {
        type: 'paragraph',
        text: 'Je wilt een professionele website voor je bedrijf. De eerste vraag die veel ondernemers zich stellen: ga ik voor WordPress of kies ik voor een <a href="/website-laten-maken-amsterdam">maatwerk website</a>? Het is een keuze die je online resultaten voor jaren bepaalt. In dit artikel vergelijken we beide opties eerlijk, zodat jij een weloverwogen beslissing kunt nemen.',
      },
      {
        type: 'heading',
        text: 'Wat is WordPress?',
      },
      {
        type: 'paragraph',
        text: 'WordPress is een open-source Content Management System (CMS) dat oorspronkelijk werd gebouwd als blogplatform. Inmiddels draait meer dan 40% van alle websites wereldwijd op WordPress. Het platform werkt met themes (sjablonen) en plugins (uitbreidingen) waarmee je functionaliteit kunt toevoegen zonder te programmeren.',
      },
      {
        type: 'heading',
        text: 'Wat is een maatwerk website?',
      },
      {
        type: 'paragraph',
        text: 'Een maatwerk website wordt vanaf de grond opgebouwd met moderne technologie zoals React en Next.js. Er worden geen standaard templates of voorgebouwde themes gebruikt. Elk onderdeel, van het design tot de code, wordt specifiek voor jouw bedrijf ontwikkeld.',
      },
      {
        type: 'heading',
        text: 'Snelheid en performance',
      },
      {
        type: 'paragraph',
        text: 'Dit is waar het verschil het grootst is. WordPress websites laden gemiddeld in 2 tot 5 seconden. Dat klinkt misschien acceptabel, maar Google heeft aangetoond dat 53% van de mobiele bezoekers afhaakt als een pagina langer dan 3 seconden laadt.',
      },
      {
        type: 'paragraph',
        text: 'Een maatwerk React/Next.js website laadt doorgaans in minder dan 1 seconde. Dit komt doordat er geen overbodige code wordt geladen, geen zware plugins draaien, en de website gebruik maakt van moderne technieken als server-side rendering en code splitting.',
      },
      {
        type: 'callout',
        text: 'Snelheid is niet alleen belangrijk voor gebruikerservaring. Google gebruikt laadtijd als rankingfactor. Een snellere website scoort hoger in de zoekresultaten.',
        variant: 'tip',
      },
      {
        type: 'heading',
        text: 'Veiligheid',
      },
      {
        type: 'paragraph',
        text: 'WordPress is het meest gehackte CMS ter wereld. Niet omdat het slecht gebouwd is, maar omdat het zo wijdverspreid is dat het een aantrekkelijk doelwit vormt. Plugins van derden zijn vaak de zwakste schakel: een enkele verouderde plugin kan je hele website kwetsbaar maken.',
      },
      {
        type: 'paragraph',
        text: 'Een maatwerk website heeft dit probleem niet. Er draaien geen plugins van externe partijen, geen standaard admin-panelen die hackers kennen, en geen database die via bekende kwetsbaarheden te benaderen is. Je website is alleen gebouwd met wat nodig is.',
      },
      {
        type: 'heading',
        text: 'SEO (vindbaarheid in Google)',
      },
      {
        type: 'paragraph',
        text: 'Beide opties kunnen goed scoren in Google, maar maatwerk heeft structurele voordelen:',
      },
      {
        type: 'list',
        items: [
          'Snellere laadtijden zorgen voor een hogere Core Web Vitals score',
          'Schone HTML-structuur zonder overbodige code van themes en plugins',
          'Volledige controle over meta tags, structured data en URL-structuur',
          'Geen conflicten tussen SEO-plugins die elkaars werking verstoren',
        ],
      },
      {
        type: 'paragraph',
        text: 'Met WordPress kun je via plugins als Yoast SEO ook goede resultaten behalen, maar je bent afhankelijk van hoe goed het theme is gebouwd en hoeveel plugins je website vertragen.',
      },
      {
        type: 'heading',
        text: 'Onderhoud en updates',
      },
      {
        type: 'paragraph',
        text: 'Een WordPress website vereist doorlopend onderhoud. WordPress zelf, je theme en al je plugins moeten regelmatig geupdate worden. Sla je een update over? Dan loop je veiligheidsrisico\'s. Update je alles tegelijk? Dan kan er een conflict ontstaan waardoor je website stuk gaat.',
      },
      {
        type: 'paragraph',
        text: 'Een maatwerk website heeft minimaal onderhoud nodig. Er zijn geen plugins die geupdate moeten worden, geen themes die compatibiliteitsproblemen veroorzaken. De code is stabiel en draait zonder afhankelijkheden van derden.',
      },
      {
        type: 'heading',
        text: 'Design en branding',
      },
      {
        type: 'paragraph',
        text: 'Met WordPress ben je gebonden aan de mogelijkheden van je gekozen theme. Ja, je kunt het aanpassen, maar je werkt altijd binnen de beperkingen van wat het theme toelaat. Het resultaat: veel WordPress websites lijken op elkaar.',
      },
      {
        type: 'paragraph',
        text: 'Bij maatwerk zijn er geen beperkingen. Elk pixel wordt ontworpen voor jouw merk. Het resultaat is een website die er niet alleen professioneel uitziet, maar die ook echt uniek is en vertrouwen wekt bij je bezoekers.',
      },
      {
        type: 'heading',
        text: 'Wanneer is WordPress wel een goede keuze?',
      },
      {
        type: 'paragraph',
        text: 'Laten we eerlijk zijn: WordPress is niet per definitie slecht. Voor een persoonlijke blog, een hobby-project of als je een zeer beperkt budget hebt, kan WordPress een prima startpunt zijn. Het is laagdrempelig en je kunt snel iets online hebben.',
      },
      {
        type: 'heading',
        text: 'Wanneer kies je voor maatwerk?',
      },
      {
        type: 'paragraph',
        text: 'Voor bedrijven die hun website zien als een investering in groei, is maatwerk de logische keuze:',
      },
      {
        type: 'list',
        items: [
          'Je wilt je onderscheiden van de concurrentie met een uniek design',
          'Snelheid en SEO-performance zijn belangrijk voor je bedrijf',
          'Je wilt een website die meegroeit zonder technische beperkingen',
          'Veiligheid en betrouwbaarheid zijn prioriteit',
          'Je wilt geen tijd kwijt zijn aan het continu updaten van plugins',
        ],
      },
      {
        type: 'heading',
        text: 'Conclusie',
      },
      {
        type: 'paragraph',
        text: 'WordPress is een goed startpunt voor wie snel en goedkoop online wil zijn. Maar voor bedrijven die serieus willen groeien, die waarde hechten aan snelheid, veiligheid en een unieke merkervaring, is een <a href="/website-laten-maken-amsterdam">maatwerk website</a> in React/Next.js de slimmere investering. Je betaalt meer aan de voorkant, maar bespaart op de lange termijn op onderhoud, lost potentiele klanten niet door trage laadtijden, en bouwt een digitale basis die jaren meegaat.',
      },
      {
        type: 'callout',
        text: 'Twijfel je welke route het beste past bij jouw situatie? Plan een gratis kennismakingsgesprek en ik denk vrijblijvend met je mee.',
        variant: 'cta',
      },
    ],
  },
  {
    slug: 'wat-kost-een-website-laten-maken',
    title: 'Wat kost een website laten maken in 2026?',
    metaTitle: 'Wat kost een website laten maken? Prijzen 2026 | Wamelink Webdesign',
    metaDescription: 'Wat kost een website laten maken in 2026? Ontdek de prijzen voor een maatwerk website, webshop of redesign. Eerlijke vergelijking van kosten en wat je ervoor terugkrijgt.',
    excerpt: 'Van goedkope templates tot maatwerk. Wat zijn realistische prijzen voor een professionele website in 2026? En waar betaal je eigenlijk voor?',
    date: '13 februari 2026',
    readTime: '7 min',
    category: 'Prijzen',
    content: [
      {
        type: 'paragraph',
        text: '"Wat kost een website laten maken?" is de meest gestelde vraag die ik als webdesigner krijg. Het eerlijke antwoord: dat hangt ervan af. Maar in dit artikel geef ik je een helder overzicht van realistische prijzen in 2026, zodat je weet wat je kunt verwachten.',
      },
      {
        type: 'heading',
        text: 'De drie prijscategorieën',
      },
      {
        type: 'paragraph',
        text: 'In de markt zijn er grofweg drie segmenten als het gaat om website-kosten:',
      },
      {
        type: 'list',
        items: [
          'DIY / Template websites (€0 - €500): Denk aan Wix, Squarespace of een gratis WordPress theme. Geschikt voor hobby\'s, maar beperkt in design, snelheid en SEO.',
          'Freelancer / klein bureau (€2.000 - €8.000): Een professionele website op maat, gebouwd door een specialist. Persoonlijk contact, goede kwaliteit.',
          'Groot bureau (€10.000 - €50.000+): Uitgebreide trajecten met meerdere specialisten, projectmanagers en langere doorlooptijden. De overhead is aanzienlijk.',
        ],
      },
      {
        type: 'heading',
        text: 'Waar betaal je voor?',
      },
      {
        type: 'paragraph',
        text: 'De prijs van een website wordt bepaald door meerdere factoren. Het is niet alleen "een website bouwen". Dit is wat er allemaal bij komt kijken:',
      },
      {
        type: 'list',
        items: [
          'Strategie en planning: Wie is je doelgroep? Wat zijn je doelen? Dit bepaalt de structuur.',
          'UX/UI Design: Het ontwerp van elke pagina, mobiel en desktop. Hoe navigeert een bezoeker?',
          'Development: Het bouwen van de website in code. De technische kwaliteit bepaalt snelheid en SEO.',
          'Content en copywriting: Teksten die niet alleen goed lezen, maar ook scoren in Google.',
          'SEO-optimalisatie: Technische SEO, meta tags, structured data, snelheid.',
          'Testing en lancering: Testen op alle apparaten en browsers voor een vlekkeloze lancering.',
        ],
      },
      {
        type: 'callout',
        text: 'Een goedkope website is vaak de duurste keuze. Als je website niet gevonden wordt in Google of bezoekers afhaken door traag laden, kost dat je dagelijks potentiële klanten.',
        variant: 'tip',
      },
      {
        type: 'heading',
        text: 'Wat kost een maatwerk website bij Wamelink Webdesign?',
      },
      {
        type: 'paragraph',
        text: 'Bij Wamelink Webdesign werk je rechtstreeks samen met een ervaren designer en developer. Geen tussenpartijen, geen overhead van een groot bureau. Daardoor krijg je kwaliteit die vergelijkbaar is met grote bureaus, maar tegen een eerlijkere prijs.',
      },
      {
        type: 'paragraph',
        text: 'Een <a href="/website-laten-maken-amsterdam">maatwerk website</a> start vanaf <strong>€2.500</strong> en omvat: strategisch advies, uniek design, development in React/Next.js, SEO-optimalisatie, responsive design en een snelle lancering. Voor <a href="/webshop-laten-maken-amsterdam">webshops</a> en complexere projecten liggen de prijzen hoger, afhankelijk van de functionaliteiten.',
      },
      {
        type: 'heading',
        text: 'Template vs. maatwerk: de verborgen kosten',
      },
      {
        type: 'paragraph',
        text: 'Een template-website lijkt goedkoop, maar de verborgen kosten lopen snel op:',
      },
      {
        type: 'list',
        items: [
          'Maandelijkse kosten voor premium plugins (€20-100/maand)',
          'Beveiligingsrisico\'s door verouderde plugins (hack-herstel kost €500-2.000)',
          'Tragere laadtijden kosten je posities in Google en dus klanten',
          'Beperkingen in design leiden tot een generieke uitstraling die geen vertrouwen wekt',
          'Doorlopend onderhoud en updates die je zelf moet bijhouden of laten doen',
        ],
      },
      {
        type: 'heading',
        text: 'Investering vs. kosten',
      },
      {
        type: 'paragraph',
        text: 'De beste manier om naar website-kosten te kijken is als een investering. Een website die goed scoort in Google, snel laadt en professioneel overkomt, genereert leads en klanten. Het is niet de vraag "wat kost het?", maar "wat levert het op?"',
      },
      {
        type: 'paragraph',
        text: 'Een ondernemer die via zijn website maandelijks 5 extra klanten binnenhaalt met een gemiddelde orderwaarde van €500, verdient zijn website-investering binnen een paar maanden terug. Dat is het verschil tussen een website als kostenpost en een website als verdienmodel.',
      },
      {
        type: 'heading',
        text: 'Tips om slim te investeren',
      },
      {
        type: 'list',
        items: [
          'Begin met een duidelijk doel. Wat moet je website bereiken? Leads, verkopen, naamsbekendheid?',
          'Investeer in kwaliteit boven kwantiteit. Liever 5 sterke pagina\'s dan 20 matige.',
          'Kies voor een partner, niet alleen een leverancier. Iemand die meedenkt over je groei.',
          'Vraag altijd wat er inbegrepen is. Hosting, SSL, onderhoud, SEO? Vergelijk appels met appels.',
        ],
      },
      {
        type: 'heading',
        text: 'Conclusie',
      },
      {
        type: 'paragraph',
        text: 'Wat een website kost, hangt af van je ambities. Voor een professionele maatwerk website die resultaten oplevert, is €2.500-€8.000 een realistische investering in 2026. Bij Wamelink Webdesign krijg je daar persoonlijke samenwerking, scherpe code en een website die je bedrijf helpt groeien.',
      },
      {
        type: 'callout',
        text: 'Benieuwd wat een website voor jouw bedrijf zou kosten? Plan een gratis kennismakingsgesprek en je ontvangt een offerte op maat.',
        variant: 'cta',
      },
    ],
  },
  {
    slug: 'website-laten-maken-waar-op-letten',
    title: 'Website laten maken: waar moet je op letten?',
    metaTitle: 'Website laten maken: waar op letten? Checklist 2026 | Wamelink Webdesign',
    metaDescription: 'Website laten maken maar geen idee waar je moet beginnen? Deze checklist helpt je de juiste keuzes te maken: van webdesigner kiezen tot techniek en SEO.',
    excerpt: 'Je wilt een website laten maken, maar waar begin je? Van het kiezen van een webdesigner tot technische eisen. Een praktische checklist voor ondernemers.',
    date: '13 februari 2026',
    readTime: '8 min',
    category: 'Tips',
    content: [
      {
        type: 'paragraph',
        text: 'Je hebt besloten om een website te laten maken. Maar waar begin je? De markt is enorm, de keuzes overweldigend en de technische termen verwarrend. In dit artikel neem ik je stap voor stap mee door alles waar je op moet letten, zodat je een weloverwogen keuze maakt.',
      },
      {
        type: 'heading',
        text: '1. Bepaal je doel',
      },
      {
        type: 'paragraph',
        text: 'Voordat je een webdesigner benadert, is het belangrijk om helder te hebben wat je website moet bereiken. Is het een visitekaartje voor je bedrijf? Moet de website leads genereren? Of wil je online verkopen? Je doel bepaalt de opzet, het design en de techniek.',
      },
      {
        type: 'list',
        items: [
          'Informatieve website: Je bedrijf presenteren en contactgegevens delen',
          'Leadgeneratie: Bezoekers omzetten naar aanvragen via formulieren en CTA\'s',
          'E-commerce: Online producten of diensten verkopen met een <a href="/webshop-laten-maken-amsterdam">webshop</a>',
          'Portfolio: Je werk tonen en je expertise uitstralen',
        ],
      },
      {
        type: 'heading',
        text: '2. Kies de juiste webdesigner',
      },
      {
        type: 'paragraph',
        text: 'Niet elke webdesigner is hetzelfde. Er zijn grote verschillen in aanpak, kwaliteit en prijs. Let op deze punten:',
      },
      {
        type: 'list',
        items: [
          'Bekijk het portfolio: Spreekt het design je aan? Zijn de websites snel en mobiel-vriendelijk?',
          'Vraag naar het proces: Hoe verloopt de samenwerking? Hoeveel feedbackrondes zijn er?',
          'Check de techniek: Wordt er gewerkt met templates of wordt alles op maat gebouwd?',
          'Lees reviews: Wat zeggen eerdere klanten over de samenwerking en het resultaat?',
          'Vraag naar nazorg: Wat gebeurt er na de lancering? Is er support en onderhoud?',
        ],
      },
      {
        type: 'callout',
        text: 'Tip: Vraag altijd een live voorbeeld van een eerder project. Geen screenshots, maar een echte URL die je kunt bezoeken. Zo test je zelf de snelheid en gebruiksvriendelijkheid.',
        variant: 'tip',
      },
      {
        type: 'heading',
        text: '3. Mobile-first design',
      },
      {
        type: 'paragraph',
        text: 'Meer dan 60% van alle websitebezoekers komt via een smartphone. Als je website niet perfect werkt op mobiel, verlies je het grootste deel van je potentiele klanten. Zorg dat mobiel-design geen bijzaak is, maar de basis van het ontwerpproces.',
      },
      {
        type: 'heading',
        text: '4. Snelheid is niet optioneel',
      },
      {
        type: 'paragraph',
        text: 'Een website die langer dan 3 seconden laadt, verliest meer dan de helft van zijn bezoekers. Bovendien is snelheid een directe rankingfactor in Google. Vraag je webdesigner naar de verwachte laadtijd en hoe deze wordt geoptimaliseerd.',
      },
      {
        type: 'list',
        items: [
          'Streef naar een laadtijd onder de 2 seconden, liefst onder 1 seconde',
          'Vraag naar geoptimaliseerde afbeeldingen en lazy loading',
          'Moderne technologie (React, Next.js) is sneller dan traditionele CMS-systemen',
          'Test de snelheid van eerdere projecten via Google PageSpeed Insights',
        ],
      },
      {
        type: 'heading',
        text: '5. SEO vanaf dag één',
      },
      {
        type: 'paragraph',
        text: 'Veel ondernemers denken dat <a href="/blog/seo-tips-voor-kleine-bedrijven">SEO</a> iets is dat je "later wel doet". Maar de technische basis van je website bepaalt voor een groot deel hoe goed je kunt scoren in Google. Zorg dat je webdesigner hier vanaf het begin rekening mee houdt:',
      },
      {
        type: 'list',
        items: [
          'Correcte HTML-structuur met heading-hierarchie (H1, H2, H3)',
          'Unieke meta titles en descriptions per pagina',
          'Schone URL-structuur (wamelinkwebdesign.nl/diensten in plaats van wamelinkwebdesign.nl/?p=123)',
          'Gestructureerde data (Schema.org) voor rijke zoekresultaten',
          'XML-sitemap en robots.txt',
          'Snelle laadtijden en goede Core Web Vitals scores',
        ],
      },
      {
        type: 'heading',
        text: '6. Content die converteert',
      },
      {
        type: 'paragraph',
        text: 'Een mooi design zonder goede content is als een etalage zonder producten. Je teksten moeten niet alleen informatief zijn, maar ook aanzetten tot actie. Denk aan duidelijke koppen, korte paragrafen, voordelen-lijsten en sterke call-to-actions.',
      },
      {
        type: 'heading',
        text: '7. Juridische vereisten',
      },
      {
        type: 'paragraph',
        text: 'Vergeet niet dat je website moet voldoen aan de wet. Dit zijn de belangrijkste zaken:',
      },
      {
        type: 'list',
        items: [
          'Privacyverklaring (verplicht onder de AVG/GDPR)',
          'Cookiemelding als je tracking-cookies gebruikt',
          'Algemene voorwaarden bij een webshop',
          'KVK-nummer en bedrijfsgegevens op de website',
        ],
      },
      {
        type: 'heading',
        text: 'Checklist samenvatting',
      },
      {
        type: 'list',
        items: [
          'Duidelijk doel voor je website gedefinieerd',
          'Webdesigner gekozen op basis van portfolio, proces en techniek',
          'Mobile-first aanpak bevestigd',
          'Snelheid en performance als eis gesteld',
          'SEO-optimalisatie inbegrepen vanaf het begin',
          'Content voorbereid of hulp bij copywriting afgesproken',
          'Juridische pagina\'s (privacy, voorwaarden) opgenomen',
        ],
      },
      {
        type: 'callout',
        text: 'Wil je zeker weten dat je website aan alle eisen voldoet? Plan een gratis kennismakingsgesprek en ik loop je wensen en eisen samen met je door.',
        variant: 'cta',
      },
    ],
  },
  {
    slug: 'seo-tips-voor-kleine-bedrijven',
    title: '10 SEO-tips die elk klein bedrijf moet weten',
    metaTitle: '10 SEO-tips voor kleine bedrijven | Hoger in Google 2026 | Wamelink Webdesign',
    metaDescription: 'Wil je hoger scoren in Google met je kleine bedrijf? Deze 10 praktische SEO tips helpen je meer bezoekers en klanten te krijgen via zoekmachines.',
    excerpt: 'SEO hoeft niet ingewikkeld te zijn. Met deze 10 praktische tips verbeter je de vindbaarheid van je bedrijf in Google, zonder technische kennis.',
    date: '13 februari 2026',
    readTime: '9 min',
    category: 'SEO',
    content: [
      {
        type: 'paragraph',
        text: 'Als klein bedrijf concurreer je in Google met grote spelers die duizenden euro\'s per maand aan SEO besteden. Toch kun je met de juiste aanpak verrassend goed scoren, zeker op lokale zoekopdrachten. Heb je al een <a href="/website-laten-maken-amsterdam">professionele website</a>? Dan kun je met deze 10 praktische tips direct aan de slag.',
      },
      {
        type: 'heading',
        text: '1. Claim en optimaliseer je Google-bedrijfsprofiel',
      },
      {
        type: 'paragraph',
        text: 'Dit is de belangrijkste stap voor lokale SEO. Je Google-bedrijfsprofiel (voorheen Google Mijn Bedrijf) verschijnt in de lokale zoekresultaten en op Google Maps. Vul het volledig in: bedrijfsnaam, adres, telefoonnummer, openingstijden, beschrijving, categorie en foto\'s. Vraag klanten actief om reviews, want die hebben een grote invloed op je ranking.',
      },
      {
        type: 'heading',
        text: '2. Focus op lokale zoekwoorden',
      },
      {
        type: 'paragraph',
        text: 'Als bakker in Amsterdam wil je niet concurreren op "bakker" (landelijk), maar op "bakker Amsterdam" of "versgebakken brood Amsterdam-Zuid". Voeg je stad of wijk toe aan je belangrijkste zoekwoorden. Gebruik deze zoekwoorden in je paginatitels, koppen en teksten.',
      },
      {
        type: 'callout',
        text: 'Gebruik Google\'s "People also ask" en de gerelateerde zoekopdrachten onderaan de zoekresultaten om te ontdekken welke vragen je doelgroep stelt. Beantwoord deze vragen op je website.',
        variant: 'tip',
      },
      {
        type: 'heading',
        text: '3. Schrijf pagina\'s voor je belangrijkste diensten',
      },
      {
        type: 'paragraph',
        text: 'Maak voor elke dienst of product een aparte pagina aan. Niet alles op een pagina proppen, maar elke pagina optimaliseren voor een specifiek zoekwoord. Een schilder in Amsterdam maakt bijvoorbeeld aparte pagina\'s voor "binnenschilderwerk Amsterdam", "buitenschilderwerk Amsterdam" en "behangen Amsterdam". Heb je ook een webshop nodig? Overweeg dan een <a href="/webshop-laten-maken-amsterdam">aparte webshop-pagina</a>.',
      },
      {
        type: 'heading',
        text: '4. Zorg voor razendsnelle laadtijden',
      },
      {
        type: 'paragraph',
        text: 'Google heeft bevestigd dat snelheid een rankingfactor is. Een snelle website scoort beter dan een trage. De belangrijkste snelheidsfactoren:',
      },
      {
        type: 'list',
        items: [
          'Optimaliseer afbeeldingen (gebruik WebP-formaat, comprimeer bestanden)',
          'Kies snelle, betrouwbare hosting',
          'Minimaliseer het gebruik van zware plugins en scripts',
          'Gebruik caching en een Content Delivery Network (CDN)',
          'Overweeg moderne technologie als React/Next.js in plaats van WordPress',
        ],
      },
      {
        type: 'heading',
        text: '5. Maak je website mobiel-vriendelijk',
      },
      {
        type: 'paragraph',
        text: 'Google indexeert je website op basis van de mobiele versie (mobile-first indexing). Als je website niet goed werkt op smartphones, daalt je ranking. Test je website op verschillende apparaten en zorg dat tekst leesbaar is, knoppen groot genoeg zijn en niets buiten het scherm valt.',
      },
      {
        type: 'heading',
        text: '6. Gebruik de juiste heading-structuur',
      },
      {
        type: 'paragraph',
        text: 'Google leest je koppen (H1, H2, H3) om te begrijpen waar je pagina over gaat. Gebruik een logische hierarchie: een H1 als hoofdtitel (slechts een per pagina), H2\'s voor secties en H3\'s voor subsecties. Verwerk je zoekwoorden op een natuurlijke manier in deze koppen.',
      },
      {
        type: 'heading',
        text: '7. Schrijf unieke meta titles en descriptions',
      },
      {
        type: 'paragraph',
        text: 'Elke pagina op je website heeft een meta title en meta description nodig. Dit is wat mensen zien in de Google zoekresultaten. Een goede meta title bevat je zoekwoord en is maximaal 60 tekens. De meta description is een korte samenvatting van maximaal 155 tekens die mensen overtuigt om te klikken.',
      },
      {
        type: 'heading',
        text: '8. Bouw interne links',
      },
      {
        type: 'paragraph',
        text: 'Link vanaf je pagina\'s naar andere relevante pagina\'s op je eigen website. Dit helpt Google de structuur van je website te begrijpen en verdeelt de "autoriteit" over je pagina\'s. Gebruik beschrijvende ankerteksten, niet "klik hier" maar "bekijk onze webdesign diensten".',
      },
      {
        type: 'heading',
        text: '9. Voeg gestructureerde data toe',
      },
      {
        type: 'paragraph',
        text: 'Gestructureerde data (Schema.org markup) helpt Google je website beter te begrijpen. Voor lokale bedrijven is <strong>LocalBusiness</strong> schema essentieel. Dit kan leiden tot rijke zoekresultaten met sterren, openingstijden en contactgegevens direct in Google.',
      },
      {
        type: 'list',
        items: [
          'LocalBusiness schema met NAW-gegevens en openingstijden',
          'FAQ schema voor veelgestelde vragen',
          'Review schema voor klantbeoordelingen',
          'Article schema voor blogartikelen',
        ],
      },
      {
        type: 'heading',
        text: '10. Publiceer regelmatig waardevolle content',
      },
      {
        type: 'paragraph',
        text: 'Google waardeert websites die regelmatig nieuwe, relevante content publiceren. Start een blog en schrijf artikelen die je doelgroep helpen. Beantwoord veelgestelde vragen, deel tips en toon je expertise. Dit vergroot niet alleen je vindbaarheid, maar bouwt ook vertrouwen op bij potentiele klanten.',
      },
      {
        type: 'heading',
        text: 'Bonus: meet je resultaten',
      },
      {
        type: 'paragraph',
        text: 'SEO is geen eenmalige actie, maar een doorlopend proces. Gebruik <strong>Google Search Console</strong> (gratis) om te zien op welke zoekwoorden je gevonden wordt en hoe je pagina\'s presteren. Gebruik <strong>Google Analytics</strong> om te begrijpen wat bezoekers op je website doen. Meet, leer en optimaliseer.',
      },
      {
        type: 'callout',
        text: 'Wil je weten hoe jouw website scoort op SEO? Plan een gratis kennismakingsgesprek en ik analyseer je huidige situatie met concrete verbeterpunten.',
        variant: 'cta',
      },
    ],
  },
];
