import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, Users, LayoutGrid, FileText, Search,
  Mail, Phone, Linkedin, MessageCircle, Calendar,
  ChevronDown, Trash2, ExternalLink, Sparkles, Filter,
} from 'lucide-react';
import { Lead, LeadStatus, OutreachMessage, OutreachTemplate } from '../../types';
import {
  getLeads, saveLead, deleteLead as deleteLeadFromStorage,
  getTemplates, saveTemplate, deleteTemplate,
} from '../../services/storageService';
import LeadForm from './LeadForm';
import OutreachComposer from './OutreachComposer';
import PipelineView from './PipelineView';
import TemplateManager from './TemplateManager';

interface SalesOutreachProps {
  onClose: () => void;
}

type Tab = 'leads' | 'pipeline' | 'templates';

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: 'Nieuw', color: '#3B82F6' },
  contacted: { label: 'Benaderd', color: '#F59E0B' },
  replied: { label: 'Reactie', color: '#8B5CF6' },
  meeting: { label: 'Gesprek', color: '#EC4899' },
  proposal: { label: 'Offerte', color: '#F97316' },
  won: { label: 'Gewonnen', color: '#10B981' },
  lost: { label: 'Verloren', color: '#6B7280' },
};

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  email: <Mail size={12} />,
  linkedin: <Linkedin size={12} />,
  phone: <Phone size={12} />,
  whatsapp: <MessageCircle size={12} />,
};

