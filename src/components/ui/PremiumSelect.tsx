import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface PremiumSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PremiumSelect({ value, options, onChange, disabled = false }: PremiumSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className={cn("relative w-36 ml-auto", disabled && "opacity-40 cursor-not-allowed")} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl",
          "bg-black/20 border border-white/5 backdrop-blur-xl shadow-sm",
          "text-white/80 text-sm font-medium tracking-wide",
          "transition-all duration-300 ease-out",
          "hover:bg-white/5 hover:border-white/10 hover:text-white",
          "focus:outline-none focus:border-[#6c63ff]/30 focus:shadow-[0_0_12px_rgba(108,99,255,0.15)]",
          isOpen && "border-white/10 bg-white/5 shadow-[0_0_12px_rgba(108,99,255,0.1)] text-white"
        )}
      >
        <span className="flex items-center gap-2 whitespace-nowrap">
          {selectedOption.icon}
          {selectedOption.label}
        </span>
        <ChevronDown 
          className={cn(
            "w-4 h-4 text-white/40 transition-transform duration-300 shrink-0",
            isOpen && "transform rotate-180 text-white/80"
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      <div 
        className={cn(
          "absolute top-[calc(100%+6px)] right-0 w-44 rounded-xl overflow-hidden",
          "bg-[#0a0a12]/90 backdrop-blur-xl border border-white/5",
          "shadow-[0_16px_40px_-8px_rgba(0,0,0,0.8)] shadow-[#6c63ff]/10",
          "transition-all duration-200 origin-top",
          isOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        )}
        style={{ zIndex: 9999 }}
      >
        <div className="p-1 flex flex-col gap-0.5">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg",
                "text-sm font-medium text-left transition-colors duration-150",
                value === option.value 
                  ? "bg-white/10 text-white" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="flex items-center gap-2 whitespace-nowrap">
                {option.icon}
                {option.label}
              </span>
              {value === option.value && (
                <Check className="w-4 h-4 text-[#6c63ff] shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
