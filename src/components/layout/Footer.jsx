import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, AtSign, Mail, Phone, MapPin } from 'lucide-react';
import newLogo from '../../assets/newwlogo.png';

const Footer = () => {
    const navigate = useNavigate();
    
    // Helper function to create navigation links
    const NavLink = ({ path, children }) => (
        <li>
            <button 
                onClick={() => navigate(path)} 
                className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform inline-block"
            >
                {children}
            </button>
        </li>
    );

    return (
        <footer className="bg-gradient-to-br from-background-dark to-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <div className="flex items-center mb-6">
                            <img 
                                src={newLogo} 
                                alt="MakeEasy Logo" 
                                className="h-12 w-auto mr-3" 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/200x80/4f46e5/ffffff?text=MakeEasy";
                                }}
                            />
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-indigo to-brand-pink bg-clip-text text-transparent">MakeEasy</h3>
                        </div>
                        <p className="text-gray-400 mb-6">Your trusted marketplace for rentals and services in India. Connect with verified providers for all your needs.</p>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com/makeeasy.india" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-brand-indigo transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href="https://twitter.com/makeeasy_india" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-brand-indigo transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href="https://www.instagram.com/make._easy" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-brand-indigo transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="https://www.linkedin.com/company/make-easy-india" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-brand-indigo transition-colors">
                                <AtSign size={18} />
                            </a>
                        </div>
                    </div>
                    
                    {/* Services Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2 text-brand-lightBlue">Services</h4>
                        <ul className="space-y-2">
                            <NavLink path="/services/ac-service-repair">AC Service & Repair</NavLink>
                            <NavLink path="/services/plumbing">Plumbing</NavLink>
                            <NavLink path="/services/electrical">Electrical</NavLink>
                            <NavLink path="/services/painting">Painting</NavLink>
                            <NavLink path="/services/home-services">Home Services</NavLink>
                        </ul>
                    </div>
                    
                    {/* Categories Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2 text-brand-lightBlue">Categories</h4>
                        <ul className="space-y-2">
                            <NavLink path="/products/laundry">Laundry</NavLink>
                            <NavLink path="/products/website-development">Website Development</NavLink>
                            <NavLink path="/products/digital-marketing">Digital Marketing</NavLink>
                            <NavLink path="/products/construction">Construction</NavLink>
                        </ul>
                    </div>
                    
                    {/* Contact Information */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2 text-brand-lightBlue">Contact Us</h4>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <MapPin size={18} className="text-brand-pink mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-400">123 MakeEasy Tower, Civil Lines<br />Kanpur, Uttar Pradesh 208001<br />India</span>
                            </div>
                            <div className="flex items-center">
                                <Phone size={18} className="text-brand-pink mr-3 flex-shrink-0" />
                                <div className="flex flex-col">
                                    <a href="tel:+918318250417" className="text-gray-400 hover:text-white">+91 8318250417</a>
                                    <span className="text-sm text-gray-500">(Mon-Sat, 9AM-6PM)</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Mail size={18} className="text-brand-pink mr-3 flex-shrink-0" />
                                <div className="flex flex-col">
                                    <a href="mailto:support@makeeasy.com" className="text-gray-400 hover:text-white">support@makeeasy.com</a>
                                    <span className="text-sm text-gray-500">(24/7 Email Support)</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/contact')} 
                                className="mt-4 bg-gradient-to-r from-brand-indigo to-brand-purple px-6 py-2.5 rounded-full text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
                            >
                                <MapPin size={18} className="mr-2" />
                                Get Directions
                            </button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="text-center">
                        <p className="text-gray-400">Copyright &copy; {new Date().getFullYear()} MakeEasy. All rights reserved.</p>
                        <p className="text-gray-400 mt-2">Designed with ❤️ by Vaibhav • Built in Kanpur, India</p>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">MakeEasy Technologies Pvt. Ltd. • CIN: U74999UP2023PTC234567</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
