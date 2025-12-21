import React, { useState } from 'react';
import { generateProjectConcept } from '../services/geminiService';
import { AiConsultationResult } from '../types';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const AiConcept: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState<AiConsultationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await generateProjectConcept(idea);
      setResult(data);
    } catch (err) {
      setError('Could not connect to the creative intelligence. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-concept" className="py-24 bg-black text-white border-b border-white/20">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">
              AI Design<br />Partner
            </h2>
            <p className="text-lg text-gray-400 mb-12 max-w-md">
              Not sure where to start? Tell our Gemini-powered architect about your project, and get an instant creative brief, sitemap, and aesthetic direction.
            </p>
            
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="e.g. A minimalist coffee shop in Rotterdam"
                  className="w-full bg-transparent border-b border-white/30 py-4 text-2xl font-light focus:outline-none focus:border-white transition-colors placeholder:text-gray-700"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={loading || !idea.trim()}
                className="group flex items-center gap-3 bg-white text-black px-8 py-4 font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> Thinking...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} /> Generate Concept
                  </>
                )}
              </button>
              {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:pl-12 min-h-[400px] flex items-center justify-center lg:border-l border-white/20">
            {!result && !loading && (
              <div className="text-center text-gray-600 opacity-50">
                <Sparkles size={64} strokeWidth={1} className="mx-auto mb-4" />
                <p className="uppercase tracking-widest text-sm">Waiting for input</p>
              </div>
            )}

            {loading && (
              <div className="text-center">
                 <div className="inline-block w-24 h-1 bg-white/20 overflow-hidden">
                    <div className="w-full h-full bg-white animate-progress-indeterminate"></div>
                 </div>
                 <p className="mt-4 uppercase tracking-widest text-xs animate-pulse">Analyzing vibes...</p>
              </div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-white/5 p-8 border border-white/10 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{result.tagline}</h3>
                    <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest">Project Vision</p>
                  </div>
                  <button onClick={handleGenerate} className="text-gray-400 hover:text-white"><RefreshCw size={20}/></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Proposed Sitemap</h4>
                    <ul className="space-y-2">
                      {result.sitemap.map((page, i) => (
                        <li key={i} className="flex items-center gap-3 text-lg font-light">
                          <span className="text-xs font-mono text-gray-600">0{i+1}</span>
                          {page}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Vibe & Palette</h4>
                    <p className="text-sm text-gray-300 leading-relaxed mb-6">
                      {result.vibeDescription}
                    </p>
                    <div className="flex gap-2">
                      {result.colorPalette.map((color, i) => (
                        <div key={i} className="group relative">
                          <div 
                            className="w-12 h-12 border border-white/10 rounded-full" 
                            style={{ backgroundColor: color }}
                          />
                          <span className="absolute -bottom-6 left-0 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                            {color}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes progress-indeterminate {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 1.5s infinite linear;
        }
      `}</style>
    </section>
  );
};

export default AiConcept;