import { useEffect, useState } from 'react';
import axios from 'axios';

const FacultyDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchRequests = async () => {
    try {
      setLoading(true);

      if (!userInfo?.token) {
        setError('Please login again');
        setLoading(false);
        return;
      }

      const res = await axios.get('http://localhost:5000/api/visitors/host', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      });

      setRequests(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      if (!userInfo?.token) {
        setError('Please login again');
        return;
      }

      await axios.put(
        `http://localhost:5000/api/visitors/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      fetchRequests();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update request');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Faculty Dashboard</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No visitor requests found.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="border rounded-xl p-4 shadow-sm bg-white"
            >
              <h2 className="font-semibold text-lg">{request.visitorName}</h2>

              <p><strong>Mobile:</strong> {request.mobile}</p>
              <p><strong>Email:</strong> {request.email || 'N/A'}</p>
              <p><strong>Purpose:</strong> {request.purpose}</p>
              <p><strong>Visit Date:</strong> {new Date(request.visitDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {request.status}</p>
              <p><strong>ID Proof:</strong> {request.idProofType} - {request.idProofNumber}</p>
              <p><strong>Department:</strong> {request.department?.name || 'N/A'}</p>

              {request.status === 'Pending' && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => updateStatus(request._id, 'Approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(request._id, 'Rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;