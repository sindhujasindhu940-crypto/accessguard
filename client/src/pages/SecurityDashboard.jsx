import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { QrCode, Search, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SecurityDashboard = () => {
  const [passId, setPassId] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [activeLogs, setActiveLogs] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchActiveLogs();
  }, []);

  const fetchActiveLogs = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/tracking/active', config);
      setActiveLogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    setError('');
    setScanResult(null);
    try {
      const { data } = await axios.get(`http://localhost:5000/api/tracking/scan/${passId}`, config);
      setScanResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Pass not found or invalid');
    }
  };

  const handleCheckIn = async (id) => {
    try {
      await axios.post('http://localhost:5000/api/tracking/checkin', { passId: id }, config);
      setScanResult(null);
      setPassId('');
      fetchActiveLogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Error checking in');
    }
  };

  const handleCheckOut = async (logId) => {
    try {
      await axios.put(`http://localhost:5000/api/tracking/checkout/${logId}`, {}, config);
      fetchActiveLogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Security Terminal</h1>
          <p className="text-slate-500">Scan passes and monitor campus entry/exit points.</p>
        </div>
        <Link to="/visitor-request" className="px-5 py-2.5 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 shadow-md transition">
          Register Walk-in Visitor
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Panel */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden bg-white/70 shadow-2xl">
           <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><QrCode className="text-indigo-600" /> Verify Visitor Pass</h2>
           <form onSubmit={handleScan} className="flex gap-4">
              <input 
                type="text" 
                placeholder="Enter Pass ID (e.g. A2B4C6)" 
                value={passId}
                onChange={(e) => setPassId(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                required
              />
              <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium flex gap-2 items-center hover:bg-indigo-700 transition">
                <Search className="w-5 h-5"/> Scan
              </button>
           </form>

           {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}

           {scanResult && scanResult.pass && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h3 className="text-2xl font-bold text-slate-800">{scanResult.pass.requestId.visitorName}</h3>
                   <p className="text-slate-600">{scanResult.pass.requestId.purpose}</p>
                 </div>
                 <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">Valid Pass</span>
               </div>
               
               <div className="space-y-2 mb-6 text-sm text-slate-600">
                 <p><span className="font-semibold text-slate-800">Pass ID:</span> {scanResult.pass.passId}</p>
                 <p><span className="font-semibold text-slate-800">Host:</span> {scanResult.pass.requestId.hostId?.name}</p>
                 <p><span className="font-semibold text-slate-800">Valid Until:</span> {new Date(scanResult.pass.validUntil).toLocaleString()}</p>
               </div>

               {scanResult.activeLog ? (
                 <button onClick={() => handleCheckOut(scanResult.activeLog._id)} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition">
                   Check Out Visitor
                 </button>
               ) : (
                 <button onClick={() => handleCheckIn(scanResult.pass._id)} className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition flex justify-center gap-2 items-center">
                   <Clock className="w-5 h-5" /> Grant Entry / Check-In
                 </button>
               )}
             </motion.div>
           )}
        </div>

        {/* Active Visitors */}
        <div className="glass-card rounded-3xl p-8 bg-white/70 shadow-2xl flex flex-col h-[600px]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CheckCircle className="text-emerald-500" /> Currently Inside Campus ({activeLogs.length})</h2>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {activeLogs.length === 0 ? (
              <p className="text-slate-500 text-center mt-10">No visitors currently inside the campus.</p>
            ) : (
              activeLogs.map(log => (
                <div key={log._id} className="p-4 rounded-xl border border-slate-100 bg-white hover:shadow-md transition flex justify-between items-center group">
                  <div>
                    <h4 className="font-bold text-slate-800">{log.passId?.requestId?.visitorName || 'Unknown Visitor'}</h4>
                    <p className="text-xs text-slate-500">Pass: {log.passId?.passId}</p>
                    <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> In since {new Date(log.checkInTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <button onClick={() => handleCheckOut(log._id)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-800 hover:text-white transition">
                    Checkout
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
