import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Clock, QrCode, FileText, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getLinks = () => {
    const role = user?.role;
    const base = [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }];
    
    if (role === 'Admin') {
      return [...base, { name: 'Users', path: '/admin/users', icon: Users }, { name: 'Reports', path: '/admin/reports', icon: FileText }];
    }
    if (role === 'Security') {
      return [...base, { name: 'Scan Pass', path: '/security/scan', icon: QrCode }, { name: 'Active Logs', path: '/security/logs', icon: Clock }];
    }
    if (role === 'Faculty') {
      return [...base, { name: 'Requests', path: '/faculty/requests', icon: FileText }];
    }
    return base;
  };

  const links = getLinks();

  return (
    <aside className="w-64 glass-card border-r border-indigo-100/50 hidden md:flex flex-col">
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link key={link.name} to={link.path} className="block relative">
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-indigo-50 rounded-xl border border-indigo-100/50"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors z-10 ${isActive ? 'text-indigo-700 font-semibold' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'}`}>
                <link.icon className="w-5 h-5" />
                <span>{link.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
