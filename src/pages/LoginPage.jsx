import React, { useState, useContext } from 'react';
import { productsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const LoginPage = ({ onLogin, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setAuth } = useContext(AuthContext) || {};

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok && data.token) {
                localStorage.setItem('token', data.token);
                setAuth && setAuth({ token: data.token, user: data.user });
                if (onLogin) onLogin(data.user);
                if (onNavigate) onNavigate('Home');
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-indigo via-brand-purple to-brand-pink">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-brand-indigo">Login</h2>
                {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Email</label>
                    <input type="email" className="w-full px-4 py-2 border rounded-lg" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Password</label>
                    <input type="password" className="w-full px-4 py-2 border rounded-lg" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="w-full bg-brand-indigo text-white py-2 rounded-lg font-semibold hover:bg-brand-purple transition">Login</button>
                <div className="mt-4 text-center">
                    <button type="button" className="text-brand-indigo hover:underline" onClick={() => onNavigate && onNavigate('ForgotPassword')}>Forgot Password?</button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
