import React from 'react';
import { motion } from 'framer-motion';
import { Lead, LeadStatus } from '../../types';

interface PipelineViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

const STAGES: { status: LeadStatus; label: string; color: string }[] = [
  { status: 'new', label: 'Nieuw', color: '#3B82F6' },
  { status: 'contacted', label: 'Benaderd', color: '#F59E0B' },
  { status: 'replied', label: 'Reactie', color: '#8B5CF6' },
  { status: 'meeting', label: 'Gesprek', color: '#EC4899' },
  { status: 'proposal', label: 'Offerte', color: '#F97316' },
  { status: 'won', label: 'Gewonnen', color: '#10B981' },
  { status: 'lost', label: 'Verloren', color: '#6B7280' },
];

const PipelineView: React.FC<PipelineViewProps> = ({ leads, onSelectLead }) => {
  const getLeadsByStatus = (status: LeadStatus) =>
    leads.filter((l) => l.status === status);

  const totalLeads = leads.length;
  const wonLeads = getLeadsByStatus('won').length;
  const activeLeads = leads.filter((l) => !['won', 'lost'].includes(l.status)).length;

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Totaal Leads</p>
          <p className="text-3xl font-black mt-1">{totalLeads}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Actieve Pipeline</p>
          <p className="text-3xl font-black mt-1">{activeLeads}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Gewonnen</p>
          <p className="text-3xl font-black text-green-600 mt-1">{wonLeads}</p>
        </div>
      </div>

      {/* Pipeline Columns */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = getLeadsByStatus(stage.status);
          return (
            <div key={stage.status} className="min-w-[200px] flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  {stage.label}
                </span>
                <span className="text-xs font-bold text-gray-400 ml-auto">
                  {stageLeads.length}
                </span>
              </div>
              <div className="space-y-2">
                {stageLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-gray-400 hover:shadow-sm transition-all"
                    onClick={() => onSelectLead(lead)}
                  >
                    <p className="font-bold text-sm truncate">{lead.companyName}</p>
                    <p className="text-xs text-gray-500 truncate">{lead.contactPerson}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                        {lead.industry}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-auto">{lead.city}</span>
                    </div>
                  </motion.div>
                ))}
                {stageLeads.length === 0 && (
                  <div className="border border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-400">Geen leads</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineView;
