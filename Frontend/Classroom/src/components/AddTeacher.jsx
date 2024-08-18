import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'react-feather'; // Optional: For using icons

function AddTeacher() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher' // Default role
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { ...formData, role: formData.role.toLowerCase() }, { withCredentials: true });
      setSuccess('Registration successful!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
      setSuccess('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Create Teacher ID</h2>
      
      {/* Role Selection */}
      
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-gray-700 bg-gray-800 text-gray-200"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-gray-700 bg-gray-800 text-gray-200"
            required
          />
        </div>
          <label className="block text-gray-300 mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-gray-700 bg-gray-800 text-gray-200"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center px-3"
          >
            {showPassword ? <EyeOff className="text-gray-300" /> : <Eye className="text-gray-300" />}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default AddTeacher;
