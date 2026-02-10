import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Copy, Send, Check, Mail, Linkedin, Phone, MessageCircle, Loader2, AlertCircle, CheckCircle2, Search, ExternalLink } from 'lucide-react';
import { Lead, OutreachChannel, OutreachMessage } from '../../types';
import { generateOutreachMessage, sendEmail, findEmail, checkGmailStatus } from '../../services/outreachService';
import { generateId } from '../../services/storageService';

interface OutreachComposerProps {
  lead: Lead;
  onSend: (message: OutreachMessage) => void;
  onClose: () => void;
}

const CHANNELS: { value: OutreachChannel; label: string; icon: React.ReactNode }[] = [
  { value: 'email', label: 'E-mail', icon: <Mail size={14} /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={14} /> },
  { value: 'phone', label: 'Telefoon', icon: <Phone size={14} /> },
  { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={14} /> },
];

type SendStatus = 'idle' | 'sending' | 'sent' | 'error';

const OutreachComposer: React.FC<OutreachComposerProps> = ({ lead, onSend, onClose }) => {
  const [channel, setChannel] = useState<OutreachChannel>('email');
  const [tone, setTone] = useState<'formal' | 'friendly' | 'direct'>('friendly');
  const [language, setLanguage] = useState<'nl' | 'en'>('nl');
  const [focusPoint, setFocusPoint] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle');
  const [sendError, setSendError] = useState('');

  // Gmail status
  const [gmailConnected, setGmailConnected] = useState<boolean | null>(null);
  const [gmailEmail, setGmailEmail] = useState('');

  // Email finder
  const [findingEmail, setFindingEmail] = useState(false);
  const [foundEmails, setFoundEmails] = useState<{ email: string; score: number; foundOn: string }[]>([]);
  const [selectedEmail, setSelectedEmail] = useState(lead.email || '');
  const [showEmailPicker, setShowEmailPicker] = useState(false);

  // Check Gmail status on mount
  useEffect(() => {
    checkGmailStatus().then((status) => {
      setGmailConnected(status.connected);
      if (status.email) setGmailEmail(status.email);
    });
  }, []);

  // Auto-find email if lead has website but no email
  useEffect(() => {
    if (!lead.email && lead.website && channel === 'email') {
      handleFindEmail();
    }
  }, []);

  const handleFindEmail = async () => {
    if (!lead.website) return;
    setFindingEmail(true);

    const result = await findEmail(lead.website);

    if (result.success && result.emails && result.emails.length > 0) {
      setFoundEmails(result.emails);
      if (result.bestEmail && !selectedEmail) {
        setSelectedEmail(result.bestEmail);
      }
      if (result.emails.length > 1) {
        setShowEmailPicker(true);
      }
    }

    setFindingEmail(false);
  };

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

  const handleSendEmail = async () => {
    const emailTo = selectedEmail || lead.email;
    if (!emailTo) {
      setSendError('Geen e-mailadres beschikbaar. Gebruik "Zoek E-mail" of vul handmatig in.');
      setSendStatus('error');
      return;
    }

    setSendStatus('sending');
    setSendError('');

    const result = await sendEmail(emailTo, subject, body);

    if (result.success) {
      setSendStatus('sent');
      const message: OutreachMessage = {
        id: generateId(),
        leadId: lead.id,
        channel: 'email',
        subject,
        body,
        sentAt: new Date().toISOString(),
        status: 'sent',
      };
      onSend(message);
    } else {
      setSendStatus('error');
      setSendError(result.error || 'Onbekende fout bij verzenden');
    }
  };

  const handleMarkAsSent = () => {
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

  const emailTo = selectedEmail || lead.email;

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent bg-white text-black cursor-auto';
  const labelClass = 'block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1';

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ cursor: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight">Outreach Bericht</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {lead.companyName} — {lead.contactPerson}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Gmail Status */}
            {gmailConnected !== null && (
              <div className="flex items-center gap-1.5">
                {gmailConnected ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Gmail
                  </span>
                ) : (
                  <a
                    href="/api/gmail/authorize"
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-full hover:text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <Mail size={10} />
                    Gmail koppelen
                  </a>
                )}
              </div>
            )}
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-auto">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Email recipient - show when email channel */}
          {channel === 'email' && (
            <div>
              <label className={labelClass}>Aan</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  className={inputClass + ' flex-1'}
                  placeholder="E-mailadres van de prospect..."
                />
                {lead.website && (
                  <button
                    onClick={handleFindEmail}
                    disabled={findingEmail}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors whitespace-nowrap cursor-auto"
                  >
                    {findingEmail ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Search size={12} />
                    )}
                    Zoek E-mail
                  </button>
                )}
              </div>

              {/* Found emails picker */}
              {foundEmails.length > 0 && showEmailPicker && (
                <div className="mt-2 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Gevonden e-mailadressen:
                  </p>
                  {foundEmails.map((e) => (
                    <button
                      key={e.email}
                      onClick={() => {
                        setSelectedEmail(e.email);
                        setShowEmailPicker(false);
                      }}
                      className={`flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-xs border transition-all cursor-auto ${
                        selectedEmail === e.email
                          ? 'border-[#FFD700] bg-[#FFD700]/10 font-bold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span>{e.email}</span>
                      <span className="text-[10px] text-gray-400">
                        gevonden op {e.foundOn || '/'}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Auto-found notification */}
              {foundEmails.length > 0 && !showEmailPicker && selectedEmail && selectedEmail !== lead.email && (
                <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  Automatisch gevonden op {lead.website}
                  {foundEmails.length > 1 && (
                    <button
                      onClick={() => setShowEmailPicker(true)}
                      className="underline ml-1 cursor-auto"
                    >
                      ({foundEmails.length} resultaten)
                    </button>
                  )}
                </p>
              )}
            </div>
          )}

          {/* Channel Selection */}
          <div>
            <label className={labelClass}>Kanaal</label>
            <div className="flex gap-2">
              {CHANNELS.map((ch) => (
                <button
                  key={ch.value}
                  onClick={() => setChannel(ch.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all cursor-auto ${
                    channel === ch.value
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {ch.icon}
                  {ch.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone & Language */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className={labelClass}>Toon</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className={inputClass}
              >
                <option value="friendly">Vriendelijk</option>
                <option value="formal">Formeel</option>
                <option value="direct">Direct</option>
              </select>
            </div>
            <div className="flex-1">
              <label className={labelClass}>Taal</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className={inputClass}
              >
                <option value="nl">Nederlands</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Focus Point */}
          <div>
            <label className={labelClass}>Focuspunt (optioneel)</label>
            <input
              type="text"
              value={focusPoint}
              onChange={(e) => setFocusPoint(e.target.value)}
              className={inputClass}
              placeholder="Bijv. hun website laadt langzaam, geen mobiele versie, verouderd design..."
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-[#FFD700] text-black py-2.5 px-4 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-[#FFCF00] transition-colors flex items-center justify-center gap-2 border border-black disabled:opacity-50 cursor-auto"
          >
            {generating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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
              className={inputClass + ' resize-none font-mono text-xs'}
              rows={10}
              placeholder="Schrijf je bericht of laat AI het genereren..."
            />
          </div>

          {/* Send Status Messages */}
          {sendStatus === 'sent' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="text-sm text-green-700 font-medium">
                E-mail succesvol verzonden naar {emailTo}!
                {gmailConnected && <span className="text-green-500 text-xs ml-1">(via Gmail met handtekening)</span>}
              </span>
            </motion.div>
          )}

          {sendStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle size={16} className="text-red-600" />
              <span className="text-sm text-red-700 font-medium">{sendError}</span>
            </motion.div>
          )}

          {/* Actions */}
          {body && (
            <div className="flex gap-3">
              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors cursor-auto"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Gekopieerd!' : 'Kopieer'}
              </button>

              {/* Send or Mark as sent */}
              {channel === 'email' && emailTo ? (
                <button
                  onClick={handleSendEmail}
                  disabled={sendStatus === 'sending' || sendStatus === 'sent'}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 px-4 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-green-700 transition-colors disabled:opacity-50 cursor-auto"
                >
                  {sendStatus === 'sending' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Verzenden{gmailConnected ? ' via Gmail...' : '...'}
                    </>
                  ) : sendStatus === 'sent' ? (
                    <>
                      <CheckCircle2 size={16} />
                      Verzonden!
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Verstuur E-mail
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleMarkAsSent}
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2.5 px-4 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-auto"
                >
                  <Send size={16} />
                  Markeer als verstuurd
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OutreachComposer;
