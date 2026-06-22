import React, { useEffect, useState } from 'react';
import { X, Shield, Mail, Smartphone, ArrowRight, Headset } from 'lucide-react';
import { METADATA_IMAGES } from '../data';
import { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialRole?: User['role'];
}

const ROLE_OPTIONS: { role: NonNullable<User['role']>; label: string; helper: string; icon: React.ReactNode }[] = [
  { role: 'customer', label: 'Customer', helper: 'Policies, claims, renewals', icon: <Shield className="w-4 h-4" /> },
  { role: 'agent', label: 'Agent', helper: 'Assisted service workspace', icon: <Headset className="w-4 h-4" /> },
];

function getRoleIdentity(role: NonNullable<User['role']>, inputVal: string, provider?: 'Ecobank' | 'Google'): User {
  const isPhone = /^\+?[0-9\s-]{7,15}$/.test(inputVal);
  const fallbackEmail = {
    customer: 'customer@ecobank-insurance.com',
    agent: 'amina.agent@ecobank.com',
    ops: 'operations.control@ecobank.com',
    admin: 'platform.admin@ecobank.com',
  }[role];
  const fallbackName = {
    customer: 'Valued Customer',
    agent: 'Amina RM',
    ops: 'Operations Control',
    admin: 'Platform Admin',
  }[role];

  const email = provider === 'Ecobank'
    ? fallbackEmail
    : provider === 'Google'
      ? 'google.partner@ecobank-insurance.com'
      : isPhone
        ? fallbackEmail
        : inputVal;

  const derivedName = isPhone || provider
    ? fallbackName
    : inputVal.split('@')[0].replace(/[._-]/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    email,
    name: derivedName || fallbackName,
    isLoggedIn: true,
    phone: isPhone ? inputVal : undefined,
    role,
  };
}

export default function LoginModal({ isOpen, onClose, onSuccess, initialRole = 'customer' }: LoginModalProps) {
  const [inputVal, setInputVal] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<NonNullable<User['role']>>(initialRole || 'customer');

  useEffect(() => {
    if (isOpen) setSelectedRole(initialRole || 'customer');
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      setErrorText('Please enter your email or phone number');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(getRoleIdentity(selectedRole, inputVal));
      onClose();
    }, 1000);
  };

  const handleOAuthLogin = (provider: 'Ecobank' | 'Google') => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(getRoleIdentity(selectedRole, inputVal, provider));
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2rem] p-8 sm:p-10 flex flex-col shadow-2xl mx-4 relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-primary transition-colors focus:outline-none p-1.5 hover:bg-gray-100 rounded-full"
          id="login-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Banner */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-sans text-2xl font-bold text-gray-900" id="login-welcome-title">Sign in</h2>
          <p className="text-gray-500 text-sm text-center mt-2 px-2">
            Access your Ecobank insurance policies, claims, and renewals.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6 rounded-2xl bg-gray-50 p-1" id="login-role-selector">
          {ROLE_OPTIONS.map(option => (
            <button
              key={option.role}
              type="button"
              onClick={() => setSelectedRole(option.role)}
              className={`text-left rounded-xl border px-3 py-2.5 transition-all ${
                selectedRole === option.role
                  ? 'border-primary bg-white text-primary shadow-sm'
                  : 'border-transparent text-gray-500 hover:text-primary'
              }`}
            >
              <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide">
                {option.icon}
                {option.label}
              </span>
              <span className="block mt-0.5 text-[10px] leading-snug text-gray-500">{option.helper}</span>
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5" id="login-manual-form">
          <div className="space-y-2">
            <label className="font-semibold text-xs sm:text-sm text-gray-600 block pl-1">
              Email Address or Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  if (errorText) setErrorText('');
                }}
                placeholder="Enter email or phone"
                className="w-full h-14 px-5 pr-11 bg-gray-50 border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400 font-sans text-sm font-medium"
                id="login-email-phone-input"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {inputVal.includes('@') ? <Mail className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
              </span>
            </div>
            {errorText && <p className="text-xs text-error font-semibold pl-1">{errorText}</p>}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-primary text-white rounded-2xl font-semibold hover:bg-primary-container active:scale-[0.98] transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
            id="login-submit-btn"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8" id="login-divider">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-gray-400 font-bold tracking-widest text-[10px]">
              Or continue with
            </span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-4" id="login-oauth-grid">
          <button
            onClick={() => handleOAuthLogin('Ecobank')}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all text-xs sm:text-sm font-semibold text-gray-700"
            id="login-ecobank-oauth-btn"
          >
            <img 
              src={METADATA_IMAGES.ecobankLogo} 
              alt="Ecobank" 
              className="h-[14px] w-auto object-contain"
            />
            <span>Ecobank</span>
          </button>
          
          <button
            onClick={() => handleOAuthLogin('Google')}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all text-xs sm:text-sm font-semibold text-gray-700"
            id="login-google-oauth-btn"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span>Google</span>
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          By signing up, you agree to our 
          <a href="#terms" className="text-primary underline font-semibold ml-1">Terms of Service</a>
        </p>
      </div>
    </div>
  );
}
