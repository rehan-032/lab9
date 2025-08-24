import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = ({ refreshTrigger }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch {
      alert('Delete failed');
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading users...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  if (users.length === 0)
    return <p className="text-center text-gray-600">No users registered yet.</p>;

  return (
    <div className="overflow-x-auto rounded border border-indigo-300 shadow-sm">
      <table className="w-full table-auto border-collapse text-gray-700">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="border px-4 py-3 text-left">Name</th>
            <th className="border px-4 py-3 text-left">Email</th>
            <th className="border px-4 py-3 text-left">Phone</th>
            <th className="border px-4 py-3 text-center">Profile Picture</th>
            <th className="border px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, name, email, phone, profile_picture }) => (
            <tr key={id} className="hover:bg-indigo-50">
              <td className="border px-4 py-3">{name}</td>
              <td className="border px-4 py-3">{email}</td>
              <td className="border px-4 py-3">{phone}</td>
              <td className="border px-4 py-3 text-center">
                {profile_picture ? (
                  <img
                    src={`http://localhost:5000/${profile_picture}`}
                    alt={name}
                    className="inline-block h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="italic text-gray-400">No Image</span>
                )}
              </td>
              <td className="border px-4 py-3 text-center space-x-2">
                <button
                  onClick={() => handleDelete(id)}
                  className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
