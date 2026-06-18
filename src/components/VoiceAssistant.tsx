import React, { useState, useEffect } from 'react';
import { Mic, X, Sparkles, MessageSquare } from 'lucide-react';
import { VOICE_RESPONSES } from '../data';
import { InsuranceCategory } from '../types';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onActionTriggered: (category: InsuranceCategory, initialPlate?: string) => void;
}

export default function VoiceAssistant({ isOpen, onClose, onActionTriggered }: VoiceAssistantProps) {
  const [speechText, setSpeechText] = useState('How can we help protect what you love?');
  const [typedInput, setTypedInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState([
    '"Cover my car UBM 492X"',
    '"Find health insurance for my family"',
    '"Protect my iPhone screen"',
    '"I need life insurance cover"'
  ]);

  useEffect(() => {
    if (isOpen) {
      setSpeechText('Listening... State what you need covered.');
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProcessInput = (input: string) => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setSpeechText(`Analyzing: "${input}"`);

    setTimeout(() => {
      let matched = false;
      
      // Look for custom license plate matches
      const plateMatch = input.match(/\b(UBM\s*492X|UBA\s*123Z|UAS\s*999K)\b/i);
      const generalPlate = input.match(/\b[A-Z]{3}\s*\d{3}[A-Z]\b/i);
      const parsedPlate = plateMatch ? plateMatch[0].toUpperCase() : (generalPlate ? generalPlate[0].toUpperCase() : undefined);

      for (const resp of VOICE_RESPONSES) {
        if (resp.match.test(input)) {
          setSpeechText(`🚀 Assistant: "${resp.text}"`);
          matched = true;
          
          setTimeout(() => {
            onActionTriggered(resp.action as InsuranceCategory, parsedPlate);
            onClose();
          }, 1500);
          break;
        }
      }

      if (!matched) {
        // Default lookup for other things: pick Motor if a plate is mentioned, otherwise guess based on words
        if (parsedPlate) {
          setSpeechText(`🚀 Assistant: "I registered a license plate lookup request for ${parsedPlate}. Directing you to Motor Insurance onboarding..."`);
          setTimeout(() => {
            onActionTriggered('Motor' as InsuranceCategory, parsedPlate);
            onClose();
          }, 1800);
        } else {
          setSpeechText(`Assistant: "I heard your request, and I'm matching you with the Health care packages for optimal safety. Loading..."`);
          setTimeout(() => {
            onActionTriggered('Health' as InsuranceCategory);
            onClose();
          }, 1800);
        }
      }
    }, 1200);
  };

  const submitTyping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    const text = typedInput;
    setTypedInput('');
    handleProcessInput(text);
  };

  return (
    <div className="fixed inset-0 z-100 bg-gray-950/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 flex flex-col items-center shadow-2xl relative animate-in slide-in-from-bottom-12 duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-primary transition-colors focus:outline-none p-1.5 hover:bg-gray-100 rounded-full"
          id="voice-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pulse Micro Animation */}
        <div className="relative mb-8 mt-4">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-0 bg-primary/15 rounded-full animate-pulse" style={{ animationDuration: '1.5s' }}></div>
          <div className="relative bg-primary text-white p-6 rounded-full shadow-xl">
            <Mic className="w-10 h-10 animate-pulse" />
          </div>
        </div>

        {/* Conversation State */}
        <div className="text-center w-full mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            24/7 Voice Assistant
          </span>
          <h3 className="font-sans text-xl font-bold text-gray-900 h-14 overflow-hidden flex items-center justify-center px-2">
            {speechText}
          </h3>
          <p className="text-xs text-gray-400 mt-1">Speak clearly or choose a recommended prompt below.</p>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="w-full space-y-2 mb-8">
          <p className="text-left font-bold text-gray-400 text-[10px] uppercase tracking-wider pl-1">Suggested prompts</p>
          <div className="grid grid-cols-1 gap-2" id="voice-suggestions">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isProcessing}
                onClick={() => handleProcessInput(sug.replace(/"/g, ''))}
                className="w-full py-3 px-4 bg-gray-50 hover:bg-primary/5 hover:text-primary border border-gray-100 rounded-xl font-sans text-xs sm:text-sm font-medium text-gray-600 text-left transition-all active:scale-[0.98] flex items-center justify-between group"
              >
                <span>{sug}</span>
                <MessageSquare className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Direct Text Fallback Search Input */}
        <form onSubmit={submitTyping} className="w-full relative flex items-center h-12 mb-4">
          <input
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            disabled={isProcessing}
            placeholder="Or type what you need covered..."
            className="w-full h-full pl-4 pr-11 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400 font-sans text-xs sm:text-sm font-medium"
            id="voice-keyboard-input"
          />
          <button
            type="submit"
            disabled={isProcessing}
            className="absolute right-2 p-1.5 bg-primary text-white hover:bg-primary-container rounded-lg transition-transform active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </form>

        <button
          onClick={onClose}
          className="w-full py-4 bg-gray-100 font-semibold text-gray-700 hover:bg-gray-200 rounded-full active:scale-95 transition-all text-sm shadow-xs"
          id="voice-cancel-btn"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}
