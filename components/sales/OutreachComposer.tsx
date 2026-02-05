import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Copy, Send, Check } from 'lucide-react';
import { Lead, OutreachChannel, OutreachMessage } from '../../types';
import { generateOutreachMessage } from '../../services/outreachService';
import { generateId } from '../../services/storageService';

interface OutreachComposerProps {
  lead: Lead;
  onSend: (message: OutreachMessage) => void;
  onClose: () => void;
}

const CHANNELS: { value: OutreachChannel; label: string; icon: string }[] = [
  { value: 'email', label: 'E-mail', icon: 'mail' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { value: 'phone', label: 'Telefoon', icon: 'phone' },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'message' },
];

const OutreachComposer: React.FC<OutreachComposerProps> = ({ lead, onSend, onClose }) => {
  const [channel, setChannel] = useState<OutreachChannel>('email');
  const [tone, setTone] = useState<'formal' | 'friendly' | 'direct'>('friendly');
  const [language, setLanguage] = useState<'nl' | 'en'>('nl');
  const [focusPoint, setFocusPoint] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await generateOutreachMessage({
        lead,
        channel,
        tone,
        language,
        focusPoint,
      });
      setSubject(result.subject);
      setBody(result.body);
    } catch (err) {
      console.error('Generation failed:', err);
      setBody('Er ging iets mis bij het genereren. Probeer het opnieuw.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    const text = channel === 'email' ? `Onderwerp: ${subject}\n\n${body}` : body;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    const message: OutreachMessage = {
      id: generateId(),
      leadId: lead.id,
      channel,
      subject,
      body,
      sentAt: new Date().toISOString(),
      status: 'sent',
    };
    onSend(message);
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight">Outreach Bericht</h2>
            <p className="text-sm text-gray-500 mt-0.5">{lead.companyName} — {lead.contactPerson}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Channel Selection */}
          <div>
            <label className={labelClass}>Kanaal</label>
            <div className="flex gap-2">
              {CHANNELS.map((ch) => (
                <button
                  key={ch.value}
                  onClick={() => setChannel(ch.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                    channel === ch.value
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone & Language */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Toon</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as 'formal' | 'friendly' | 'direct')}
                className={inputClass}
              >
                <option value="formal">Formeel</option>
                <option value="friendly">Vriendelijk</option>
                <option value="direct">Direct</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Taal</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'nl' | 'en')}
                className={inputClass}
              >
                <option value="nl">Nederlands</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Focus Point */}
          <div>
            <label className={labelClass}>Focus / Haakje</label>
            <input
              type="text"
              value={focusPoint}
              onChange={(e) => setFocusPoint(e.target.value)}
              className={inputClass}
              placeholder="bijv. hun website laadt langzaam, geen mobiele versie, verouderd design..."
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-[#FFD700] text-black py-2.5 px-4 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-[#FFCF00] transition-colors flex items-center justify-center gap-2 border border-black disabled:opacity-50"
          >
            {generating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={16} />
                </motion.div>
                AI genereert bericht...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Genereer met AI
              </>
            )}
          </button>

          {/* Subject (for email) */}
          {channel === 'email' && (
            <div>
              <label className={labelClass}>Onderwerp</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={inputClass}
                placeholder="Onderwerpregel..."
              />
            </div>
          )}

          {/* Message Body */}
          <div>
            <label className={labelClass}>Bericht</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={inputClass + " resize-none font-mono text-xs"}
              rows={10}
              placeholder="Schrijf je bericht of laat AI het genereren..."
            />
          </div>

          {/* Actions */}
          {body && (
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Gekopieerd!' : 'Kopieer'}
              </button>
              <button
                onClick={handleSend}
                className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2.5 px-4 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                <Send size={16} />
                Markeer als verstuurd
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OutreachComposer;
