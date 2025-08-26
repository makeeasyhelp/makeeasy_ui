import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import Icon from '../components/ui/Icon';

const ProfilePage = ({ onNavigate }) => {
  const { auth } = useContext(AuthContext) || {};
  const { state } = useContext(AppContext) || {};
  const user = state?.user || auth?.user;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/users/${user.id}`);
                const data = await response.json();
                if (response.ok) {
                    setProfile(data);
                    setForm({
                        name: data.name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        address: data.address || ''
                    });
                } else {
                    setError(data.message || 'Failed to load profile');
                }
            } catch (err) {
                setError('Error loading profile');
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.VITE_API_URL || 'http://localhost:5050/api'}/users/${profile._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            const data = await response.json();
            if (response.ok) {
                setProfile(data);
                setSuccess('Profile updated successfully');
                setEditMode(false);
            } else {
                setError(data.message || 'Update failed');
            }
        } catch (err) {
            setError('Error updating profile');
        }
        setLoading(false);
    };

    if (loading) return <div className="py-20 text-center">Loading...</div>;
    if (error) return <div className="py-20 text-center text-red-500">{error}</div>;
    if (!profile) return null;

    return (
        <div className="container mx-auto px-4 py-12 max-w-xl">
            <h2 className="text-3xl font-bold mb-6 text-brand-indigo text-center">My Profile</h2>
            {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
            <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-lg p-8">
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Name</label>
                    <input type="text" name="name" className="w-full px-4 py-2 border rounded-lg" value={form.name} onChange={handleChange} disabled={!editMode} required />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Email</label>
                    <input type="email" name="email" className="w-full px-4 py-2 border rounded-lg" value={form.email} onChange={handleChange} disabled={!editMode} required />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Phone</label>
                    <input type="tel" name="phone" className="w-full px-4 py-2 border rounded-lg" value={form.phone} onChange={handleChange} disabled={!editMode} />
                </div>
                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Address</label>
                    <input type="text" name="address" className="w-full px-4 py-2 border rounded-lg" value={form.address} onChange={handleChange} disabled={!editMode} />
                </div>
                {editMode ? (
                    <button type="submit" className="w-full bg-brand-indigo text-white py-2 rounded-lg font-semibold hover:bg-brand-purple transition">Save Changes</button>
                ) : (
                    <button type="button" className="w-full bg-brand-indigo text-white py-2 rounded-lg font-semibold hover:bg-brand-purple transition" onClick={() => setEditMode(true)}>Edit Profile</button>
                )}
            </form>
        </div>
    );
};

export default ProfilePage;
