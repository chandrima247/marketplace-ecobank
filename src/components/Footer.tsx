import { Shield } from 'lucide-react';

interface FooterProps {
  isSubPage?: boolean;
}

export default function Footer({ isSubPage = false }: FooterProps) {
  if (isSubPage) {
    return (
      <footer className="bg-gray-50 border-t border-gray-100 py-8 mt-auto" id="subpage-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left font-medium">
            © 2026 MaaS Insurance Marketplace. Partnered with Ecobank Pan-African Network.
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
            <span className="font-sans text-2xl font-bold text-deep-navy">MaaS Insurance</span>
          </div>
          <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
            Connecting people with instant, microprotecting technology and absolute financial trust. Part of the Ecobank Pan-African digital ecosystem.
          </p>
          <p className="text-xs text-gray-400 mt-4">© 2026 MaaS Insurance Marketplace. All rights reserved.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24">
          <div className="flex flex-col gap-5">
            <p className="font-bold text-primary text-xs uppercase tracking-wider">Company</p>
            <div className="flex flex-col gap-3 text-sm text-gray-500">
              <a href="#about" onClick={(e) => { e.preventDefault(); alert('MaaS Insurance connects 33 countries under unified microprotect laws.'); }} className="hover:text-primary transition-colors">About Us</a>
              <a href="#careers" onClick={(e) => { e.preventDefault(); alert('Join the team at Ecobank / MaaS tech hubs!'); }} className="hover:text-primary transition-colors">Careers</a>
              <a href="#press" onClick={(e) => { e.preventDefault(); alert('Ecobank announces partnership with MaaS Next-Gen insurance.'); }} className="hover:text-primary transition-colors">Press</a>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <p className="font-bold text-primary text-xs uppercase tracking-wider">Support</p>
            <div className="flex flex-col gap-3 text-sm text-gray-500">
              <a href="#faq" onClick={(e) => { e.preventDefault(); alert('Common answers can be asked directly via our Voice Assistant.'); }} className="hover:text-primary transition-colors">FAQ</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); alert('Please support or contact us at customercare@maas-insurance.ecobank.com'); }} className="hover:text-primary transition-colors">Contact</a>
              <a href="#claims-help" onClick={(e) => { e.preventDefault(); alert('Submit claims via dashboard and receive prompt payout under 24hrs.'); }} className="hover:text-primary transition-colors">Claims Help</a>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <p className="font-bold text-primary text-xs uppercase tracking-wider">Legal</p>
            <div className="flex flex-col gap-3 text-sm text-gray-500">
              <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Authorized and regulated banking policy safeguards are in force.'); }} className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#terms" onClick={(e) => { e.preventDefault(); alert('MaaS tech service terms protect your instant claim payouts.'); }} className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
