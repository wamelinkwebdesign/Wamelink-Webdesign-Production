import React from 'react';
import { Link } from 'react-router-dom';
import MagneticButton from './MagneticButton';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="py-16 md:py-24 bg-white border-t border-black">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16 md:mb-24">
          <div>
            <h2 className="text-[15vw] md:text-[8vw] leading-[0.85] font-black tracking-tighter uppercase mb-8 md:mb-12">
              Let's Talk.
            </h2>
            <div className="flex flex-col gap-4 items-start w-full sm:w-auto">
              <MagneticButton
                href="mailto:dennis@wamelinkwebdesign.nl"
                className="bg-[#ffcf00] text-black border border-black px-5 py-4 md:px-6 md:py-3 rounded-full font-bold uppercase tracking-wider text-s sm:text-sm md:text-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full sm:w-auto flex justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-none"
              >
                <span className="truncate w-full text-center">dennis@wamelinkwebdesign.nl</span>
              </MagneticButton>
              <span className="text-xl md:text-2xl font-bold ml-2 mt-2 md:mt-0">
                <a
                  href="tel:+31651095919"
                  className="hover:underline decoration-2 decoration-[#ffcf00] underline-offset-4 transition-all"
                >
                  +31 6 510 959 19
                </a>
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-end items-start lg:items-end">
            <div className="grid grid-cols-2 gap-8 md:gap-16 text-sm font-bold uppercase tracking-widest mb-12 md:mb-16 lg:text-right w-full lg:w-auto">
              <div>
                <h4 className="mb-4 md:mb-6 text-gray-400">Socials</h4>
                <ul className="flex flex-col gap-4 items-start lg:items-end">
                  <li>
                    <a href="#" className="flex items-center gap-2 hover:text-[#ffcf00] transition-colors group">
                      <span className="group-hover:underline decoration-[#ffcf00]">Instagram</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-2 hover:text-[#ffcf00] transition-colors group">
                      <span className="group-hover:underline decoration-[#ffcf00]">LinkedIn</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 md:mb-6 text-gray-400">Office</h4>
                <p className="text-sm leading-relaxed">
                  Herengracht 320<br />
                  1016CE Amsterdam<br />
                  The Netherlands
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-black pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 gap-4 md:gap-0">
           <p>&copy; {new Date().getFullYear()} Wamelink Webdesign</p>
           <div className="flex gap-8">
             <Link to="/terms" className="hover:text-black transition-colors">ALGEMENE VOORWAARDEN</Link>
             <Link to="/privacy" className="hover:text-black transition-colors">PRIVACY POLICY</Link>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
