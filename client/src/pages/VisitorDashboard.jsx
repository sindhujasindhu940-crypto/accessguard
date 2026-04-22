import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Clock, CheckCircle, XCircle, QrCode, Calendar, Building, User } from 'lucide-react';

const VisitorDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://localhost:5000/api/visitors/my-requests', config);
        setRequests(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch your visit requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approved':
        return <span className="px-3 py-1 flex items-center gap-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase"><CheckCircle className="w-3 h-3"/> Approved</span>;
      case 'Rejected':
        return <span className="px-3 py-1 flex items-center gap-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase"><XCircle className="w-3 h-3"/> Denied</span>;
      default:
        return <span className="px-3 py-1 flex items-center gap-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase"><Clock className="w-3 h-3"/> Under Review</span>;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Visitor Portal</h1>
          <p className="text-slate-500">Welcome back, {user?.name}. Track your campus visit requests here.</p>
        </div>
        <Link to="/visitor-request" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 whitespace-nowrap">
          <Plus className="w-5 h-5"/> New Request
        </Link>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card h-64 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl border border-dashed border-slate-300">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No Visit Requests Found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">You haven't made any requests to visit the campus yet. Create a new request to get started.</p>
          <Link to="/visitor-request" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all">
            <Plus className="w-5 h-5"/> Register a Visit
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req, index) => (
            <motion.div 
              key={req._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  {getStatusBadge(req.status)}
                  <span className="text-xs text-slate-400 font-medium">{new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1">{req.purpose}</h3>
                
                <div className="space-y-2 mt-4 text-sm text-slate-600">
                  <p className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg"><User className="w-4 h-4 text-slate-400"/> <span className="font-semibold text-slate-700">Host:</span> {req.hostId?.name}</p>
                  <p className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg"><Building className="w-4 h-4 text-slate-400"/> <span className="font-semibold text-slate-700">Dept:</span> {req.department?.name}</p>
                  <p className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg"><Calendar className="w-4 h-4 text-slate-400"/> <span className="font-semibold text-slate-700">Visit:</span> {new Date(req.visitDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
              </div>

              {req.status === 'Approved' && req.pass && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link to={`/pass/${req.pass.passId}`} className="w-full py-3 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all flex justify-center items-center gap-2 group">
                    <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform"/> View & Download Pass
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VisitorDashboard;
