import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'md', text }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      {text && <span className="text-sm text-slate-400 font-medium">{text}</span>}
    </div>
  );
}
