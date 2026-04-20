import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const { data } = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${userInfo?.token}` }
        });
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900">User Management</h1>
      <div className="glass-card p-6 rounded-2xl overflow-x-auto bg-white shadow">
        {loading ? <p>Loading users...</p> : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="p-3 font-semibold text-slate-700">Name</th>
                <th className="p-3 font-semibold text-slate-700">Email</th>
                <th className="p-3 font-semibold text-slate-700">Role</th>
                <th className="p-3 font-semibold text-slate-700">Department</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3 text-slate-500">{u.email}</td>
                  <td className="p-3"><span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold">{u.role}</span></td>
                  <td className="p-3 text-slate-600">{u.department?.name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
