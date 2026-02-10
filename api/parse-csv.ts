import type { VercelRequest, VercelResponse } from '@vercel/node';

// Phase 3: Parse uploaded CSV data for bulk lead import
// Accepts CSV text in the request body and returns structured lead data
// Supports common Dutch business export formats (KvK, Google Maps, custom)

interface ParsedLead {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  city: string;
  notes: string;
}

// Common CSV column header mappings (Dutch + English)
const COLUMN_MAPPINGS: Record<string, keyof ParsedLead> = {
  // Company name
  bedrijfsnaam: 'companyName',
  'bedrijfs naam': 'companyName',
  naam: 'companyName',
  company: 'companyName',
  'company name': 'companyName',
  bedrijf: 'companyName',
  organisatie: 'companyName',
  name: 'companyName',
  title: 'companyName',

  // Contact person
  contactpersoon: 'contactPerson',
  contact: 'contactPerson',
  'contact name': 'contactPerson',
  'contact person': 'contactPerson',
  persoon: 'contactPerson',
  eigenaar: 'contactPerson',
  owner: 'contactPerson',

  // Email
  email: 'email',
  'e-mail': 'email',
  emailadres: 'email',
  'email address': 'email',
  mail: 'email',

  // Phone
  telefoon: 'phone',
  telefoonnummer: 'phone',
  phone: 'phone',
  'phone number': 'phone',
  tel: 'phone',
  mobiel: 'phone',

  // Website
  website: 'website',
  url: 'website',
  site: 'website',
  'web address': 'website',

  // Industry
  branche: 'industry',
  sector: 'industry',
  industry: 'industry',
  categorie: 'industry',
  category: 'industry',
  type: 'industry',

  // City
  stad: 'city',
  plaats: 'city',
  city: 'city',
  woonplaats: 'city',
  vestigingsplaats: 'city',
  location: 'city',
  locatie: 'city',

  // Notes
  notities: 'notes',
  opmerkingen: 'notes',
  notes: 'notes',
  description: 'notes',
  omschrijving: 'notes',
  beschrijving: 'notes',
};

// Map Dutch industry terms to our industry slugs
const INDUSTRY_MAPPING: Record<string, string> = {
  horeca: 'horeca',
  restaurant: 'horeca',
  cafe: 'horeca',
  hotel: 'horeca',
  catering: 'horeca',
  retail: 'retail',
  winkel: 'retail',
  webshop: 'retail',
  'e-commerce': 'retail',
  bouw: 'bouw',
  aannemer: 'bouw',
  constructie: 'bouw',
  installatie: 'bouw',
  gezondheid: 'gezondheid',
  zorg: 'gezondheid',
  fysiotherapie: 'gezondheid',
  tandarts: 'gezondheid',
  huisarts: 'gezondheid',
  apotheek: 'gezondheid',
  technologie: 'technologie',
  ict: 'technologie',
  software: 'technologie',
  it: 'technologie',
  tech: 'technologie',
  onderwijs: 'onderwijs',
  school: 'onderwijs',
  training: 'onderwijs',
  creatief: 'creatief',
  design: 'creatief',
  fotografie: 'creatief',
  marketing: 'creatief',
  reclame: 'creatief',
  zakelijk: 'zakelijke-dienstverlening',
  'zakelijke dienstverlening': 'zakelijke-dienstverlening',
  advies: 'zakelijke-dienstverlening',
  consulting: 'zakelijke-dienstverlening',
  accountant: 'zakelijke-dienstverlening',
  juridisch: 'zakelijke-dienstverlening',
  advocaat: 'zakelijke-dienstverlening',
  makelaardij: 'zakelijke-dienstverlening',
  makelaar: 'zakelijke-dienstverlening',
  verzekering: 'zakelijke-dienstverlening',
};

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((char === ',' || char === ';') && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function mapIndustry(raw: string): string {
  const lower = raw.toLowerCase().trim();
  for (const [keyword, slug] of Object.entries(INDUSTRY_MAPPING)) {
    if (lower.includes(keyword)) return slug;
  }
  return 'overig';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { csvText } = req.body;
  if (!csvText || typeof csvText !== 'string') {
    return res.status(400).json({ error: 'csvText is required' });
  }

  try {
    const lines = csvText
      .split(/\r?\n/)
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 0);

    if (lines.length < 2) {
      return res.status(400).json({ error: 'CSV must have a header row and at least one data row' });
    }

    // Parse header
    const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/['"]/g, ''));

    // Map headers to our fields
    const columnMap: Record<number, keyof ParsedLead> = {};
    headers.forEach((header, index) => {
      const mapped = COLUMN_MAPPINGS[header];
      if (mapped) columnMap[index] = mapped;
    });

    if (!columnMap || Object.keys(columnMap).length === 0) {
      return res.status(400).json({
        error: 'No recognized columns found',
        recognizedColumns: Object.keys(COLUMN_MAPPINGS),
        foundColumns: headers,
      });
    }

    // Parse data rows
    const leads: ParsedLead[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        const lead: ParsedLead = {
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          website: '',
          industry: 'overig',
          city: '',
          notes: '',
        };

        for (const [indexStr, field] of Object.entries(columnMap)) {
          const idx = parseInt(indexStr);
          if (values[idx]) {
            lead[field] = values[idx];
          }
        }

        // Map industry string to slug
        if (lead.industry && lead.industry !== 'overig') {
          lead.industry = mapIndustry(lead.industry);
        }

        // Skip rows without a company name
        if (lead.companyName) {
          leads.push(lead);
        }
      } catch (err) {
        errors.push(`Row ${i + 1}: parse error`);
      }
    }

    return res.status(200).json({
      success: true,
      leads,
      totalRows: lines.length - 1,
      importedCount: leads.length,
      skippedCount: lines.length - 1 - leads.length,
      errors: errors.length > 0 ? errors : undefined,
      mappedColumns: Object.fromEntries(
        Object.entries(columnMap).map(([idx, field]) => [headers[parseInt(idx)], field])
      ),
    });
  } catch (error) {
    console.error('CSV parsing failed:', error);
    return res.status(500).json({ error: 'Failed to parse CSV' });
  }
}
