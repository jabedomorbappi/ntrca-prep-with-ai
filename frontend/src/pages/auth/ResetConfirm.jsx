import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetConfirm = () => {
  const { uidb64, token } = useParams(); // Gets values from URL
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/exam/password-reset-confirm/${uidb64}/${token}/`, 
        { password }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Token invalid or expired.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="New Password" />
      <button type="submit">Update Password</button>
      <p>{message}</p>
    </form>
  );
};

export default ResetConfirm;