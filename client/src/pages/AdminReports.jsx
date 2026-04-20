import { useState, useEffect } from 'react';
import axios from 'axios';
import { Download } from 'lucide-react';

const AdminReports = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const { data } = await axios.get('http://localhost:5000/api/tracking/active', {
          headers: { Authorization: `Bearer ${userInfo?.token}` }
        });
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-900">System Reports</h1>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition" 
          onClick={() => alert("Report generation module coming soon!")}
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>
      <div className="glass-card p-6 rounded-2xl overflow-x-auto bg-white shadow">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Active Visitors Log</h2>
        {loading ? <p>Loading logs...</p> : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="p-3 font-semibold text-slate-700">Visitor</th>
                <th className="p-3 font-semibold text-slate-700">Check-In Time</th>
                <th className="p-3 font-semibold text-slate-700">Host (Faculty)</th>
                <th className="p-3 font-semibold text-slate-700">Gate Checked</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan="4" className="p-4 text-center text-slate-500">No active visitors found.</td></tr>
              ) : logs.map(log => (
                <tr key={log._id} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-medium">{log.passId?.requestId?.visitorName || 'Unknown'}</td>
                  <td className="p-3 text-emerald-600 font-medium">{new Date(log.checkInTime).toLocaleString()}</td>
                  <td className="p-3">{log.passId?.requestId?.hostFaculty?.name || 'Unknown'}</td>
                  <td className="p-3 text-slate-500">{log.checkedInBy?.name || 'Security'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
