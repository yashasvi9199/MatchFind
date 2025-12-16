import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

// --- Styled Label ---
interface LabelProps {
  children: ReactNode;
  className?: string;
}

export function Label({ children, className = '' }: LabelProps) {
  return (
    <label className={`block text-sm font-semibold text-gray-600 mb-1.5 tracking-wide ${className}`}>
      {children}
    </label>
  );
}

// --- Styled Input ---
type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  return (
    <input 
      {...props}
      className={`w-full rounded-xl border border-gray-200 p-3 text-sm transition-all focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 bg-white shadow-sm disabled:bg-gray-50 disabled:text-gray-400 ${props.className || ''}`} 
    />
  );
}

// --- Styled Select ---
type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select(props: SelectProps) {
  return (
    <select 
      {...props}
      className={`w-full rounded-xl border border-gray-200 p-3 text-sm transition-all focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 bg-white shadow-sm disabled:bg-gray-50 disabled:text-gray-400 ${props.className || ''}`} 
    >
      {props.children}
    </select>
  );
}

// --- Section Title ---
interface SectionTitleProps {
  children: ReactNode;
  icon?: ReactNode;
}

export function SectionTitle({ children, icon }: SectionTitleProps) {
  return (
    <h3 className="text-xl font-bold text-rose-700 mb-6 pb-2 border-b-2 border-rose-100 flex items-center gap-2">
      {icon}
      {children}
    </h3>
  );
}
