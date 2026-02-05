import { Lead, OutreachTemplate, Campaign } from '../types';

const KEYS = {
  leads: 'wamelink_sales_leads',
  templates: 'wamelink_outreach_templates',
  campaigns: 'wamelink_campaigns',
};

function load<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Leads
export const getLeads = (): Lead[] => load<Lead>(KEYS.leads, []);
export const saveLead = (lead: Lead): void => {
  const leads = getLeads();
  const idx = leads.findIndex((l) => l.id === lead.id);
  if (idx >= 0) leads[idx] = lead;
  else leads.push(lead);
  save(KEYS.leads, leads);
};
export const deleteLead = (id: string): void => {
  save(KEYS.leads, getLeads().filter((l) => l.id !== id));
};

// Templates
export const getTemplates = (): OutreachTemplate[] => load<OutreachTemplate>(KEYS.templates, getDefaultTemplates());
export const saveTemplate = (template: OutreachTemplate): void => {
  const templates = getTemplates();
  const idx = templates.findIndex((t) => t.id === template.id);
  if (idx >= 0) templates[idx] = template;
  else templates.push(template);
  save(KEYS.templates, templates);
};
export const deleteTemplate = (id: string): void => {
  save(KEYS.templates, getTemplates().filter((t) => t.id !== id));
};

// Campaigns
export const getCampaigns = (): Campaign[] => load<Campaign>(KEYS.campaigns, []);
export const saveCampaign = (campaign: Campaign): void => {
  const campaigns = getCampaigns();
  const idx = campaigns.findIndex((c) => c.id === campaign.id);
  if (idx >= 0) campaigns[idx] = campaign;
  else campaigns.push(campaign);
  save(KEYS.campaigns, campaigns);
};
export const deleteCampaign = (id: string): void => {
  save(KEYS.campaigns, getCampaigns().filter((c) => c.id !== id));
};

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getDefaultTemplates(): OutreachTemplate[] {
  return [
    {
      id: 'tpl-intro-nl',
      name: 'Kennismaking - Algemeen',
      channel: 'email',
      subject: 'Uw online aanwezigheid naar een hoger niveau — {{companyName}}',
      body: `Beste {{contactPerson}},

Ik ben Dennis van Wamelink Webdesign. We helpen MKB-bedrijven in {{city}} met het bouwen van websites die niet alleen mooi zijn, maar ook daadwerkelijk klanten opleveren.

Ik zag dat {{companyName}} actief is in de {{industry}}-sector en ik denk dat we waardevolle inzichten kunnen delen over hoe uw online aanwezigheid meer resultaat kan opleveren.

Zou u openstaan voor een vrijblijvend gesprek van 15 minuten?

Met vriendelijke groet,
Dennis Wamelink
Wamelink Webdesign
+31 6 510 959 19`,
      industry: 'all',
      language: 'nl',
    },
    {
      id: 'tpl-horeca-nl',
      name: 'Horeca - Specifiek',
      channel: 'email',
      subject: 'Meer reserveringen via uw website — {{companyName}}',
      body: `Beste {{contactPerson}},

Als horecaondernemer weet u: gasten oriënteren zich online voordat ze reserveren. Een snelle, visueel aantrekkelijke website met eenvoudige reserveringsmogelijkheden kan het verschil maken.

Bij Wamelink Webdesign hebben we ervaring met websites voor de horeca die direct meer reserveringen opleveren. Denk aan:
- Online reserveringssysteem
- Menukaart met visuele presentatie
- Google Maps integratie & reviews
- Mobiel-eerst ontwerp (80% van uw gasten zoekt via telefoon)

Mag ik u een voorbeeld sturen van wat we voor vergelijkbare zaken hebben gerealiseerd?

Met vriendelijke groet,
Dennis Wamelink
Wamelink Webdesign`,
      industry: 'horeca',
      language: 'nl',
    },
    {
      id: 'tpl-retail-nl',
      name: 'Retail - Webshop',
      channel: 'email',
      subject: 'Online omzet verhogen voor {{companyName}}',
      body: `Beste {{contactPerson}},

Steeds meer consumenten kopen online. Een professionele webshop is niet meer optioneel — het is essentieel voor groei.

Wamelink Webdesign bouwt webshops die:
- Converteren (geoptimaliseerd afrekenproces)
- Mooi ogen (uw merk waardig)
- Vindbaar zijn (SEO-geoptimaliseerd)
- Snel laden (snelheid = omzet)

Ik deel graag een paar voorbeelden van webshops die we voor andere retailers hebben gebouwd. Heeft u 15 minuten voor een kort kennismakingsgesprek?

Met vriendelijke groet,
Dennis Wamelink
Wamelink Webdesign`,
      industry: 'retail',
      language: 'nl',
    },
    {
      id: 'tpl-followup-nl',
      name: 'Follow-up - Na eerste contact',
      channel: 'email',
      subject: 'Opvolging: website mogelijkheden {{companyName}}',
      body: `Beste {{contactPerson}},

Vorige week heb ik u benaderd over de online mogelijkheden voor {{companyName}}. Ik begrijp dat het druk kan zijn, dus wilde ik kort even opvolgen.

Ik heb ondertussen alvast een kort concept uitgewerkt op basis van uw huidige website. Geen verplichtingen — puur om te laten zien wat er mogelijk is.

Wanneer zou het u schikken om dit samen te bekijken?

Met vriendelijke groet,
Dennis Wamelink
Wamelink Webdesign
+31 6 510 959 19`,
      industry: 'all',
      language: 'nl',
    },
    {
      id: 'tpl-linkedin-nl',
      name: 'LinkedIn - Connectieverzoek',
      channel: 'linkedin',
      subject: '',
      body: `Hoi {{contactPerson}}, ik zag dat je actief bent met {{companyName}} in {{city}}. Als webdesigner help ik MKB-ondernemers met websites die daadwerkelijk klanten opleveren. Leuk om te connecten!`,
      industry: 'all',
      language: 'nl',
    },
    {
      id: 'tpl-bouw-nl',
      name: 'Bouw - Specifiek',
      channel: 'email',
      subject: 'Online zichtbaarheid voor {{companyName}} in de bouwsector',
      body: `Beste {{contactPerson}},

In de bouwsector worden veel opdrachten tegenwoordig online gevonden. Een professionele website die uw projecten goed presenteert en hoog scoort in Google kan het verschil maken.

Wamelink Webdesign heeft ervaring met websites voor bouwbedrijven. We focussen op:
- Projectportfolio met foto's en beschrijvingen
- Lokale SEO (gevonden worden in {{city}} en omgeving)
- Snelle laadtijden en mobiel ontwerp
- Contactformulieren die leads opleveren

Zullen we een keer vrijblijvend sparren over de mogelijkheden?

Met vriendelijke groet,
Dennis Wamelink
Wamelink Webdesign`,
      industry: 'bouw',
      language: 'nl',
    },
  ];
}
