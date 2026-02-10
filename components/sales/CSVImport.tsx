import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Check, AlertCircle, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { Lead, Industry } from '../../types';
import { generateId } from '../../services/storageService';
import { parseCSVForImport } from '../../services/outreachService';

interface CSVImportProps {
  onImport: (leads: Lead[]) => void;
  onClose: () => void;
}

const INDUSTRY_LABELS: Record<Industry, string> = {
  horeca: 'Horeca',
  retail: 'Retail',
  'zakelijke-dienstverlening': 'Zakelijke Dienstverlening',
  bouw: 'Bouw',
  gezondheid: 'Gezondheid',
  technologie: 'Technologie',
  onderwijs: 'Onderwijs',
  creatief: 'Creatief',
  overig: 'Overig',
};

const CSVImport: React.FC<CSVImportProps> = ({ onImport, onClose }) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'done'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState('');
  const [parsedLeads, setParsedLeads] = useState<any[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());
  const [mappedColumns, setMappedColumns] = useState<Record<string, string>>({});
  const [importStats, setImportStats] = useState({ total: 0, imported: 0, skipped: 0 });
  const [showColumnMapping, setShowColumnMapping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setParsing(true);
    setError('');

    try {
      const text = await file.text();
      const result = await parseCSVForImport(text);

      if (!result.success) {
        setError(result.error || 'Kon CSV niet verwerken');
        setParsing(false);
        return;
      }

      if (!result.leads || result.leads.length === 0) {
        setError('Geen leads gevonden in het CSV bestand');
        setParsing(false);
        return;
      }

      setParsedLeads(result.leads);
      setSelectedLeads(new Set(result.leads.map((_: any, i: number) => i)));
      setMappedColumns(result.mappedColumns || {});
      setImportStats({
        total: result.totalRows || 0,
        imported: result.importedCount || 0,
        skipped: result.skippedCount || 0,
      });
      setStep('preview');
    } catch (err: any) {
      setError(err.message || 'Onverwachte fout');
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.tsv') || file.name.endsWith('.txt'))) {
      processFile(file);
    } else {
      setError('Selecteer een CSV, TSV of TXT bestand');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const toggleLead = (index: number) => {
    const next = new Set(selectedLeads);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelectedLeads(next);
  };

  const toggleAll = () => {
    if (selectedLeads.size === parsedLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(parsedLeads.map((_, i) => i)));
    }
  };

  const handleImport = () => {
    const leadsToImport: Lead[] = parsedLeads
      .filter((_, i) => selectedLeads.has(i))
      .map((parsed) => ({
        id: generateId(),
        companyName: parsed.companyName || 'Onbekend Bedrijf',
        contactPerson: parsed.contactPerson || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        website: parsed.website || '',
        industry: (parsed.industry as Industry) || 'overig',
        city: parsed.city || '',
        status: 'new' as const,
        notes: parsed.notes || '',
        createdAt: new Date().toISOString(),
        lastContactedAt: null,
        nextFollowUp: null,
        messages: [],
      }));

    onImport(leadsToImport);
    setStep('done');
  };

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent bg-white text-black';

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight">CSV Import</h2>
            <p className="text-xs text-gray-500 mt-0.5">Importeer leads vanuit een CSV bestand</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {/* Step 1: Upload */}
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                    dragOver
                      ? 'border-[#FFD700] bg-[#FFD700]/5'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {parsing ? (
                    <div className="flex flex-col items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <FileText size={40} className="text-[#FFD700]" />
                      </motion.div>
                      <p className="font-bold text-sm">CSV verwerken...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Upload size={40} className="text-gray-300" />
                      <div>
                        <p className="font-bold text-sm">Sleep een CSV bestand hierheen</p>
                        <p className="text-xs text-gray-400 mt-1">of klik om te selecteren</p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.tsv,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle size={16} className="text-red-500" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Ondersteunde kolommen
                  </p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                    <span>• Bedrijfsnaam / Company</span>
                    <span>• Contactpersoon / Contact</span>
                    <span>• E-mail / Email</span>
                    <span>• Telefoon / Phone</span>
                    <span>• Website / URL</span>
                    <span>• Branche / Industry</span>
                    <span>• Stad / Plaats / City</span>
                    <span>• Notities / Notes</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">
                    Werkt met Google Maps exports, KvK downloads en handmatige lijsten
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Preview */}
            {step === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Stats */}
                <div className="flex gap-3">
                  <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-black text-blue-600">{parsedLeads.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Gevonden</p>
                  </div>
                  <div className="flex-1 bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-black text-green-600">{selectedLeads.size}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-green-400">Geselecteerd</p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-black text-gray-600">{importStats.skipped}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Overgeslagen</p>
                  </div>
                </div>

                {/* Column Mapping */}
                {Object.keys(mappedColumns).length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <button
                      onClick={() => setShowColumnMapping(!showColumnMapping)}
                      className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-500"
                    >
                      {showColumnMapping ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      Kolom Mapping
                    </button>
                    {showColumnMapping && (
                      <div className="mt-2 space-y-1">
                        {Object.entries(mappedColumns).map(([csv, field]) => (
                          <div key={csv} className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400">{csv}</span>
                            <span className="text-gray-300">→</span>
                            <span className="font-bold text-gray-700">{field}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Lead List */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 flex items-center gap-3 border-b border-gray-200">
                    <input
                      type="checkbox"
                      checked={selectedLeads.size === parsedLeads.length}
                      onChange={toggleAll}
                      className="rounded"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Alles selecteren
                    </span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
                    {parsedLeads.map((lead, i) => (
                      <div
                        key={i}
                        className={`px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                          !selectedLeads.has(i) ? 'opacity-40' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLeads.has(i)}
                          onChange={() => toggleLead(i)}
                          className="rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm truncate">{lead.companyName}</span>
                            {lead.industry && lead.industry !== 'overig' && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                                {INDUSTRY_LABELS[lead.industry as Industry] || lead.industry}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                            {lead.contactPerson && <span>{lead.contactPerson}</span>}
                            {lead.city && <span>{lead.city}</span>}
                            {lead.email && <span>{lead.email}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Import Button */}
                <button
                  onClick={handleImport}
                  disabled={selectedLeads.size === 0}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  <Users size={16} />
                  {selectedLeads.size} leads importeren
                </button>
              </motion.div>
            )}

            {/* Step 3: Done */}
            {step === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <Check size={64} className="mx-auto text-green-500" />
                </motion.div>
                <h3 className="text-xl font-black uppercase tracking-tight mt-4">Import Voltooid!</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedLeads.size} leads zijn toegevoegd aan je lijst
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-black text-white py-2.5 px-6 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                  Sluiten
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CSVImport;
