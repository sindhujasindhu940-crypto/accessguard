import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, FileText, CheckCircle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    totalRequestsToday: 0,
    pendingApprovals: 0,
    activeVisitors: 0,
    totalExitsToday: 0
  });
  const [activeLogs, setActiveLogs] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://localhost:5000/api/analytics/metrics', config);
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching metrics", error);
      }
    };

    const fetchActiveLogs = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://localhost:5000/api/tracking/active', config);
        setActiveLogs(data);
      } catch (err) {
        console.error("Error fetching logs", err);
      }
    };

    fetchMetrics();
    fetchActiveLogs();
  }, []);

  const MetricCard = ({ title, value, icon: Icon, colorClass, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-6 rounded-2xl relative overflow-hidden"
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 ${colorClass}`} />
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 text-sm font-semibold mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass} bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 relative">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Overview</h1>
        <p className="text-slate-500">Welcome back, {user?.name}. Here's what's happening today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Requests Today" 
          value={metrics.totalRequestsToday} 
          icon={FileText} 
          colorClass="bg-indigo-500 text-indigo-600" 
          delay={0.1} 
        />
        <MetricCard 
          title="Pending Approvals" 
          value={metrics.pendingApprovals} 
          icon={CheckCircle} 
          colorClass="bg-amber-500 text-amber-600" 
          delay={0.2} 
        />
        <MetricCard 
          title="Active Inside Campus" 
          value={metrics.activeVisitors} 
          icon={Users} 
          colorClass="bg-emerald-500 text-emerald-600" 
          delay={0.3} 
        />
        <MetricCard 
          title="Total Exits Today" 
          value={metrics.totalExitsToday} 
          icon={LogOut} 
          colorClass="bg-cyan-500 text-cyan-600" 
          delay={0.4} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Placeholder for Daily Trends Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 h-96 flex flex-col relative overflow-hidden">
           <h3 className="text-lg font-bold text-slate-800 mb-4">Visitor Traffic Trends</h3>
           <div className="flex-1 border-t border-slate-100 flex items-end justify-between px-4 pb-2 pt-8 gap-2">
             {/* Mock Chart Bars */}
             {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
               <motion.div 
                 key={i}
                 initial={{ height: 0 }}
                 animate={{ height: `${h}%` }}
                 transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                 className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm"
               />
             ))}
           </div>
           <div className="flex justify-between text-xs text-slate-400 px-4 mt-2">
             <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
           </div>
        </div>

        {/* Recent Activity Panel */}
        <div className="glass-card rounded-2xl p-6 h-96 overflow-y-auto">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity Logs</h3>
          <div className="space-y-4">
            {activeLogs.length === 0 ? (
              <p className="text-slate-500 text-sm">No recent active visitors.</p>
            ) : (
              activeLogs.map((log) => (
                <div key={log._id} className="flex gap-4 items-start p-3 rounded-lg hover:bg-slate-50 transition">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{log.passId?.requestId?.visitorName || 'Unknown Visitor'}</p>
                    <p className="text-xs text-slate-500">Checked in at Campus.</p>
                    <p className="text-xs text-emerald-600 mt-1">{new Date(log.checkInTime).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
