import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Copy, Check, X, Edit2 } from 'lucide-react';
import { OutreachTemplate, Industry, OutreachChannel } from '../../types';
import { generateId } from '../../services/storageService';

interface TemplateManagerProps {
  templates: OutreachTemplate[];
  onSave: (template: OutreachTemplate) => void;
  onDelete: (id: string) => void;
}

const INDUSTRY_LABELS: Record<string, string> = {
  all: 'Alle Sectoren',
  horeca: 'Horeca',
  retail: 'Retail',
  'zakelijke-dienstverlening': 'Zakelijke Dienstverlening',
  bouw: 'Bouw & Constructie',
  gezondheid: 'Gezondheidszorg',
  technologie: 'Technologie',
  onderwijs: 'Onderwijs',
  creatief: 'Creatieve Sector',
  overig: 'Overig',
};

const CHANNEL_LABELS: Record<OutreachChannel, string> = {
  email: 'E-mail',
  linkedin: 'LinkedIn',
  phone: 'Telefoon',
  whatsapp: 'WhatsApp',
};

const TemplateManager: React.FC<TemplateManagerProps> = ({ templates, onSave, onDelete }) => {
  const [editing, setEditing] = useState<OutreachTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterIndustry, setFilterIndustry] = useState<string>('all');

  const filtered = templates.filter(
    (t) => filterIndustry === 'all' || t.industry === filterIndustry || t.industry === 'all'
  );

  const handleCopy = (template: OutreachTemplate) => {
    navigator.clipboard.writeText(template.body);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNew = () => {
    setEditing({
      id: generateId(),
      name: '',
      channel: 'email',
      subject: '',
      body: '',
      industry: 'all',
      language: 'nl',
    });
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent bg-white text-black";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          >
            <option value="all">Alle Sectoren</option>
            {Object.entries(INDUSTRY_LABELS)
              .filter(([k]) => k !== 'all')
              .map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
          </select>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
        >
          <Plus size={14} />
          Nieuw Template
        </button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((template) => (
          <motion.div
            key={template.id}
            layout
            className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-sm">{template.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                    {CHANNEL_LABELS[template.channel]}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#FFD700]/20 rounded text-gray-700">
                    {INDUSTRY_LABELS[template.industry]}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-blue-50 rounded text-blue-600">
                    {template.language.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {template.subject && (
              <p className="text-xs font-semibold text-gray-700 mt-2 mb-1">
                Onderwerp: {template.subject}
              </p>
            )}

            <p className="text-xs text-gray-500 mt-2 line-clamp-3 whitespace-pre-wrap">
              {template.body}
            </p>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => handleCopy(template)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                {copiedId === template.id ? <Check size={12} /> : <Copy size={12} />}
                {copiedId === template.id ? 'Gekopieerd' : 'Kopieer'}
              </button>
              <button
                onClick={() => setEditing(template)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <Edit2 size={12} />
                Bewerk
              </button>
              <button
                onClick={() => onDelete(template.id)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-red-500 hover:bg-red-50 rounded transition-colors ml-auto"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">Geen templates gevonden voor deze sector.</p>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-black uppercase tracking-tight">Template Bewerken</h2>
                <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className={labelClass}>Template Naam</label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className={inputClass}
                    placeholder="bijv. Horeca - Eerste Contact"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Kanaal</label>
                    <select
                      value={editing.channel}
                      onChange={(e) => setEditing({ ...editing, channel: e.target.value as OutreachChannel })}
                      className={inputClass}
                    >
                      {Object.entries(CHANNEL_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Sector</label>
                    <select
                      value={editing.industry}
                      onChange={(e) => setEditing({ ...editing, industry: e.target.value as Industry | 'all' })}
                      className={inputClass}
                    >
                      {Object.entries(INDUSTRY_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Taal</label>
                    <select
                      value={editing.language}
                      onChange={(e) => setEditing({ ...editing, language: e.target.value as 'nl' | 'en' })}
                      className={inputClass}
                    >
                      <option value="nl">Nederlands</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>

                {editing.channel === 'email' && (
                  <div>
                    <label className={labelClass}>Onderwerp</label>
                    <input
                      type="text"
                      value={editing.subject}
                      onChange={(e) => setEditing({ ...editing, subject: e.target.value })}
                      className={inputClass}
                      placeholder="Gebruik {{companyName}}, {{contactPerson}}, {{city}}"
                    />
                  </div>
                )}

                <div>
                  <label className={labelClass}>Bericht</label>
                  <textarea
                    value={editing.body}
                    onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                    className={inputClass + " resize-none font-mono text-xs"}
                    rows={10}
                    placeholder="Gebruik variabelen: {{companyName}}, {{contactPerson}}, {{city}}, {{industry}}"
                  />
                </div>

                <p className="text-[10px] text-gray-400">
                  Variabelen: {'{{companyName}}'}, {'{{contactPerson}}'}, {'{{city}}'}, {'{{industry}}'}
                </p>

                <button
                  onClick={() => {
                    onSave(editing);
                    setEditing(null);
                  }}
                  className="w-full bg-black text-white py-2.5 px-4 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                  Opslaan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateManager;
