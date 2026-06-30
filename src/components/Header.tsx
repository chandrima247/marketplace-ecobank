import { LogIn, ArrowLeft } from 'lucide-react';
import { METADATA_IMAGES } from '../data';
import { User as UserType } from '../types';
import CountrySelector from './CountrySelector';
import AccountMenu from './AccountMenu';

interface HeaderProps {
  user: UserType | null;
  onLoginClick: () => void;
  onLogout: () => void;
  activeView: 'explore' | 'policies' | 'claims' | 'wizard' | 'agent';
  onNavigate: (view: 'explore' | 'policies' | 'claims') => void;
  onBackClick?: () => void;
  titleOverride?: string;
  isSubPage?: boolean;
}

export default function Header({
  user,
  onLoginClick,
  onLogout,
  activeView,
  onNavigate,
  onBackClick,
  titleOverride,
  isSubPage = false
}: HeaderProps) {
  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Left segment */}
        <div className="flex items-center gap-3">
          {isSubPage && onBackClick ? (
            <button
              onClick={onBackClick}
              aria-label="Back"
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
              id="header-back-btn"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
          ) : null}

          <div className="flex items-center" id="homepage-logo-container">
            <img
              src={METADATA_IMAGES.ecobankLogo}
              alt="Ecobank Logo"
              className="h-10 md:h-12 w-auto object-contain"
              id="header-ecobank-logo"
            />
          </div>
        </div>

        {/* Center Navigation Links (Hidden on wizards/subpages to focus conversion) */}
        {!isSubPage ? (
          <div className="hidden md:flex items-center gap-8 font-medium" id="desktop-nav-links">
            <button
              id="nav-explore-btn"
              onClick={() => onNavigate('explore')}
              className={`pb-1 text-sm transition-colors border-b-2 ${
                activeView === 'explore'
                  ? 'text-primary border-primary font-bold'
                  : 'text-gray-500 border-transparent hover:text-primary'
              }`}
            >
              Explore
            </button>
            <button
              id="nav-policies-btn"
              onClick={() => {
                if (user?.isLoggedIn) {
                  onNavigate('policies');
                } else {
                  onLoginClick();
                }
              }}
              className={`pb-1 text-sm transition-colors border-b-2 ${
                activeView === 'policies'
                  ? 'text-primary border-primary font-bold'
                  : 'text-gray-500 border-transparent hover:text-primary'
              }`}
            >
              My Policies
            </button>
            <button
              id="nav-claims-btn"
              onClick={() => {
                if (user?.isLoggedIn) {
                  onNavigate('claims');
                } else {
                  onLoginClick();
                }
              }}
              className={`pb-1 text-sm transition-colors border-b-2 ${
                activeView === 'claims'
                  ? 'text-primary border-primary font-bold'
                  : 'text-gray-500 border-transparent hover:text-primary'
              }`}
            >
              Claims
            </button>
            <a
              id="nav-support-link"
              href="#support"
              onClick={(e) => {
                e.preventDefault();
                alert('Support center is available 24/7! Feel free to talk through our Live AI Voice Assistant on the search bar.');
              }}
              className="text-gray-500 text-sm hover:text-primary transition-colors pb-1 border-b-2 border-transparent"
            >
              Support
            </a>
          </div>
        ) : null}

        {/* Right segment */}
        <div className="flex items-center gap-3 sm:gap-4" id="header-right-controls">
          <CountrySelector />
          {user?.isLoggedIn ? (
            <AccountMenu user={user} onLogout={onLogout} onNavigate={onNavigate} />
          ) : (
            <button
              id="header-login-btn"
              onClick={onLoginClick}
              className="flex items-center gap-2 px-5 py-2 hover:bg-primary/5 text-primary border border-primary md:bg-primary md:text-white rounded-full font-semibold text-xs sm:text-sm hover:md:bg-primary-container transition-all active:scale-95 shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}

          {/* Partner & Help Accessories */}
          <div className="flex items-center gap-2" id="header-partner-badge">
            <img
              src={METADATA_IMAGES.nxtpeLogo}
              alt="nxtpe Logo"
              className="h-8 md:h-9 object-contain"
              id="header-nexus-logo"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
