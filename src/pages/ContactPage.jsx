import React, { useState } from 'react';
import Icon from '../components/ui/Icon';
import newLogo from '../assets/newwlogo.png';

const ContactPage = () => {
    // Add form validation and loading state
    const [formState, setFormState] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        if (!formState.name.trim()) errors.name = 'Name is required';
        if (!formState.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) errors.email = 'Valid email required';
        if (!formState.subject) errors.subject = 'Subject required';
        if (!formState.message.trim()) errors.message = 'Message required';
        return errors;
    };

    const handleChange = e => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;
        setSubmitting(true);
        // Simulate async submit
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
        }, 1200);
    };

    const handleLogoError = (e) => {
        console.error("Logo failed to load");
        e.target.src = "https://placehold.co/200x80/4f46e5/ffffff?text=MakeEasy";
        e.target.onerror = null;
    };
    
    return (
        <div className="bg-background-faint min-h-screen">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-brand-indigo to-brand-purple py-16 px-4 md:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <img 
                        src={newLogo} 
                        alt="MakeEasy Logo" 
                        className="mx-auto h-16 w-auto mb-6 hover:scale-105 transition-transform duration-300" 
                        onError={handleLogoError}
                    />
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Get in Touch</h1>
                    <p className="text-lg text-white/90 max-w-3xl mx-auto">
                        We'd love to hear from you. Our team is always here to help with your questions and needs.
                    </p>
                </div>
            </div>
            
            <section className="container mx-auto px-4 py-16 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 order-2 lg:order-1 relative overflow-hidden">
                        {/* Design accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-indigo/10 to-transparent rounded-bl-full pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-brand-pink/10 to-transparent rounded-tr-full pointer-events-none"></div>
                        
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 relative inline-block">
                            <span className="text-gradient">Send Us a Message</span>
                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-indigo to-brand-pink rounded-full"></div>
                        </h2>
                        
                        {submitted ? (
                            <div className="text-center py-12 stagger-fade-in">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <Icon name="check" size={32} className="text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
                                <p className="text-gray-600">Your message has been sent successfully. We'll get back to you soon!</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block font-medium mb-2 text-gray-700">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Icon name="user" size={18} className="text-gray-400" />
                                            </div>
                                            <input 
                                                type="text" 
                                                id="name" 
                                                name="name" 
                                                value={formState.name}
                                                onChange={handleChange}
                                                className={`w-full border border-gray-300 pl-10 px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo transition-all ${formErrors.name ? 'border-red-500' : ''}`}
                                                placeholder="John Doe"
                                                required 
                                                aria-label="Full Name"
                                            />
                                            {formErrors.name && <span className="text-red-500 text-xs">{formErrors.name}</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block font-medium mb-2 text-gray-700">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Icon name="mail" size={18} className="text-gray-400" />
                                            </div>
                                            <input 
                                                type="email" 
                                                id="email" 
                                                name="email"
                                                value={formState.email}
                                                onChange={handleChange}
                                                className={`w-full border border-gray-300 pl-10 px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo transition-all ${formErrors.email ? 'border-red-500' : ''}`}
                                                placeholder="you@example.com"
                                                required 
                                                aria-label="Email Address"
                                            />
                                            {formErrors.email && <span className="text-red-500 text-xs">{formErrors.email}</span>}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="phone" className="block font-medium mb-2 text-gray-700">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Icon name="phone" size={18} className="text-gray-400" />
                                            </div>
                                            <input 
                                                type="tel" 
                                                id="phone" 
                                                name="phone" 
                                                value={formState.phone}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 pl-10 px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo transition-all" 
                                                placeholder="+91 8318250417"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="subject" className="block font-medium mb-2 text-gray-700">Subject</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Icon name="message-square" size={18} className="text-gray-400" />
                                            </div>
                                            <select 
                                                id="subject" 
                                                name="subject" 
                                                value={formState.subject}
                                                onChange={handleChange}
                                                className={`w-full border border-gray-300 pl-10 px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo transition-all appearance-none bg-white ${formErrors.subject ? 'border-red-500' : ''}`}
                                                required
                                                aria-label="Subject"
                                            >
                                                <option value="" disabled>Select a subject</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="support">Customer Support</option>
                                                <option value="feedback">Feedback</option>
                                                <option value="partnership">Business Partnership</option>
                                            </select>
                                            {formErrors.subject && <span className="text-red-500 text-xs">{formErrors.subject}</span>}
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <Icon name="chevron-down" size={18} className="text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label htmlFor="message" className="block font-medium mb-2 text-gray-700">Message</label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                            <Icon name="edit-3" size={18} className="text-gray-400" />
                                        </div>
                                        <textarea 
                                            id="message" 
                                            name="message" 
                                            value={formState.message}
                                            onChange={handleChange}
                                            rows="5" 
                                            className={`w-full border border-gray-300 pl-10 px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo transition-all ${formErrors.message ? 'border-red-500' : ''}`}
                                            placeholder="How can we help you?"
                                            required
                                            aria-label="Message"
                                        ></textarea>
                                        {formErrors.message && <span className="text-red-500 text-xs">{formErrors.message}</span>}
                                    </div>
                                </div>
                                
                                <div className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="privacy" 
                                        className="custom-checkbox" 
                                        required 
                                    />
                                    <label htmlFor="privacy" className="ml-2 text-gray-700 text-sm">
                                        I agree to the <a href="#" className="text-brand-indigo hover:text-brand-indigoDark animated-underline">Privacy Policy</a> and <a href="#" className="text-brand-indigo hover:text-brand-indigoDark animated-underline">Terms of Service</a>
                                    </label>
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                                        submitting 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-brand-indigo to-brand-purple text-white hover:shadow-lg hover:from-brand-indigoDark hover:to-brand-purpleDark btn-glow'
                                    }`}
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                    
                    {/* Contact Info */}
                    <div className="order-1 lg:order-2">
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-purple/10 to-transparent rounded-bl-full pointer-events-none"></div>
                            
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 relative inline-block">
                                <span className="text-gradient-purple">Contact Information</span>
                                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-purple to-brand-pink rounded-full"></div>
                            </h2>
                            
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-brand-purple/10 rounded-full p-3 mr-4">
                                        <Icon name="map-pin" size={24} className="text-brand-purple" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Our Location</h3>
                                        <p className="text-gray-600">123 MakeEasy Tower, Civil Lines, Kanpur, Uttar Pradesh 208001</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-brand-purple/10 rounded-full p-3 mr-4">
                                        <Icon name="phone" size={24} className="text-brand-purple" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Phone Number</h3>
                                        <p className="text-gray-600">
                                            <a href="tel:+918318250417" className="text-brand-purple hover:text-brand-purpleDark animated-underline">
                                                +91 8318250417
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-brand-purple/10 rounded-full p-3 mr-4">
                                        <Icon name="mail" size={24} className="text-brand-purple" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Email Address</h3>
                                        <p className="text-gray-600">
                                            <a href="mailto:support@makeeasy.com" className="text-brand-purple hover:text-brand-purpleDark animated-underline">
                                                support@makeeasy.com
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-brand-purple/10 rounded-full p-3 mr-4">
                                        <Icon name="clock" size={24} className="text-brand-purple" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Business Hours</h3>
                                        <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                                        <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                                        <p className="text-gray-600">Sunday: Closed</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8">
                                <h3 className="font-semibold text-gray-800 mb-4">Follow Us</h3>
                                <div className="flex space-x-4">
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-brand-purple/10 hover:bg-brand-purple p-3 rounded-full transition-all duration-300 group" aria-label="Facebook">
                                        <Icon name="facebook" size={20} className="text-brand-purple group-hover:text-white" />
                                    </a>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-brand-purple/10 hover:bg-brand-purple p-3 rounded-full transition-all duration-300 group" aria-label="Twitter">
                                        <Icon name="twitter" size={20} className="text-brand-purple group-hover:text-white" />
                                    </a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-brand-purple/10 hover:bg-brand-purple p-3 rounded-full transition-all duration-300 group" aria-label="Instagram">
                                        <Icon name="instagram" size={20} className="text-brand-purple group-hover:text-white" />
                                    </a>
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-brand-purple/10 hover:bg-brand-purple p-3 rounded-full transition-all duration-300 group" aria-label="LinkedIn">
                                        <Icon name="linkedin" size={20} className="text-brand-purple group-hover:text-white" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        {/* FAQ Section */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 relative inline-block">
                                <span className="text-gradient-purple">Frequently Asked Questions</span>
                                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-purple to-brand-pink rounded-full"></div>
                            </h2>
                            
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-lg p-4 hover:border-brand-purple/30 transition-all duration-300">
                                    <h3 className="font-semibold text-gray-800 mb-2">How soon can I expect a response?</h3>
                                    <p className="text-gray-600">We typically respond to all inquiries within 24-48 business hours.</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4 hover:border-brand-purple/30 transition-all duration-300">
                                    <h3 className="font-semibold text-gray-800 mb-2">Do you offer emergency services?</h3>
                                    <p className="text-gray-600">Yes, for certain home services we offer emergency support. Please call our helpline for immediate assistance.</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4 hover:border-brand-purple/30 transition-all duration-300">
                                    <h3 className="font-semibold text-gray-800 mb-2">How can I become a service provider?</h3>
                                    <p className="text-gray-600">Please use our contact form and select "Business Partnership" as the subject to inquire about joining our service provider network.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Map Section */}
                <div className="mt-16 bg-white rounded-2xl shadow-xl p-6 overflow-hidden">
                    <h2 className="text-2xl font-bold mb-6 text-center">Find Us On The Map</h2>
                    <div className="rounded-xl overflow-hidden h-96 border-4 border-white shadow-inner">
                        <iframe
                            src="https://www.google.com/maps?q=123+MakeEasy+Tower,+Civil+Lines,+Kanpur,+Uttar+Pradesh+208001&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="MakeEasy Location"
                        ></iframe>
                    </div>
                </div>
                
                {/* CTA Section */}
                <div className="mt-16 text-center bg-gradient-to-r from-brand-indigo to-brand-purple rounded-2xl p-10 shadow-xl">
                    <h3 className="text-3xl font-bold text-white mb-4">Let's Work Together</h3>
                    <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                        Join thousands of satisfied customers who trust MakeEasy for quality services
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-8 py-3 bg-white text-brand-indigo font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg">
                            Book a Service
                        </button>
                        <button className="px-8 py-3 bg-transparent text-white font-bold rounded-full border-2 border-white hover:bg-white/10 transition-all duration-300">
                            Become a Partner
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