const SalesOutreach: React.FC<SalesOutreachProps> = ({ onClose }) => {
  const [tab, setTab] = useState<Tab>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [templates, setTemplates] = useState<OutreachTemplate[]>([]);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [composerLead, setComposerLead] = useState<Lead | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all');

  useEffect(() => {
    setLeads(getLeads());
    setTemplates(getTemplates());
  }, []);

  const refreshLeads = useCallback(() => {
    setLeads(getLeads());
  }, []);

  const handleSaveLead = (lead: Lead) => {
    saveLead(lead);
    refreshLeads();
    setShowLeadForm(false);
    setEditingLead(null);
  };

  const handleDeleteLead = (id: string) => {
    deleteLeadFromStorage(id);
    refreshLeads();
    if (selectedLead?.id === id) setSelectedLead(null);
  };

  const handleStatusChange = (lead: Lead, status: LeadStatus) => {
    const updated = {
      ...lead,
      status,
      lastContactedAt: ['contacted', 'replied', 'meeting', 'proposal', 'won'].includes(status)
        ? new Date().toISOString()
        : lead.lastContactedAt,
    };
    saveLead(updated);
    refreshLeads();
    if (selectedLead?.id === lead.id) setSelectedLead(updated);
  };

  const handleOutreachSend = (message: OutreachMessage) => {
    const lead = leads.find((l) => l.id === message.leadId);
    if (!lead) return;
    const updated: Lead = {
      ...lead,
      messages: [...lead.messages, message],
      status: lead.status === 'new' ? 'contacted' : lead.status,
      lastContactedAt: new Date().toISOString(),
    };
    saveLead(updated);
    refreshLeads();
    setComposerLead(null);
    if (selectedLead?.id === lead.id) setSelectedLead(updated);
  };

  const handleSaveTemplate = (template: OutreachTemplate) => {
    saveTemplate(template);
    setTemplates(getTemplates());
  };

  const handleDeleteTemplate = (id: string) => {
    deleteTemplate(id);
    setTemplates(getTemplates());
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !search ||
      lead.companyName.toLowerCase().includes(search.toLowerCase()) ||
      lead.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      lead.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const todayFollowUps = leads.filter((l) => {
    if (!l.nextFollowUp) return false;
    const followUp = new Date(l.nextFollowUp).toDateString();
    return followUp === new Date().toDateString();
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-lg font-black uppercase tracking-tight">Sales Outreach</h1>
                <p className="text-xs text-gray-500">MKB Acquisitie Tool</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingLead(null);
                setShowLeadForm(true);
              }}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              <Plus size={14} />
              Nieuwe Lead
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 -mb-px">
            {([
              { key: 'leads', label: 'Leads', icon: <Users size={14} /> },
              { key: 'pipeline', label: 'Pipeline', icon: <LayoutGrid size={14} /> },
              { key: 'templates', label: 'Templates', icon: <FileText size={14} /> },
            ] as const).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                  tab === t.key
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 py-6">
        {/* Follow-up Alert */}
        {todayFollowUps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FFD700]/10 border border-[#FFD700] rounded-xl p-4 mb-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-[#FFD700]" />
              <span className="text-sm font-bold">
                {todayFollowUps.length} follow-up{todayFollowUps.length > 1 ? 's' : ''} vandaag
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {todayFollowUps.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="text-xs font-bold bg-white px-3 py-1 rounded-full border border-[#FFD700] hover:bg-[#FFD700]/10 transition-colors"
                >
                  {lead.companyName}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab Content */}
        {tab === 'leads' && (
          <div className="space-y-4">
            {/* Search & Filter */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent bg-white text-black"
                  placeholder="Zoek op bedrijfsnaam, contact of stad..."
                />
              </div>
              <div className="relative">
                <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as LeadStatus | 'all')}
                  className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#FFD700] appearance-none cursor-pointer"
                >
                  <option value="all">Alle Status</option>
                  {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                    <option key={value} value={value}>{config.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Lead List + Detail Split */}
            <div className="flex gap-4">
              {/* Lead List */}
              <div className={`space-y-2 ${selectedLead ? 'w-1/2' : 'w-full'}`}>
                {filteredLeads.length === 0 && (
                  <div className="text-center py-16">
                    <Users size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 text-sm font-bold">
                      {search || filterStatus !== 'all' ? 'Geen leads gevonden' : 'Nog geen leads toegevoegd'}
                    </p>
                    <p className="text-gray-300 text-xs mt-1">
                      {!search && filterStatus === 'all' && 'Klik op "Nieuwe Lead" om te beginnen'}
                    </p>
                  </div>
                )}
                {filteredLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white border rounded-xl p-4 cursor-pointer transition-all ${
                      selectedLead?.id === lead.id
                        ? 'border-black shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm truncate">{lead.companyName}</h3>
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                            style={{
                              backgroundColor: STATUS_CONFIG[lead.status].color + '20',
                              color: STATUS_CONFIG[lead.status].color,
                            }}
                          >
                            {STATUS_CONFIG[lead.status].label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{lead.contactPerson} — {lead.city}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-2 shrink-0">
                        {lead.messages.length > 0 && (
                          <span className="text-[10px] font-bold text-gray-400">
                            {lead.messages.length} msg
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Lead Detail Panel */}
              <AnimatePresence>
                {selectedLead && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="w-1/2 bg-white border border-gray-200 rounded-xl overflow-hidden sticky top-24 self-start"
                  >
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-lg font-black">{selectedLead.companyName}</h2>
                          <p className="text-sm text-gray-500">{selectedLead.contactPerson}</p>
                        </div>
                        <button
                          onClick={() => setSelectedLead(null)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
                        >
                          <ArrowLeft size={16} />
                        </button>
                      </div>

                      {/* Status Selector */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(selectedLead, status as LeadStatus)}
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border transition-all ${
                              selectedLead.status === status
                                ? 'border-current'
                                : 'border-transparent opacity-50 hover:opacity-100'
                            }`}
                            style={{
                              backgroundColor: config.color + '20',
                              color: config.color,
                              borderColor: selectedLead.status === status ? config.color : 'transparent',
                            }}
                          >
                            {config.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Contact Info */}
                      <div className="space-y-2">
                        {selectedLead.email && (
                          <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-black transition-colors">
                            <Mail size={12} /> {selectedLead.email}
                          </a>
                        )}
                        {selectedLead.phone && (
                          <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-black transition-colors">
                            <Phone size={12} /> {selectedLead.phone}
                          </a>
                        )}
                        {selectedLead.website && (
                          <a href={selectedLead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gray-600 hover:text-black transition-colors">
                            <ExternalLink size={12} /> {selectedLead.website}
                          </a>
                        )}
                      </div>

                      {/* Notes */}
                      {selectedLead.notes && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 whitespace-pre-wrap">{selectedLead.notes}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setComposerLead(selectedLead)}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#FFD700] text-black py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#FFCF00] transition-colors border border-black"
                        >
                          <Sparkles size={14} />
                          Bericht Opstellen
                        </button>
                        <button
                          onClick={() => {
                            setEditingLead(selectedLead);
                            setShowLeadForm(true);
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                        >
                          Bewerk
                        </button>
                        <button
                          onClick={() => handleDeleteLead(selectedLead.id)}
                          className="p-2 border border-gray-300 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Message History */}
                      {selectedLead.messages.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            Berichtengeschiedenis
                          </h3>
                          <div className="space-y-2">
                            {selectedLead.messages.map((msg) => (
                              <div key={msg.id} className="border border-gray-100 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  {CHANNEL_ICONS[msg.channel]}
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                    {msg.channel}
                                  </span>
                                  <span className="text-[10px] text-gray-400 ml-auto">
                                    {msg.sentAt ? new Date(msg.sentAt).toLocaleDateString('nl-NL') : 'Concept'}
                                  </span>
                                </div>
                                {msg.subject && (
                                  <p className="text-xs font-semibold text-gray-700">{msg.subject}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2 whitespace-pre-wrap">{msg.body}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {tab === 'pipeline' && (
          <PipelineView
            leads={leads}
            onSelectLead={(lead) => {
              setSelectedLead(lead);
              setTab('leads');
            }}
          />
        )}

        {tab === 'templates' && (
          <TemplateManager
            templates={templates}
            onSave={handleSaveTemplate}
            onDelete={handleDeleteTemplate}
          />
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showLeadForm && (
          <LeadForm
            lead={editingLead}
            onSave={handleSaveLead}
            onClose={() => {
              setShowLeadForm(false);
              setEditingLead(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {composerLead && (
          <OutreachComposer
            lead={composerLead}
            onSend={handleOutreachSend}
            onClose={() => setComposerLead(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SalesOutreach;
