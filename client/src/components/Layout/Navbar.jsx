import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 glass-card sticky top-0 z-50 px-6 flex items-center justify-between border-b border-indigo-100/50 block">
      <div className="flex items-center gap-2 text-indigo-700">
        <Shield className="w-8 h-8" />
        <span className="text-xl font-bold tracking-tight">AccessGuard</span>
      </div>
      
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
            <button 
              onClick={logout}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 hover:text-red-500"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="px-5 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition hover:shadow-lg hover:shadow-indigo-500/30">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
