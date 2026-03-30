import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserCheck, QrCode, TrendingUp, Lock, CheckCircle, ChevronRight, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="glass-card p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300"
  >
    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-[200vh]">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-medium mb-8"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Next-Generation College Security</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight max-w-4xl"
        >
          Secure, Smart & Digital <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
            Visitor Management
          </span>
          <br/> for Colleges
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl"
        >
          Replace manual logbooks with a seamless digital platform. Pre-register visitors, generate QR passes, and track campus entry/exit in real-time.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {user ? (
            user.role === 'Visitor' ? (
              <Link to="/visitor/dashboard" className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2">
                View Request Status <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link to={user.role === 'Admin' ? '/dashboard' : user.role === 'Faculty' ? '/faculty/requests' : '/security/scan'} className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2">
                Go to Dashboard <ChevronRight className="w-5 h-5" />
              </Link>
            )
          ) : (
            <>
              <Link to="/login" className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2">
                Register as Visitor <ChevronRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="px-8 py-4 rounded-xl glass-card text-slate-700 font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Staff / Faculty Login
              </Link>
            </>
          )}
        </motion.div>

        {/* Floating 3D Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
          className="mt-20 relative w-full max-w-5xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent z-10 pointer-events-none h-full w-full" style={{ top: '60%' }} />
          <div className="glass-card rounded-2xl p-4 border border-white/40 shadow-2xl relative overflow-hidden bg-white/40">
            <div className="flex gap-2 mb-4 px-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 p-6 rounded-xl shadow-sm text-left">
                <p className="text-slate-500 text-sm font-semibold">Total Requests</p>
                <p className="text-3xl font-bold text-indigo-600">1,248</p>
              </div>
              <div className="bg-white/80 p-6 rounded-xl shadow-sm text-left">
                <p className="text-slate-500 text-sm font-semibold">Active Visitors</p>
                <p className="text-3xl font-bold text-emerald-500">42</p>
              </div>
              <div className="bg-white/80 p-6 rounded-xl shadow-sm text-left">
                <p className="text-slate-500 text-sm font-semibold">Pending Approvals</p>
                <p className="text-3xl font-bold text-amber-500">7</p>
              </div>
            </div>
            <div className="mt-6 bg-white/80 h-64 rounded-xl shadow-sm flex flex-col justify-end p-6 gap-2 text-left relative overflow-hidden">
               <h3 className="text-lg font-bold text-slate-800 mb-4 absolute top-6 left-6">Visitor Traffic Trends</h3>
               <div className="flex items-end gap-4 h-40 w-full mt-10">
                 {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                   <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t-md opacity-80" />
                 ))}
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-slate-600 text-lg">Everything you need to secure your campus.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={QrCode}
            title="Digital QR Passes"
            description="Instantly generate and email dynamic QR code passes to approved visitors for seamless scanning at the gate."
            delay={0.1}
          />
          <FeatureCard 
            icon={UserCheck}
            title="Host Authorization"
            description="Faculty and staff can review visitor requests and approve or reject them directly from their dashboard."
            delay={0.2}
          />
          <FeatureCard 
            icon={Lock}
            title="Real-time Tracking"
            description="Security staff can monitor exactly who is on campus at any given moment with live entry and exit logs."
            delay={0.3}
          />
          <FeatureCard 
            icon={TrendingUp}
            title="Analytics & Reports"
            description="Generate detailed daily, weekly, or department-wise reports to analyze visitor trends."
            delay={0.4}
          />
          <FeatureCard 
            icon={Users}
            title="Role-Based Access"
            description="Secure system with distinct portals for Admins, Security, Faculty, and Visitors."
            delay={0.5}
          />
          <FeatureCard 
            icon={CheckCircle}
            title="Pre-registration"
            description="Visitors can request access ahead of time, reducing wait times at the security gate."
            delay={0.6}
          />
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-indigo-100/50 py-12 px-6 mt-20 relative z-10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-slate-500">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <span className="font-semibold text-slate-800">AccessGuard System</span>
          </div>
          <p>&copy; 2026 AccessGuard Digital Visitor Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
