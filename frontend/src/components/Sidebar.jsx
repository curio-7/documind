import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Search, BrainCircuit } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/chat', icon: MessageSquare, label: 'Chat' },
    { to: '/search', icon: Search, label: 'Search' },
  ];

  return (
    <div className="w-[260px] bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 text-blue-500 mb-2">
          <BrainCircuit size={28} />
          <h1 className="text-xl font-bold text-slate-100">DocuMind</h1>
        </div>
        <p className="text-xs text-slate-400">AI Document Intelligence</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600/10 text-blue-500 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 text-center text-xs text-slate-500">
        Powered by Ollama
      </div>
    </div>
  );
}
