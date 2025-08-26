import React, { useState } from 'react';

const BookNowDrawer = ({ open, product, onClose, onPay }) => {
    const [form, setForm] = useState({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: product.id,
                    ...form
                })
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('Booking successful!');
                onPay && onPay(product);
            } else {
                setError(data.message || 'Booking failed');
            }
        } catch (err) {
            setError('Error booking product');
        }
        setLoading(false);
    };

    if (!open || !product) return null;
    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            {/* Drawer */}
            <aside className="relative w-full max-w-md bg-white h-full shadow-2xl p-8 flex flex-col animate-slide-in-right">
                <button className="absolute top-4 right-4 text-gray-500 hover:text-brand-indigo text-2xl" onClick={onClose} aria-label="Close">&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-brand-indigo">Book Now</h2>
                <div className="mb-6">
                    <div className="font-semibold text-lg mb-1">{product.title}</div>
                    <div className="text-gray-500 mb-1">Location: {product.location}</div>
                    <div className="text-brand-purple font-semibold mb-2">₹{product.price}/day</div>
                    <div className="text-gray-700 mb-2">{product.description || 'No description available.'}</div>
                </div>
                {/* Payment Form (simplified) */}
                <form className="flex flex-col gap-4 flex-1 justify-end" onSubmit={handleSubmit}>
                    <label className="font-medium">Your Name
                        <input type="text" name="name" className="w-full border rounded px-3 py-2 mt-1" required value={form.name} onChange={handleChange} />
                    </label>
                    <label className="font-medium">Email
                        <input type="email" name="email" className="w-full border rounded px-3 py-2 mt-1" required value={form.email} onChange={handleChange} />
                    </label>
                    <label className="font-medium">Phone
                        <input type="tel" name="phone" className="w-full border rounded px-3 py-2 mt-1" required value={form.phone} onChange={handleChange} />
                    </label>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-500 text-sm">{success}</div>}
                    <button type="submit" className="bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform shadow-button mt-4" disabled={loading}>{loading ? 'Processing...' : 'Proceed to Pay'}</button>
                </form>
            </aside>
            <style>{`
                .animate-slide-in-right {
                    animation: slideInRight 0.4s cubic-bezier(0.4,0,0.2,1);
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default BookNowDrawer;
