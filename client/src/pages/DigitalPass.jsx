import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { QrCode, Calendar, Clock, MapPin, User, Building, Printer, ChevronLeft } from 'lucide-react';

const DigitalPass = () => {
  const { passId } = useParams();
  const [passData, setPassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app we would fetch the pass without auth if it's a public link, 
    // or with auth if accessed from dashboard. Here we use the scan endpoint.
    const fetchPass = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`http://localhost:5000/api/tracking/scan/${passId}`, config);
        setPassData(data.pass);
      } catch (error) {
        console.error(error);
        // Mock fallback for preview purposes
        setTimeout(() => {
          setPassData({
            passId: passId || 'A2B4C6',
            validUntil: new Date(new Date().setHours(18,0,0,0)).toISOString(),
            status: 'Active',
            requestId: {
              visitorName: 'Jane Doe',
              purpose: 'Project Meeting',
              department: { name: 'Computer Science' },
              hostId: { name: 'Dr. Alan Turing' }
            }
          });
          setLoading(false);
        }, 1000);
      } finally {
        setLoading(false);
      }
    };
    fetchPass();
  }, [passId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!passData) {
    return <div className="text-center p-20 text-red-500 font-bold">Pass not found</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative bg-slate-900">
      {/* Background for pass mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-900 flex justify-center py-10">
        <div className="absolute top-0 w-full h-[50%] bg-gradient-to-b from-indigo-900/40 to-transparent" />
        <div className="absolute bottom-[-20%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]" />
      </div>

      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-indigo-200 hover:text-white mb-6 font-medium transition">
          <ChevronLeft className="w-5 h-5"/> Back
        </Link>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-[2rem] overflow-hidden shadow-2xl relative"
        >
          {/* Card Header Layer */}
          <div className="bg-indigo-600 p-8 text-center text-white relative">
             <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
               {passData.status}
             </div>
             <h2 className="text-sm font-semibold uppercase tracking-widest text-indigo-200 mb-2">Visitor Pass</h2>
             <h1 className="text-3xl font-extrabold">{passData.requestId.visitorName}</h1>
             <p className="text-indigo-200 mt-1">{passData.requestId.purpose}</p>
          </div>

          {/* Card Body */}
          <div className="p-8 pb-4 relative">
             {/* Cutouts */}
             <div className="absolute top-0 left-0 -ml-4 -mt-4 w-8 h-8 bg-slate-900 rounded-full" />
             <div className="absolute top-0 right-0 -mr-4 -mt-4 w-8 h-8 bg-slate-900 rounded-full" />
             <div className="absolute top-0 left-4 right-4 border-t-2 border-dashed border-indigo-200" />

             <div className="grid grid-cols-2 gap-6 mb-8 mt-4">
               <div>
                 <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1"><User className="w-3 h-3"/> Host</p>
                 <p className="font-bold text-slate-800">{passData.requestId.hostId?.name}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1"><Building className="w-3 h-3"/> Department</p>
                 <p className="font-bold text-slate-800">{passData.requestId.department?.name}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Date</p>
                 <p className="font-bold text-slate-800">{new Date(passData.validUntil).toLocaleDateString()}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Valid Until</p>
                 <p className="font-bold text-slate-800">{new Date(passData.validUntil).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
               </div>
             </div>

             <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
               {/* Mock QR Code visual block */}
               <div className="w-48 h-48 bg-white border-2 border-slate-200 rounded-xl p-2 shadow-sm flex items-center justify-center relative">
                 <QrCode className="w-full h-full text-slate-800" strokeWidth={1}/>
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-lg pointer-events-none" />
               </div>
               <p className="mt-4 font-mono font-bold text-lg tracking-[0.2em] text-slate-700">{passData.passId}</p>
             </div>
          </div>

          <div className="p-6 bg-slate-50 text-center border-t border-slate-100 flex justify-center">
            <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-900 transition">
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DigitalPass;
