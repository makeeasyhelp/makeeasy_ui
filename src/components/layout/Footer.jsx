import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, AtSign, Mail, Phone, MapPin, ChevronDown } from 'lucide-react';
import newLogo from '../../assets/newwlogo.png';

const Footer = () => {
    const navigate = useNavigate();

    // Accordion toggle for mobile sections
    const [openSection, setOpenSection] = useState(null);
    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Reusable NavLink
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* About Section */}
                    <div>
                        <div className="flex items-center mb-6">
                            <img
                                src={newLogo}
                                alt="MakeEasy Logo"
                                className="h-10 w-auto mr-3"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/200x80/4f46e5/ffffff?text=MakeEasy";
                                }}
                            />
                            <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-indigo to-brand-pink bg-clip-text text-transparent">MakeEasy</h3>
                        </div>
                        <p className="text-gray-400 mb-6 text-sm md:text-base">
                            Your trusted marketplace for rentals and services in India. Connect with verified providers for all your needs.
                        </p>
                        <div className="flex space-x-4">
                            {[
                                { href: "https://facebook.com/makeeasy.india", icon: <Facebook size={18} /> },
                                { href: "https://twitter.com/makeeasy_india", icon: <Twitter size={18} /> },
                                { href: "https://www.instagram.com/make._easy", icon: <Instagram size={18} /> },
                                { href: "https://www.linkedin.com/company/make-easy-india", icon: <AtSign size={18} /> }
                            ].map((social, i) => (
                                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer"
                                    className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-brand-indigo transition-colors">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <button 
                            className="w-full flex justify-between items-center md:block mb-4"
                            onClick={() => toggleSection('services')}
                        >
                            <h4 className="text-lg font-semibold border-b border-gray-800 pb-2 text-brand-lightBlue">Services</h4>
                            <ChevronDown className={`md:hidden transition-transform ${openSection === 'services' ? "rotate-180" : ""}`} />
                        </button>
                        <ul className={`space-y-2 text-sm md:text-base ${openSection === 'services' || window.innerWidth >= 768 ? "block" : "hidden"}`}>
                            <NavLink path="/services/ac-service-repair">AC Service & Repair</NavLink>
                            <NavLink path="/services/plumbing">Plumbing</NavLink>
                            <NavLink path="/services/electrical">Electrical</NavLink>
                            <NavLink path="/services/painting">Painting</NavLink>
                            <NavLink path="/services/home-services">Home Services</NavLink>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <button 
                            className="w-full flex justify-between items-center md:block mb-4"
                            onClick={() => toggleSection('categories')}
                        >
                            <h4 className="text-lg font-semibold border-b border-gray-800 pb-2 text-brand-lightBlue">Categories</h4>
                            <ChevronDown className={`md:hidden transition-transform ${openSection === 'categories' ? "rotate-180" : ""}`} />
                        </button>
                        <ul className={`space-y-2 text-sm md:text-base ${openSection === 'categories' || window.innerWidth >= 768 ? "block" : "hidden"}`}>
                            <NavLink path="/products/laundry">Laundry</NavLink>
                            <NavLink path="/products/website-development">Website Development</NavLink>
                            <NavLink path="/products/digital-marketing">Digital Marketing</NavLink>
                            <NavLink path="/products/construction">Construction</NavLink>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <button 
                            className="w-full flex justify-between items-center md:block mb-4"
                            onClick={() => toggleSection('contact')}
                        >
                            <h4 className="text-lg font-semibold border-b border-gray-800 pb-2 text-brand-lightBlue">Contact Us</h4>
                            <ChevronDown className={`md:hidden transition-transform ${openSection === 'contact' ? "rotate-180" : ""}`} />
                        </button>
                        <div className={`${openSection === 'contact' || window.innerWidth >= 768 ? "block" : "hidden"} space-y-4 text-sm md:text-base`}>
                            <div className="flex items-start">
                                <MapPin size={18} className="text-brand-pink mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-400">123 MakeEasy Tower, Civil Lines<br />Kanpur, Uttar Pradesh 208001<br />India</span>
                            </div>
                            <div className="flex items-center">
                                <Phone size={18} className="text-brand-pink mr-3 flex-shrink-0" />
                                <div className="flex flex-col">
                                    <a href="tel:+918318250417" className="text-gray-400 hover:text-white">+91 8318250417</a>
                                    <span className="text-xs text-gray-500">(Mon-Sat, 9AM-6PM)</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Mail size={18} className="text-brand-pink mr-3 flex-shrink-0" />
                                <div className="flex flex-col">
                                    <a href="mailto:support@makeeasy.com" className="text-gray-400 hover:text-white">support@makeeasy.com</a>
                                    <span className="text-xs text-gray-500">(24/7 Email Support)</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/contact')}
                                className="mt-4 bg-gradient-to-r from-brand-indigo to-brand-purple px-5 py-2 rounded-full text-white text-sm md:text-base font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
                            >
                                <MapPin size={16} className="mr-2" />
                                Get Directions
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-10 pt-6">
                    <div className="text-center text-xs md:text-sm">
                        <p className="text-gray-400">Copyright &copy; {new Date().getFullYear()} MakeEasy. All rights reserved.</p>
                        <p className="text-gray-400 mt-2">Designed with ❤️ by Gourav Sharma • Built in Haryana, India</p>
                        <p className="text-gray-500 mt-2">MakeEasy Technologies Pvt. Ltd. • CIN: U74999UP2023PTC234567</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
