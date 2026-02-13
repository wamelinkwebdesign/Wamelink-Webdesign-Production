import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import MagneticButton from './MagneticButton';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-black text-white relative z-10">
      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Let's Talk */}
          <div className="lg:col-span-7">
            <h2 className="text-[15vw] md:text-[8vw] leading-[0.85] font-black tracking-tighter uppercase mb-8 md:mb-12">
              Let's<br />
              Talk<span className="text-[#FFD700]">.</span>
            </h2>
            <div className="flex flex-col gap-4 items-start">
              <MagneticButton
                href="mailto:dennis@wamelinkwebdesign.nl"
                className="bg-[#FFD700] text-black border border-[#FFD700] px-6 py-4 rounded-full font-bold uppercase tracking-wider text-sm md:text-lg hover:bg-white hover:border-white transition-colors w-full sm:w-auto flex justify-center"
              >
                <span className="truncate w-full text-center">dennis@wamelinkwebdesign.nl</span>
              </MagneticButton>
              <a
                href="tel:+31651095919"
                className="text-xl md:text-2xl font-bold ml-2 mt-2 hover:text-[#FFD700] transition-colors"
              >
                +31 6 510 959 19
              </a>
            </div>
          </div>

          {/* Right: Links */}
          <div className="lg:col-span-5 flex flex-col justify-end">
            <div className="grid grid-cols-2 gap-8 md:gap-12">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">
                  Socials
                </h4>
                <ul className="flex flex-col gap-4">
                  {[
                    { name: 'Instagram', href: 'https://instagram.com/denniswamelink' },
                    { name: 'LinkedIn', href: 'https://linkedin.com/in/denniswamelink' },
                  ].map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[#FFD700] transition-colors"
                      >
                        {link.name}
                        <ArrowUpRight
                          size={14}
                          strokeWidth={3}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">
                  Office
                </h4>
                <address className="text-sm font-bold leading-relaxed not-italic text-gray-400">
                  Herengracht 320<br />
                  1016CE Amsterdam<br />
                  The Netherlands
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-600 gap-4 md:gap-0">
          <p>&copy; {new Date().getFullYear()} Wamelink Webdesign</p>
          <div className="flex gap-8">
            <Link to="/terms" className="hover:text-white transition-colors">
              Algemene voorwaarden
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
