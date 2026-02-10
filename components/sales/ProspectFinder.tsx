import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Search, Globe, Zap, AlertTriangle, CheckCircle2, Plus,
  MapPin, Star, ExternalLink, Loader2, ChevronDown, Sparkles,
  TrendingUp, Shield, Smartphone, Clock,
} from 'lucide-react';
import { Lead, Industry } from '../../types';
import { generateId } from '../../services/storageService';

interface ProspectFinderProps {
  onAddLead: (lead: Lead) => void;
  existingLeads: Lead[];
  onClose: () => void;
}

interface Prospect {
  companyName: string;
  address: string;
  city: string;
  phone: string;
  website: string;
  rating: number | null;
  totalRatings: number;
  placeId: string;
  scored: boolean;
  scoring: boolean;
  prospectScore: number | null;
  overallScore: number | null;
  loadTime: number | null;
  mobileScore: number | null;
  hasHttps: boolean | null;
  hasMobileViewport: boolean | null;
  issues: string[];
  opportunities: string[];
}

const DUTCH_CITIES: Record<string, string[]> = {
  'Noord-Holland': ['Amsterdam', 'Haarlem', 'Alkmaar', 'Zaandam', 'Hilversum', 'Amstelveen'],
  'Zuid-Holland': ['Rotterdam', 'Den Haag', 'Leiden', 'Dordrecht', 'Delft', 'Gouda'],
  'Utrecht': ['Utrecht', 'Amersfoort', 'Veenendaal', 'Zeist'],
  'Noord-Brabant': ['Eindhoven', 'Tilburg', 'Breda', 'Den Bosch', 'Helmond'],
  'Gelderland': ['Arnhem', 'Nijmegen', 'Apeldoorn', 'Ede'],
  'Overijssel': ['Zwolle', 'Enschede', 'Deventer', 'Hengelo'],
  'Limburg': ['Maastricht', 'Venlo', 'Heerlen', 'Roermond'],
  'Groningen': ['Groningen'],
  'Friesland': ['Leeuwarden', 'Drachten'],
  'Drenthe': ['Assen', 'Emmen', 'Meppel'],
  'Flevoland': ['Almere', 'Lelystad'],
  'Zeeland': ['Middelburg', 'Vlissingen'],
};

const INDUSTRIES: { value: Industry | 'all'; label: string; searchTerms: string[] }[] = [
  { value: 'horeca', label: 'Horeca', searchTerms: ['restaurant', 'café', 'hotel', 'lunchroom'] },
  { value: 'retail', label: 'Retail / Winkels', searchTerms: ['winkel', 'boekhandel', 'kledingwinkel'] },
  { value: 'zakelijke-dienstverlening', label: 'Zakelijke Dienstverlening', searchTerms: ['accountant', 'advocaat', 'notaris', 'makelaar'] },
  { value: 'bouw', label: 'Bouw & Ambacht', searchTerms: ['aannemer', 'loodgieter', 'elektricien', 'schilder', 'dakdekker'] },
  { value: 'gezondheid', label: 'Gezondheid', searchTerms: ['tandarts', 'fysiotherapeut', 'schoonheidssalon'] },
  { value: 'creatief', label: 'Creatief', searchTerms: ['fotograaf', 'reclamebureau', 'drukkerij'] },
];

