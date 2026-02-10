import type { VercelRequest, VercelResponse } from '@vercel/node';

// Phase 5: Find prospects via Google Places API (Text Search)
// Environment variable needed: GOOGLE_PLACES_API_KEY
// Enable "Places API (New)" in Google Cloud Console

interface PlaceResult {
  companyName: string;
  address: string;
  city: string;
  phone: string;
  website: string;
  rating: number | null;
  totalRatings: number;
  types: string[];
  placeId: string;
}

// Dutch cities organized by province for nationwide coverage
const DUTCH_CITIES: Record<string, string[]> = {
  'Noord-Holland': ['Amsterdam', 'Haarlem', 'Alkmaar', 'Zaandam', 'Hilversum', 'Amstelveen', 'Purmerend', 'Hoorn'],
  'Zuid-Holland': ['Rotterdam', 'Den Haag', 'Leiden', 'Dordrecht', 'Delft', 'Zoetermeer', 'Gouda', 'Schiedam'],
  'Utrecht': ['Utrecht', 'Amersfoort', 'Veenendaal', 'Zeist', 'Nieuwegein', 'Woerden'],
  'Noord-Brabant': ['Eindhoven', 'Tilburg', 'Breda', 'Den Bosch', 'Helmond', 'Oss', 'Roosendaal'],
  'Gelderland': ['Arnhem', 'Nijmegen', 'Apeldoorn', 'Ede', 'Doetinchem', 'Harderwijk', 'Zutphen'],
  'Overijssel': ['Zwolle', 'Enschede', 'Deventer', 'Hengelo', 'Almelo', 'Kampen'],
  'Limburg': ['Maastricht', 'Venlo', 'Heerlen', 'Sittard', 'Roermond', 'Weert'],
  'Groningen': ['Groningen', 'Veendam', 'Stadskanaal'],
  'Friesland': ['Leeuwarden', 'Drachten', 'Heerenveen', 'Sneek'],
  'Drenthe': ['Assen', 'Emmen', 'Hoogeveen', 'Meppel'],
  'Flevoland': ['Almere', 'Lelystad'],
  'Zeeland': ['Middelburg', 'Vlissingen', 'Goes', 'Terneuzen'],
};

// Map our industry slugs to Google Places search terms (in Dutch)
const INDUSTRY_SEARCH_TERMS: Record<string, string[]> = {
  horeca: ['restaurant', 'café', 'hotel', 'eetcafé', 'bistro', 'pizzeria', 'lunchroom'],
  retail: ['winkel', 'boekhandel', 'kledingwinkel', 'schoenwinkel', 'juwelier', 'bloemenwinkel', 'cadeauwinkel'],
  'zakelijke-dienstverlening': ['accountant', 'advocaat', 'notaris', 'belastingadviseur', 'makelaar', 'verzekeringsadviseur', 'financieel adviseur'],
  bouw: ['aannemer', 'loodgieter', 'elektricien', 'schilder', 'dakdekker', 'timmerman', 'installateur', 'klusbedrijf'],
  gezondheid: ['tandarts', 'fysiotherapeut', 'huisarts', 'apotheek', 'psycholoog', 'diëtist', 'schoonheidssalon'],
  technologie: ['IT bedrijf', 'software bedrijf', 'webshop', 'computerhulp'],
  onderwijs: ['rijschool', 'bijles', 'muziekschool', 'dansschool', 'sportschool'],
  creatief: ['fotograaf', 'grafisch ontwerper', 'reclamebureau', 'drukkerij', 'videoproductie'],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: 'GOOGLE_PLACES_API_KEY not configured' });
  }

  const { city, industry, customQuery, maxResults = 20 } = req.body;

  if (!city && !customQuery) {
    return res.status(400).json({ error: 'city or customQuery required' });
  }

  // Build search query
  let query: string;
  if (customQuery) {
    query = customQuery;
  } else {
    const searchTerms = INDUSTRY_SEARCH_TERMS[industry];
    // Pick a random search term for variety, or use the first one
    const term = searchTerms ? searchTerms[0] : industry;
    query = `${term} in ${city}`;
  }

  try {
    // Use Google Places Text Search (New API)
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.types,places.id,places.primaryType',
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: 'nl',
        regionCode: 'NL',
        maxResultCount: Math.min(maxResults, 20),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Places API error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Places search failed' });
    }

    const places: PlaceResult[] = (data.places || []).map((place: any) => {
      // Extract city from formatted address
      const addressParts = (place.formattedAddress || '').split(',');
      const cityMatch = addressParts.length >= 2
        ? addressParts[addressParts.length - 2]?.trim().replace(/^\d{4}\s?\w{2}\s*/, '')
        : city;

      return {
        companyName: place.displayName?.text || 'Onbekend',
        address: place.formattedAddress || '',
        city: cityMatch || city,
        phone: place.nationalPhoneNumber || '',
        website: place.websiteUri || '',
        rating: place.rating || null,
        totalRatings: place.userRatingCount || 0,
        types: place.types || [],
        placeId: place.id || '',
      };
    });

    return res.status(200).json({
      success: true,
      query,
      results: places,
      count: places.length,
    });
  } catch (error: any) {
    console.error('Prospect search failed:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Export city/industry data for frontend
export { DUTCH_CITIES, INDUSTRY_SEARCH_TERMS };
