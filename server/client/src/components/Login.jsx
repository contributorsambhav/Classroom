import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
const navigate= useNavigate() 
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  React.useEffect(() => {
    axios.get("https://classroom-4v2s.onrender.com//profile", {
        withCredentials: true
    })
        .then(res => {
          console.log(res.data.user);
            const data = res.data.user;
            dispatch(login(data));
            console.log(data);

        })
        .catch(error => {
            console.error('Error fetching profile:', error);
        });
}, [dispatch]);


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
      const response = await axios.post(
        'https://classroom-4v2s.onrender.com//api/auth/login',
        formData,
        { withCredentials: true } // Ensure cookies are sent with the request
      );
      setSuccess('Login successful!');
      setTimeout(() => {
        navigate("/principal-dashboard")
      }, 1000);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
      setSuccess('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-gray-700 bg-gray-800 text-gray-200"
            placeholder="Email"
            required
          />
        </div>
        <div className="relative">
          <label className="block text-gray-300 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-gray-700 bg-gray-800 text-gray-200"
            placeholder="Password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