const ProspectFinder: React.FC<ProspectFinderProps> = ({ onAddLead, existingLeads, onClose }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | ''>('');
  const [customQuery, setCustomQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [error, setError] = useState('');
  const [scoringAll, setScoringAll] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [expandedProspect, setExpandedProspect] = useState<string | null>(null);

  const city = customCity || selectedCity;

  const handleSearch = async () => {
    if (!city && !customQuery) return;

    setSearching(true);
    setError('');
    setProspects([]);

    try {
      const response = await fetch('/api/find-prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city,
          industry: selectedIndustry || undefined,
          customQuery: customQuery || undefined,
          maxResults: 20,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Zoeken mislukt');
      }

      const newProspects: Prospect[] = data.results.map((r: any) => ({
        ...r,
        scored: false,
        scoring: false,
        prospectScore: null,
        overallScore: null,
        loadTime: null,
        mobileScore: null,
        hasHttps: null,
        hasMobileViewport: null,
        issues: [],
        opportunities: [],
      }));

      setProspects(newProspects);

      const withWebsites = newProspects.filter((p) => p.website);
      if (withWebsites.length > 0) {
        scoreProspects(newProspects);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const scoreProspects = async (prospectList: Prospect[]) => {
    setScoringAll(true);

    const withWebsites = prospectList.filter((p) => p.website);
    for (let i = 0; i < withWebsites.length; i += 5) {
      const batch = withWebsites.slice(i, i + 5);
      const urls = batch.map((p) => p.website);

      setProspects((prev) =>
        prev.map((p) =>
          urls.includes(p.website) ? { ...p, scoring: true } : p
        )
      );

      try {
        const response = await fetch('/api/score-websites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls }),
        });

        const data = await response.json();

        if (data.success && data.scores) {
          setProspects((prev) =>
            prev.map((p) => {
              const score = data.scores.find((s: any) =>
                s.url === p.website || s.url === 'https://' + p.website
              );
              if (score) {
                return {
                  ...p,
                  scored: true,
                  scoring: false,
                  prospectScore: score.prospectScore,
                  overallScore: score.overallScore,
                  loadTime: score.loadTime,
                  mobileScore: score.mobileScore,
                  hasHttps: score.hasHttps,
                  hasMobileViewport: score.hasMobileViewport,
                  issues: score.issues,
                  opportunities: score.opportunities,
                };
              }
              return { ...p, scoring: false };
            })
          );
        }
      } catch (err) {
        setProspects((prev) =>
          prev.map((p) =>
            urls.includes(p.website) ? { ...p, scoring: false, scored: true } : p
          )
        );
      }
    }

    setProspects((prev) =>
      prev.map((p) =>
        !p.website
          ? {
              ...p,
              scored: true,
              prospectScore: 95,
              issues: ['Geen website gevonden'],
              opportunities: ['Volledig nieuwe website bouwen'],
            }
          : p
      )
    );

    setScoringAll(false);
  };

  const handleAddAsLead = (prospect: Prospect) => {
    const industry = selectedIndustry || 'overig';
    const alreadyExists = existingLeads.some(
      (l) => l.companyName.toLowerCase() === prospect.companyName.toLowerCase()
    );

    if (alreadyExists) return;

    const lead: Lead = {
      id: generateId(),
      companyName: prospect.companyName,
      contactPerson: '',
      email: '',
      phone: prospect.phone,
      website: prospect.website,
      industry: industry as Industry,
      city: prospect.city || city,
      status: 'new',
      notes: [
        prospect.prospectScore ? `Prospect score: ${prospect.prospectScore}/100` : '',
        prospect.issues.length > 0 ? `Issues: ${prospect.issues.join(', ')}` : '',
        prospect.opportunities.length > 0 ? `Kansen: ${prospect.opportunities.join(', ')}` : '',
        prospect.rating ? `Google rating: ${prospect.rating}/5 (${prospect.totalRatings} reviews)` : '',
      ]
        .filter(Boolean)
        .join('\n'),
      createdAt: new Date().toISOString(),
      lastContactedAt: null,
      nextFollowUp: null,
      messages: [],
    };

    onAddLead(lead);
    setAddedIds((prev) => new Set(prev).add(prospect.placeId));
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-400';
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getProspectBadge = (score: number | null) => {
    if (score === null) return { label: '...', color: 'bg-gray-100 text-gray-400' };
    if (score >= 80) return { label: '🔥 Top Prospect', color: 'bg-red-100 text-red-700' };
    if (score >= 60) return { label: '⚡ Goed Prospect', color: 'bg-yellow-100 text-yellow-700' };
    if (score >= 40) return { label: 'Redelijk', color: 'bg-blue-100 text-blue-700' };
    return { label: 'Website OK', color: 'bg-green-100 text-green-700' };
  };

  const sortedProspects = [...prospects].sort((a, b) => {
    if (a.prospectScore === null && b.prospectScore === null) return 0;
    if (a.prospectScore === null) return 1;
    if (b.prospectScore === null) return -1;
    return b.prospectScore - a.prospectScore;
  });

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent bg-white text-black cursor-auto';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      style={{ cursor: 'auto' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        style={{ cursor: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Search size={20} />
              Prospect Finder
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Vind MKB-bedrijven met slechte websites in heel Nederland
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-auto">
            <X size={20} />
          </button>
        </div>

        {/* Search Controls - fixed, not scrollable */}
        <div className="p-6 border-b border-gray-100 space-y-3 shrink-0">
          <div className="flex gap-3">
            {/* City Selection */}
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Stad
              </label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setCustomCity('');
                  }}
                  className={inputClass + ' pl-9'}
                >
                  <option value="">Kies een stad...</option>
                  {Object.entries(DUTCH_CITIES).map(([province, cities]) => (
                    <optgroup key={province} label={province}>
                      {cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={customCity}
                onChange={(e) => {
                  setCustomCity(e.target.value);
                  setSelectedCity('');
                }}
                className={inputClass + ' mt-1.5'}
                placeholder="Of typ een andere stad..."
              />
            </div>

            {/* Industry Selection */}
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Branche
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value as Industry | '')}
                className={inputClass}
              >
                <option value="">Alle branches</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                className={inputClass + ' mt-1.5'}
                placeholder="Of vrije zoekopdracht (bijv. 'tandarts Breda')..."
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={searching || (!city && !customQuery)}
            className="w-full bg-[#FFD700] text-black py-2.5 px-4 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-[#FFCF00] transition-colors flex items-center justify-center gap-2 border border-black disabled:opacity-40 cursor-auto"
          >
            {searching ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Zoeken & Analyseren...
              </>
            ) : (
              <>
                <Search size={16} />
                Zoek Prospects
              </>
            )}
          </button>
        </div>

        {/* Results - THIS is the scrollable area */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6" style={{ minHeight: 0 }}>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <AlertTriangle size={16} className="text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {scoringAll && (
            <div className="flex items-center gap-2 p-3 bg-[#FFD700]/10 border border-[#FFD700] rounded-lg mb-4">
              <Loader2 size={16} className="text-[#FFD700] animate-spin" />
              <span className="text-sm font-medium">Websites worden geanalyseerd op kwaliteit...</span>
            </div>
          )}

          {sortedProspects.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {sortedProspects.length} bedrijven gevonden
                  {sortedProspects.filter((p) => p.prospectScore && p.prospectScore >= 60).length > 0 &&
                    ` — ${sortedProspects.filter((p) => p.prospectScore && p.prospectScore >= 60).length} goede prospects`}
                </p>
              </div>

              {sortedProspects.map((prospect) => {
                const badge = getProspectBadge(prospect.prospectScore);
                const isExpanded = expandedProspect === prospect.placeId;
                const alreadyAdded =
                  addedIds.has(prospect.placeId) ||
                  existingLeads.some(
                    (l) => l.companyName.toLowerCase() === prospect.companyName.toLowerCase()
                  );

                return (
                  <motion.div
                    key={prospect.placeId}
                    layout
                    className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors"
                  >
                    <div
                      className="p-4 cursor-auto"
                      onClick={() => setExpandedProspect(isExpanded ? null : prospect.placeId)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm">{prospect.companyName}</h3>
                            {prospect.scored && (
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.color}`}>
                                {badge.label}
                              </span>
                            )}
                            {prospect.scoring && (
                              <Loader2 size={12} className="animate-spin text-gray-400" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{prospect.address}</p>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            {prospect.rating && (
                              <span className="flex items-center gap-0.5 text-xs text-gray-500">
                                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                {prospect.rating} ({prospect.totalRatings})
                              </span>
                            )}
                            {prospect.website && (
                              <a
                                href={prospect.website.startsWith('http') ? prospect.website : `https://${prospect.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-0.5 text-xs text-blue-500 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Globe size={10} />
                                Website
                                <ExternalLink size={8} />
                              </a>
                            )}
                            {!prospect.website && (
                              <span className="flex items-center gap-0.5 text-xs text-red-500">
                                <AlertTriangle size={10} />
                                Geen website
                              </span>
                            )}
                            {prospect.scored && prospect.loadTime && (
                              <span className="flex items-center gap-0.5 text-xs text-gray-500">
                                <Clock size={10} />
                                {prospect.loadTime}s
                              </span>
                            )}
                            {prospect.scored && prospect.mobileScore !== null && (
                              <span className={`flex items-center gap-0.5 text-xs ${getScoreColor(prospect.mobileScore)}`}>
                                <Smartphone size={10} />
                                {prospect.mobileScore}/100
                              </span>
                            )}
                            {prospect.scored && prospect.hasHttps === false && (
                              <span className="flex items-center gap-0.5 text-xs text-red-500">
                                <Shield size={10} />
                                Geen HTTPS
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-3 shrink-0">
                          {prospect.scored && prospect.prospectScore !== null && (
                            <div className="text-center">
                              <div className={`text-lg font-black ${getScoreColor(100 - prospect.prospectScore)}`}>
                                {prospect.prospectScore}
                              </div>
                              <div className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                                Score
                              </div>
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddAsLead(prospect);
                            }}
                            disabled={alreadyAdded}
                            className={`p-2 rounded-lg transition-all cursor-auto ${
                              alreadyAdded
                                ? 'bg-green-100 text-green-600'
                                : 'bg-black text-white hover:bg-gray-800'
                            }`}
                          >
                            {alreadyAdded ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && prospect.scored && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-100"
                        >
                          <div className="p-4 space-y-3 bg-gray-50">
                            {prospect.issues.length > 0 && (
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-1">
                                  Problemen gevonden
                                </p>
                                <div className="space-y-1">
                                  {prospect.issues.map((issue, i) => (
                                    <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                                      <AlertTriangle size={10} className="text-red-400 mt-0.5 shrink-0" />
                                      {issue}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {prospect.opportunities.length > 0 && (
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-1">
                                  Kansen voor Wamelink
                                </p>
                                <div className="space-y-1">
                                  {prospect.opportunities.map((opp, i) => (
                                    <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                                      <TrendingUp size={10} className="text-green-500 mt-0.5 shrink-0" />
                                      {opp}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!searching && sortedProspects.length === 0 && !error && (
            <div className="text-center py-16">
              <Search size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-sm font-bold text-gray-400">Kies een stad en branche om te starten</p>
              <p className="text-xs text-gray-300 mt-1">
                De Prospect Finder zoekt bedrijven op Google Maps en analyseert hun website kwaliteit
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProspectFinder;
