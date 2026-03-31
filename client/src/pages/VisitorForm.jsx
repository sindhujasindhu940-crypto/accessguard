import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const VisitorForm = () => {
  const { user } = useAuth();
  const [facultyList, setFacultyList] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(true);

  const [formData, setFormData] = useState({
    visitorName: user?.name || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    purpose: '',
    hostId: '',
    department: '',
    visitDate: '',
    idProofType: 'AadharCard',
    idProofNumber: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setFacultyLoading(true);
        const { data } = await axios.get(`${API_BASE_URL}/api/users/faculty`);
        setFacultyList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching faculty:', err);
        setError(
          err.response?.data?.message ||
            'Unable to load faculty list. Please ensure backend server is running.'
        );
      } finally {
        setFacultyLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const selectedHost = facultyList.find((f) => f._id === formData.hostId);

      if (!selectedHost) {
        throw new Error('Please select a valid host');
      }

      if (!selectedHost.department?._id) {
        throw new Error('Selected faculty does not have a department assigned');
      }

      const submitData = {
        ...formData,
        department: selectedHost.department._id
      };

      await axios.post(`${API_BASE_URL}/api/visitors/request`, submitData);

      setSuccess(true);
      setFormData({
        visitorName: user?.name || '',
        mobile: user?.mobile || '',
        email: user?.email || '',
        purpose: '',
        hostId: '',
        department: '',
        visitDate: '',
        idProofType: 'AadharCard',
        idProofNumber: ''
      });
    } catch (err) {
      console.error('Submit error:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Error submitting request'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 md:p-10 rounded-3xl text-center max-w-lg w-full bg-white/80 shadow-2xl"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Request Submitted Successfully!
          </h2>
          <p className="text-slate-600 mb-8">
            Your visit request has been sent to the host. You will receive a
            digital QR pass via email once approved.
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 relative z-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 md:p-12 shadow-2xl bg-white/70 backdrop-blur-xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Visitor Pre-Registration
          </h1>
          <p className="text-slate-500 mt-2">
            Fill out the form below to request access to the college campus.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={formData.visitorName}
                  onChange={(e) => handleChange('visitorName', e.target.value)}
                  readOnly={!!user}
                  className={`w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none ${user ? 'bg-slate-100 text-slate-500' : 'bg-white/50'}`}
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  readOnly={!!user}
                  className={`w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none ${user ? 'bg-slate-100 text-slate-500' : 'bg-white/50'}`}
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">ID Proof Type</label>
              <select
                value={formData.idProofType}
                onChange={(e) => handleChange('idProofType', e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="AadharCard">Aadhar Card</option>
                <option value="DrivingLicense">Driving License</option>
                <option value="Passport">Passport</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">ID Proof Number</label>
              <input
                type="text"
                required
                value={formData.idProofNumber}
                onChange={(e) => handleChange('idProofNumber', e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter ID number"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Person to Meet (Host)</label>
              <div className="relative">
                <Building className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                <select
                  required
                  value={formData.hostId}
                  onChange={(e) => handleChange('hostId', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                  disabled={facultyLoading}
                >
                  <option value="">
                    {facultyLoading ? 'Loading faculty...' : 'Select Faculty/Staff'}
                  </option>
                  {facultyList.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name} ({f.department?.name || 'No Department'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Date & Time of Visit</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="datetime-local"
                  required
                  value={formData.visitDate}
                  onChange={(e) => handleChange('visitDate', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Purpose of Visit</label>
              <div className="relative">
                <FileText className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                <textarea
                  required
                  rows="5"
                  value={formData.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Describe the reason for your visit..."
                />
              </div>
            </div>

            <button
              disabled={loading || facultyLoading || facultyList.length === 0}
              type="submit"
              className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/30 transition-all shadow-lg shadow-indigo-500/30 flex justify-center items-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VisitorForm;