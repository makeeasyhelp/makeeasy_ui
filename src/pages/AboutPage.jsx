import React from 'react';
import Icon from '../components/ui/Icon';
import newLogo from '../assets/newwlogo.png';

// Since the images are in the `public` folder, we can reference them directly.
const rajatImgUrl = '/rajat.jpg'; // Assuming you add this image
const vaibhavImgUrl = '/vaibhav.jpg'; // Assuming you add this image

const AboutPage = ({ onNavigate }) => {
    const handleLogoError = (e) => {
        console.error("Logo failed to load");
        e.target.src = "https://placehold.co/200x80/4f46e5/ffffff?text=MakeEasy";
        e.target.onerror = null;
    };
    
    const handleFounderImageError = (name) => (e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/200x200/f1f5f9/4f46e5?text=${name}`;
    };
    
    return (
        <div className="bg-background-faint min-h-screen">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-brand-indigo to-brand-purple py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <img 
                        src={newLogo} 
                        alt="MakeEasy Logo" 
                        className="mx-auto h-20 w-auto mb-6 hover:scale-105 transition-transform duration-300" 
                        onError={handleLogoError}
                    />
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">About Our Mission</h1>
                    <p className="text-lg text-white/90 max-w-3xl mx-auto">
                        Revolutionizing on-demand services in India since 2023
                    </p>
                </div>
            </div>
            
            {/* Our Story Section */}
            <section className="container mx-auto px-4 py-16 max-w-6xl">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16 relative overflow-hidden">
                    {/* Design accent */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-brand-indigo/10 to-transparent rounded-bl-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-brand-pink/10 to-transparent rounded-tr-full pointer-events-none"></div>
                    
                    <h2 className="text-3xl font-bold mb-8 text-center relative inline-block">
                        <span className="text-gradient">Our Story</span>
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-indigo to-brand-pink rounded-full"></div>
                    </h2>
                    
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p className="leading-relaxed mb-6">
                            <strong className="text-brand-indigo">MakeEasy</strong> is India's trusted platform for <strong>on-demand services</strong>, <strong>equipment rentals</strong>, and <strong>home maintenance solutions</strong>. Whether you're looking to rent construction tools, book a plumber, or hire a professional electrician, MakeEasy connects you with verified service providers — quickly and conveniently.
                        </p>
                        <p className="leading-relaxed mb-6">
                            With a focus on simplicity and transparency, we help customers find reliable services at affordable rates. Our easy-to-use platform is designed for both individuals and businesses, offering a wide range of solutions across <strong>construction, electronics, home repair, cleaning, and more</strong>.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                                <div className="bg-brand-indigo/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <Icon name="users" size={28} className="text-brand-indigo" />
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 mb-2">10,000+</h3>
                                <p className="text-gray-600">Happy Customers</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                                <div className="bg-brand-purple/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <Icon name="tool" size={28} className="text-brand-purple" />
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 mb-2">500+</h3>
                                <p className="text-gray-600">Service Providers</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                                <div className="bg-brand-pink/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <Icon name="map" size={28} className="text-brand-pink" />
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 mb-2">15+</h3>
                                <p className="text-gray-600">Cities Covered</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Values Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center">Our Core Values</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-lg flex items-start">
                            <div className="bg-brand-indigo/10 rounded-full p-4 mr-5 flex-shrink-0">
                                <Icon name="shield-check" size={28} className="text-brand-indigo" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Reliability</h3>
                                <p className="text-gray-700">We verify all service providers on our platform to ensure you receive reliable, high-quality service every time.</p>
                            </div>
                        </div>
                        
                        <div className="bg-white p-8 rounded-xl shadow-lg flex items-start">
                            <div className="bg-brand-purple/10 rounded-full p-4 mr-5 flex-shrink-0">
                                <Icon name="dollar-sign" size={28} className="text-brand-purple" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent Pricing</h3>
                                <p className="text-gray-700">No hidden fees or surprises. We believe in complete transparency in all our services and pricing.</p>
                            </div>
                        </div>
                        
                        <div className="bg-white p-8 rounded-xl shadow-lg flex items-start">
                            <div className="bg-brand-pink/10 rounded-full p-4 mr-5 flex-shrink-0">
                                <Icon name="clock" size={28} className="text-brand-pink" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Convenience</h3>
                                <p className="text-gray-700">Book services anytime, anywhere through our user-friendly platform designed for maximum convenience.</p>
                            </div>
                        </div>
                        
                        <div className="bg-white p-8 rounded-xl shadow-lg flex items-start">
                            <div className="bg-brand-indigo/10 rounded-full p-4 mr-5 flex-shrink-0">
                                <Icon name="thumbs-up" size={28} className="text-brand-indigo" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Customer Satisfaction</h3>
                                <p className="text-gray-700">We prioritize your satisfaction and continuously improve our services based on your feedback.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Founding Team Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center relative inline-block">
                        <span className="text-gradient">Leadership Team</span>
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-indigo to-brand-pink rounded-full"></div>
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-white rounded-xl shadow-xl p-8 text-center shine-effect">
                            <div className="relative w-40 h-40 rounded-full mx-auto mb-6 overflow-hidden ring-4 ring-brand-indigo/20">
                                <img 
                                    src={rajatImgUrl} 
                                    alt="Rajat Kashyap" 
                                    className="w-full h-full object-cover"
                                    onError={handleFounderImageError('Rajat')}
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-brand-indigo mb-1">Rajat Kashyap</h3>
                            <p className="text-lg text-gray-600 mb-4">Founder & CEO</p>
                            <p className="text-gray-700 mb-6">
                                With over 10 years of experience in technology and services, Rajat leads MakeEasy's vision to transform how India accesses professional services.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <a href="#" className="bg-brand-indigo/10 hover:bg-brand-indigo p-3 rounded-full transition-all duration-300 group">
                                    <Icon name="linkedin" size={20} className="text-brand-indigo group-hover:text-white" />
                                </a>
                                <a href="#" className="bg-brand-indigo/10 hover:bg-brand-indigo p-3 rounded-full transition-all duration-300 group">
                                    <Icon name="twitter" size={20} className="text-brand-indigo group-hover:text-white" />
                                </a>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-xl p-8 text-center shine-effect">
                            <div className="relative w-40 h-40 rounded-full mx-auto mb-6 overflow-hidden ring-4 ring-brand-purple/20">
                                <img 
                                    src={vaibhavImgUrl} 
                                    alt="Vaibhav Shukla" 
                                    className="w-full h-full object-cover"
                                    onError={handleFounderImageError('Vaibhav')}
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-brand-purple mb-1">Vaibhav Shukla</h3>
                            <p className="text-lg text-gray-600 mb-4">Co-Founder & CTO</p>
                            <p className="text-gray-700 mb-6">
                                Vaibhav brings extensive technical expertise to MakeEasy, overseeing product development and technology innovations that power our platform.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <a href="#" className="bg-brand-purple/10 hover:bg-brand-purple p-3 rounded-full transition-all duration-300 group">
                                    <Icon name="linkedin" size={20} className="text-brand-purple group-hover:text-white" />
                                </a>
                                <a href="#" className="bg-brand-purple/10 hover:bg-brand-purple p-3 rounded-full transition-all duration-300 group">
                                    <Icon name="twitter" size={20} className="text-brand-purple group-hover:text-white" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Blog Posts Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center">From Our Blog</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 card-hover-effect">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-brand-indigo/10 rounded-full p-2 mr-3">
                                        <Icon name="home" size={16} className="text-brand-indigo" />
                                    </div>
                                    <span className="text-sm text-gray-500">Home Services</span>
                                    <span className="mx-2 text-gray-300">•</span>
                                    <span className="text-sm text-gray-500">August 5, 2025</span>
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 mb-3">Top 5 Home Services in Kanpur</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    Construction tools can be costly. Renting is smarter for short projects. Here are the top 5 home services you can book in Kanpur through MakeEasy...
                                </p>
                                <button 
                                    onClick={() => onNavigate('Blog1')} 
                                    className="inline-flex items-center text-brand-indigo hover:text-brand-indigoDark font-medium animated-underline"
                                >
                                    Read More
                                    <Icon name="arrow-right" size={16} className="ml-1" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 card-hover-effect">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-brand-purple/10 rounded-full p-2 mr-3">
                                        <Icon name="settings" size={16} className="text-brand-purple" />
                                    </div>
                                    <span className="text-sm text-gray-500">Service Tips</span>
                                    <span className="mx-2 text-gray-300">•</span>
                                    <span className="text-sm text-gray-500">August 2, 2025</span>
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 mb-3">Why Online Home Service Booking is Better</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    Avoid breakdowns & reduce power bills with timely AC maintenance. Here's why booking services online with MakeEasy is the smart choice...
                                </p>
                                <button 
                                    onClick={() => onNavigate('Blog2')} 
                                    className="inline-flex items-center text-brand-purple hover:text-brand-purpleDark font-medium animated-underline"
                                >
                                    Read More
                                    <Icon name="arrow-right" size={16} className="ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Timeline Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center">Our Journey</h2>
                    
                    <div className="relative border-l-4 border-brand-indigo ml-6 md:ml-0 md:mx-auto md:max-w-3xl pl-8 pb-8">
                        <div className="mb-12 relative">
                            <div className="absolute -left-12 bg-brand-indigo rounded-full w-8 h-8 flex items-center justify-center ring-4 ring-white">
                                <div className="bg-white rounded-full w-3 h-3"></div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md ml-2">
                                <h3 className="text-xl font-bold text-brand-indigo mb-1">2023</h3>
                                <p className="text-gray-700">MakeEasy was founded with a vision to transform service accessibility in India</p>
                            </div>
                        </div>
                        
                        <div className="mb-12 relative">
                            <div className="absolute -left-12 bg-brand-purple rounded-full w-8 h-8 flex items-center justify-center ring-4 ring-white">
                                <div className="bg-white rounded-full w-3 h-3"></div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md ml-2">
                                <h3 className="text-xl font-bold text-brand-purple mb-1">2024</h3>
                                <p className="text-gray-700">Expanded to 5 cities and crossed 1,000 service providers on our platform</p>
                            </div>
                        </div>
                        
                        <div className="mb-12 relative">
                            <div className="absolute -left-12 bg-brand-pink rounded-full w-8 h-8 flex items-center justify-center ring-4 ring-white">
                                <div className="bg-white rounded-full w-3 h-3"></div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md ml-2">
                                <h3 className="text-xl font-bold text-brand-pink mb-1">2025</h3>
                                <p className="text-gray-700">Reached 10,000+ customers and expanded to 15+ cities across India</p>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <div className="absolute -left-12 bg-gradient-to-r from-brand-indigo to-brand-purple rounded-full w-8 h-8 flex items-center justify-center ring-4 ring-white pulse-animation">
                                <div className="bg-white rounded-full w-3 h-3"></div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md ml-2">
                                <h3 className="text-xl font-bold text-gradient mb-1">The Future</h3>
                                <p className="text-gray-700">Working towards our goal of becoming India's #1 service marketplace</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* CTA Section */}
                <div className="text-center bg-gradient-to-r from-brand-indigo to-brand-purple rounded-2xl p-10 shadow-xl">
                    <h3 className="text-3xl font-bold text-white mb-4">Join the MakeEasy Community</h3>
                    <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                        Whether you're looking for services or want to offer your expertise, MakeEasy is the platform for you
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-8 py-3 bg-white text-brand-indigo font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg">
                            Find Services
                        </button>
                        <button className="px-8 py-3 bg-transparent text-white font-bold rounded-full border-2 border-white hover:bg-white/10 transition-all duration-300">
                            Become a Provider
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
