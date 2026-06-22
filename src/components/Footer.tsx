import { Shield } from 'lucide-react';
import { User } from '../types';

interface FooterProps {
  isSubPage?: boolean;
  onRoleLogin?: (role: Extract<NonNullable<User['role']>, 'customer' | 'agent'>) => void;
  onBackofficeLogin?: () => void;
}

export default function Footer({ isSubPage = false, onRoleLogin, onBackofficeLogin }: FooterProps) {
  if (isSubPage) {
    return (
      <footer className="bg-gray-50 border-t border-gray-100 py-8 mt-auto" id="subpage-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left font-medium">
            © 2026 Ecobank Insurance Marketplace. Partnered with Ecobank Pan-African Network.
          </p>
          <div className="flex gap-6">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy policy is securely enforced by Ecobank compliance.'); }} className="text-xs sm:text-sm text-gray-500 hover:text-primary transition-colors font-semibold">
              Privacy Policy
            </a>
            <a href="#support" onClick={(e) => { e.preventDefault(); alert('24/7 client assistant dashboard is active.'); }} className="text-xs sm:text-sm text-gray-500 hover:text-primary transition-colors font-semibold">
              Support
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-white border-t border-gray-100 py-16 relative z-20" id="standard-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="font-sans text-2xl font-bold text-deep-navy">Ecobank Insurance</span>
          </div>
          <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
            A unified bancassurance marketplace for buying, servicing, and renewing cover across Ecobank digital and assisted channels.
          </p>
          <p className="text-xs text-gray-400 mt-4">© 2026 Ecobank Insurance Marketplace. All rights reserved.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          <div className="flex flex-col gap-5">
            <p className="font-bold text-primary text-xs uppercase tracking-wider">Company</p>
            <div className="flex flex-col gap-3 text-sm text-gray-500">
              <a href="#about" onClick={(e) => { e.preventDefault(); alert('Ecobank Insurance connects customers to partner insurers across assisted and digital channels.'); }} className="hover:text-primary transition-colors">About Us</a>
              <a href="#careers" onClick={(e) => { e.preventDefault(); alert('Join the Ecobank insurance platform team.'); }} className="hover:text-primary transition-colors">Careers</a>
              <a href="#press" onClick={(e) => { e.preventDefault(); alert('Ecobank expands its digital bancassurance marketplace.'); }} className="hover:text-primary transition-colors">Press</a>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <p className="font-bold text-primary text-xs uppercase tracking-wider">Support</p>
            <div className="flex flex-col gap-3 text-sm text-gray-500">
              <a href="#faq" onClick={(e) => { e.preventDefault(); alert('Common answers can be asked directly via our Voice Assistant.'); }} className="hover:text-primary transition-colors">FAQ</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); alert('Please contact support at customercare@ecobank-insurance.com'); }} className="hover:text-primary transition-colors">Contact</a>
              <a href="#claims-help" onClick={(e) => { e.preventDefault(); alert('Submit claims via dashboard and track supporting documents in real time.'); }} className="hover:text-primary transition-colors">Claims Help</a>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <p className="font-bold text-primary text-xs uppercase tracking-wider">Access</p>
            <div className="flex flex-col gap-3 text-sm text-gray-500">
              <a href="#customer-login" onClick={(e) => { e.preventDefault(); onRoleLogin?.('customer'); }} className="hover:text-primary transition-colors">Customer login</a>
              <a href="#agent-login" onClick={(e) => { e.preventDefault(); onRoleLogin?.('agent'); }} className="hover:text-primary transition-colors">Agent access</a>
              <a href="#backoffice" onClick={(e) => { e.preventDefault(); onBackofficeLogin?.(); }} className="hover:text-primary transition-colors">Backoffice access</a>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <p className="font-bold text-primary text-xs uppercase tracking-wider">Legal</p>
            <div className="flex flex-col gap-3 text-sm text-gray-500">
              <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Authorized and regulated banking policy safeguards are in force.'); }} className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Ecobank Insurance service terms protect digital policy servicing and claims support.'); }} className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
