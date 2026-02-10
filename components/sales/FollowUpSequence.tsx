import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Calendar, Send, Clock, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Lead, OutreachChannel } from '../../types';
import { scheduleFollowUps } from '../../services/outreachService';

interface FollowUpSequenceProps {
  lead: Lead;
  onClose: () => void;
  onScheduled: () => void;
}

interface SequenceStep {
  id: string;
  dayOffset: number;
  channel: OutreachChannel;
  tone: 'formal' | 'friendly' | 'direct';
  focusPoint: string;
}

const PRESET_SEQUENCES = [
  {
    name: '3-stappen standaard',
    steps: [
      { dayOffset: 0, channel: 'email' as OutreachChannel, tone: 'friendly' as const, focusPoint: '' },
      { dayOffset: 5, channel: 'email' as OutreachChannel, tone: 'friendly' as const, focusPoint: 'Herinnering aan vorig bericht' },
      { dayOffset: 12, channel: 'email' as OutreachChannel, tone: 'direct' as const, focusPoint: 'Laatste poging, creëer urgentie' },
    ],
  },
  {
    name: 'Multi-channel',
    steps: [
      { dayOffset: 0, channel: 'email' as OutreachChannel, tone: 'friendly' as const, focusPoint: '' },
      { dayOffset: 3, channel: 'linkedin' as OutreachChannel, tone: 'friendly' as const, focusPoint: 'Connectieverzoek' },
      { dayOffset: 7, channel: 'email' as OutreachChannel, tone: 'direct' as const, focusPoint: 'Follow-up met waarde' },
      { dayOffset: 14, channel: 'phone' as OutreachChannel, tone: 'friendly' as const, focusPoint: 'Belscript' },
    ],
  },
  {
    name: 'Voorzichtig (lange termijn)',
    steps: [
      { dayOffset: 0, channel: 'email' as OutreachChannel, tone: 'formal' as const, focusPoint: '' },
      { dayOffset: 10, channel: 'email' as OutreachChannel, tone: 'friendly' as const, focusPoint: 'Deel waardevolle tip' },
      { dayOffset: 21, channel: 'email' as OutreachChannel, tone: 'friendly' as const, focusPoint: 'Laatste check-in' },
    ],
  },
];

const CHANNEL_LABELS: Record<OutreachChannel, string> = {
  email: 'E-mail',
  linkedin: 'LinkedIn',
  phone: 'Telefoon',
  whatsapp: 'WhatsApp',
};

const FollowUpSequence: React.FC<FollowUpSequenceProps> = ({ lead, onClose, onScheduled }) => {
  const [steps, setSteps] = useState<SequenceStep[]>([
    { id: '1', dayOffset: 0, channel: 'email', tone: 'friendly', focusPoint: '' },
    { id: '2', dayOffset: 5, channel: 'email', tone: 'friendly', focusPoint: 'Herinnering aan vorig bericht' },
    { id: '3', dayOffset: 12, channel: 'email', tone: 'direct', focusPoint: 'Laatste poging, creëer urgentie' },
  ]);
  const [scheduling, setScheduling] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [error, setError] = useState('');

  const addStep = () => {
    const lastDay = steps.length > 0 ? steps[steps.length - 1].dayOffset : 0;
    setSteps([
      ...steps,
      {
        id: Date.now().toString(),
        dayOffset: lastDay + 5,
        channel: 'email',
        tone: 'friendly',
        focusPoint: '',
      },
    ]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const updateStep = (id: string, field: keyof SequenceStep, value: any) => {
    setSteps(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const applyPreset = (preset: (typeof PRESET_SEQUENCES)[0]) => {
    setSteps(
      preset.steps.map((s, i) => ({
        ...s,
        id: `preset-${i}-${Date.now()}`,
      }))
    );
  };

  const handleSchedule = async () => {
    if (steps.length === 0) return;

    setScheduling(true);
    setError('');

    const result = await scheduleFollowUps(
      {
        id: lead.id,
        companyName: lead.companyName,
        contactPerson: lead.contactPerson,
        email: lead.email,
        industry: lead.industry,
        city: lead.city,
        website: lead.website,
      },
      steps.map((s) => ({
        dayOffset: s.dayOffset,
        channel: s.channel,
        tone: s.tone,
        focusPoint: s.focusPoint,
      }))
    );

    setScheduling(false);

    if (result.success) {
      setScheduled(true);
      onScheduled();
    } else {
      setError(result.error || 'Inplannen mislukt');
    }
  };

  const getScheduledDate = (dayOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return date.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const inputClass =
    'w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent bg-white text-black';

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight">Follow-up Sequence</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {lead.companyName} — {lead.contactPerson}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {scheduled ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <Check size={64} className="mx-auto text-green-500" />
              <h3 className="text-xl font-black uppercase mt-4">Sequence Ingepland!</h3>
              <p className="text-sm text-gray-500 mt-2">
                {steps.length} follow-ups zijn automatisch ingepland
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-black text-white py-2.5 px-6 rounded-lg font-bold text-sm uppercase tracking-wider"
              >
                Sluiten
              </button>
            </motion.div>
          ) : (
            <>
              {/* Preset Buttons */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Snel starten met een template
                </p>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_SEQUENCES.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="px-3 py-1.5 text-xs font-bold border border-gray-300 rounded-lg hover:border-[#FFD700] hover:bg-[#FFD700]/5 transition-all"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          {step.dayOffset === 0 ? 'Vandaag' : `Dag ${step.dayOffset}`}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          ({getScheduledDate(step.dayOffset)})
                        </span>
                      </div>
                      {steps.length > 1 && (
                        <button
                          onClick={() => removeStep(step.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Na X dagen
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={step.dayOffset}
                          onChange={(e) => updateStep(step.id, 'dayOffset', parseInt(e.target.value) || 0)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Kanaal
                        </label>
                        <select
                          value={step.channel}
                          onChange={(e) => updateStep(step.id, 'channel', e.target.value)}
                          className={inputClass + ' cursor-pointer'}
                        >
                          {Object.entries(CHANNEL_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Toon
                        </label>
                        <select
                          value={step.tone}
                          onChange={(e) => updateStep(step.id, 'tone', e.target.value)}
                          className={inputClass + ' cursor-pointer'}
                        >
                          <option value="friendly">Vriendelijk</option>
                          <option value="formal">Formeel</option>
                          <option value="direct">Direct</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Focus / Instructie voor AI
                      </label>
                      <input
                        type="text"
                        value={step.focusPoint}
                        onChange={(e) => updateStep(step.id, 'focusPoint', e.target.value)}
                        className={inputClass}
                        placeholder="Bijv. Herinnering, deel een tip, creëer urgentie..."
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add Step */}
              <button
                onClick={addStep}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors flex items-center justify-center gap-1"
              >
                <Plus size={14} />
                Stap toevoegen
              </button>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle size={16} className="text-red-500" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {/* Schedule Button */}
              <button
                onClick={handleSchedule}
                disabled={scheduling || steps.length === 0}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {scheduling ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Inplannen...
                  </>
                ) : (
                  <>
                    <Calendar size={16} />
                    {steps.length} follow-ups inplannen
                  </>
                )}
              </button>

              <p className="text-[10px] text-gray-400 text-center">
                E-mail follow-ups worden automatisch verzonden. LinkedIn, telefoon en WhatsApp follow-ups
                verschijnen als herinnering in je dashboard.
              </p>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FollowUpSequence;
