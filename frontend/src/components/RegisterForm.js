import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profile_picture: null,
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === 'profile_picture') {
      setFormData({ ...formData, profile_picture: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('profile_picture', formData.profile_picture);

    try {
      const res = await axios.post('http://localhost:5000/api/users', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
      setFormData({ name: '', email: '', phone: '', profile_picture: null });
      onRegister();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-indigo-50 p-6 rounded-lg shadow-md max-w-md mx-auto space-y-6"
      encType="multipart/form-data"
    >
      <div>
        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="John Doe"
          className="w-full p-3 rounded border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="example@mail.com"
          className="w-full p-3 rounded border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="+1 234 567 890"
          className="w-full p-3 rounded border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="profile_picture" className="block text-gray-700 font-medium mb-1">
          Profile Picture
        </label>
        <input
          type="file"
          name="profile_picture"
          accept="image/*"
          onChange={handleChange}
          className="w-full file:bg-indigo-600 file:text-white file:p-2 file:rounded file:border-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-semibold transition duration-300"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>

      {message && (
        <p className={`mt-4 text-center font-medium ${message.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
};

export default RegisterForm;
