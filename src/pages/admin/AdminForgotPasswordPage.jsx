import React, { useState } from 'react';

const AdminForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-faint">
      <form className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        {submitted ? (
          <div className="text-green-600 text-center mb-4">If this email exists, a reset link has been sent.</div>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your admin email"
              className="w-full mb-4 px-4 py-3 border rounded-lg"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-brand-indigo text-white py-3 rounded-lg font-bold">Send Reset Link</button>
          </>
        )}
        <div className="text-center mt-4">
          <a href="/admin/login" className="text-brand-indigo hover:underline text-sm">Back to Login</a>
        </div>
      </form>
    </div>
  );
};

export default AdminForgotPasswordPage;
