import { LogIn, User, LogOut, Menu, X, HelpCircle, ArrowLeft, Shield } from 'lucide-react';
import { METADATA_IMAGES } from '../data';
import { User as UserType } from '../types';

interface HeaderProps {
  user: UserType | null;
  onLoginClick: () => void;
  onLogout: () => void;
  activeView: 'explore' | 'policies' | 'claims' | 'wizard';
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

          {isSubPage ? (
            <div className="flex items-center gap-2" id="subpage-logo-container">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white" id="subpage-shield-logo">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-sans font-bold text-lg md:text-xl text-primary tracking-tight" id="subpage-title-branding">
                {titleOverride || 'MaaS Insurance'}
              </span>
            </div>
          ) : (
            <div className="flex items-center" id="homepage-logo-container">
              <img
                src={METADATA_IMAGES.ecobankLogo}
                alt="Ecobank Logo"
                className="h-10 md:h-12 w-auto object-contain"
                id="header-ecobank-logo"
              />
            </div>
          )}
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
        <div className="flex items-center gap-4" id="header-right-controls">
          {user?.isLoggedIn ? (
            <div className="flex items-center gap-2" id="header-user-badge">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-gray-900">{user.name}</span>
                <span className="text-[10px] text-gray-500">{user.email}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <button
                id="header-logout-btn"
                onClick={onLogout}
                title="Log Out"
                className="p-1.5 text-gray-400 hover:text-error rounded-full hover:bg-gray-100 transition-all active:scale-95"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
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
            {isSubPage && (
              <div className="hidden sm:flex items-center gap-2 text-gray-400" id="subpage-help-actions">
                <HelpCircle className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" title="Get Help" />
                <X className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" title="Exit Flow" onClick={onBackClick} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
