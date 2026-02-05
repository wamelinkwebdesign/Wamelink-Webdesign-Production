import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Lead, Industry } from '../../types';
import { generateId } from '../../services/storageService';

interface LeadFormProps {
  lead?: Lead | null;
  onSave: (lead: Lead) => void;
  onClose: () => void;
}

const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: 'horeca', label: 'Horeca' },
  { value: 'retail', label: 'Retail' },
  { value: 'zakelijke-dienstverlening', label: 'Zakelijke Dienstverlening' },
  { value: 'bouw', label: 'Bouw & Constructie' },
  { value: 'gezondheid', label: 'Gezondheidszorg' },
  { value: 'technologie', label: 'Technologie' },
  { value: 'onderwijs', label: 'Onderwijs' },
  { value: 'creatief', label: 'Creatieve Sector' },
  { value: 'overig', label: 'Overig' },
];

const DUTCH_CITIES = [
  'Amsterdam', 'Rotterdam', 'Den Haag', 'Utrecht', 'Eindhoven',
  'Groningen', 'Tilburg', 'Almere', 'Breda', 'Nijmegen',
  'Haarlem', 'Arnhem', 'Zaanstad', 'Amersfoort', 'Apeldoorn',
  'Den Bosch', 'Hoofddorp', 'Maastricht', 'Leiden', 'Dordrecht',
  'Zoetermeer', 'Zwolle', 'Deventer', 'Delft', 'Alkmaar',
];

const LeadForm: React.FC<LeadFormProps> = ({ lead, onSave, onClose }) => {
  const [form, setForm] = useState<Omit<Lead, 'id' | 'createdAt' | 'messages'>>({
    companyName: lead?.companyName || '',
    contactPerson: lead?.contactPerson || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    website: lead?.website || '',
    industry: lead?.industry || 'overig',
    city: lead?.city || 'Amsterdam',
    status: lead?.status || 'new',
    notes: lead?.notes || '',
    lastContactedAt: lead?.lastContactedAt || null,
    nextFollowUp: lead?.nextFollowUp || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedLead: Lead = {
      id: lead?.id || generateId(),
      ...form,
      createdAt: lead?.createdAt || new Date().toISOString(),
      messages: lead?.messages || [],
    };
    onSave(savedLead);
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent bg-white text-black";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-black uppercase tracking-tight">
            {lead ? 'Lead Bewerken' : 'Nieuwe Lead'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Bedrijfsnaam *</label>
              <input
                type="text"
                required
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className={inputClass}
                placeholder="Voorbeeld B.V."
              />
            </div>
            <div>
              <label className={labelClass}>Contactpersoon *</label>
              <input
                type="text"
                required
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                className={inputClass}
                placeholder="Jan de Vries"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                placeholder="info@voorbeeld.nl"
              />
            </div>
            <div>
              <label className={labelClass}>Telefoon</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
                placeholder="+31 6 1234 5678"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className={inputClass}
              placeholder="https://www.voorbeeld.nl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Sector</label>
              <select
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value as Industry })}
                className={inputClass}
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind.value} value={ind.value}>{ind.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Stad</label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={inputClass}
              >
                {DUTCH_CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Follow-up datum</label>
            <input
              type="date"
              value={form.nextFollowUp?.split('T')[0] || ''}
              onChange={(e) => setForm({ ...form, nextFollowUp: e.target.value ? new Date(e.target.value).toISOString() : null })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Notities</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={inputClass + " resize-none"}
              rows={3}
              placeholder="Aanvullende informatie over deze lead..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-black text-white py-2.5 px-4 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              {lead ? 'Opslaan' : 'Lead Toevoegen'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              Annuleren
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default LeadForm;
