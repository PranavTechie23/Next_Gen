import { useTheme } from '@/contexts/ThemeContext';
import { ClipboardList } from 'lucide-react';

export default function AdminAssessments() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-[80vh] flex flex-col items-center justify-center p-6 relative overflow-hidden ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {/* Premium Background Glows */}
      {isDark && (
        <div className="premium-glow-bg">
          <div className="premium-glow-1" />
          <div className="premium-glow-2" />
          <div className="premium-glow-3" />
        </div>
      )}

      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl ${isDark ? 'bg-blue-500/20 text-blue-400 border border-white/10' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
        <ClipboardList className="w-10 h-10" />
      </div>

      <h1 className="text-4xl font-black mb-4 tracking-tight">Assessments Management</h1>
      <p className={`text-lg font-medium max-w-md text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        We're building a comprehensive assessment platform for your institutions. Coming soon!
      </p>

      <div className="mt-12 flex gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`w-3 h-3 rounded-full animate-pulse ${isDark ? 'bg-blue-500/30' : 'bg-blue-200'}`} style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );
}
