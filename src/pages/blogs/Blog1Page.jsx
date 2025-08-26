import React from 'react';
import { allListingsData, categories } from '../../data/appData';
import Icon from '../../components/ui/Icon';
import newLogo from '../../assets/newwlogo.png';

const Blog1Page = () => {
    const handleLogoError = (e) => {
        console.error("Logo failed to load");
        e.target.src = "https://placehold.co/200x80/4f46e5/ffffff?text=MakeEasy";
        e.target.onerror = null;
    };
    
    return (
        <section className="bg-background-faint min-h-screen">
            {/* Blog Header Banner */}
            <div className="bg-gradient-to-r from-brand-indigo to-brand-purple py-16 px-4 sm:px-6 lg:px-8 text-center">
                <img 
                    src={newLogo} 
                    alt="MakeEasy Logo" 
                    className="mx-auto h-16 w-auto mb-6 hover:scale-105 transition-transform duration-300" 
                    onError={handleLogoError}
                />
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                    MakeEasy Blog
                </h1>
                <p className="text-lg text-white/90 max-w-3xl mx-auto">
                    Insights, tips, and trends in home and professional services
                </p>
            </div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-xl shadow-lg p-8 mb-12 relative overflow-hidden">
                    {/* Design accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-indigo/10 to-transparent rounded-bl-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-brand-pink/10 to-transparent rounded-tr-full pointer-events-none"></div>
                    
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Top 5 Home Services in Kanpur</h1>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                                <Icon name="calendar" size={16} className="mr-1 text-brand-indigo" />
                                <span>August 5, 2025</span>
                            </div>
                            <div className="flex items-center">
                                <Icon name="clock" size={16} className="mr-1 text-brand-indigo" />
                                <span>5 min read</span>
                            </div>
                            <div className="flex items-center">
                                <Icon name="user" size={16} className="mr-1 text-brand-indigo" />
                                <span>By MakeEasy Team</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="prose prose-lg max-w-none">
                        <p className="text-lg text-gray-700 mb-8">
                            Construction tools can be costly. Renting is smarter for short projects. Here are the top 5 home services you can book in Kanpur through MakeEasy:
                        </p>
                        
                        <ol className="list-decimal pl-6 space-y-6">
                            <li className="pl-2">
                                <h3 className="font-bold text-xl text-brand-indigo mb-1">Deep Cleaning Service</h3>
                                <p>Professional cleaning for your home or office with eco-friendly products and trained staff.</p>
                            </li>
                            <li className="pl-2">
                                <h3 className="font-bold text-xl text-brand-indigo mb-1">Pest Control</h3>
                                <p>Keep your space safe and pest-free with our certified technicians using safe chemicals.</p>
                            </li>
                            <li className="pl-2">
                                <h3 className="font-bold text-xl text-brand-indigo mb-1">AC Repair & Maintenance</h3>
                                <p>Certified technicians for all AC brands with quick service and guaranteed results.</p>
                            </li>
                            <li className="pl-2">
                                <h3 className="font-bold text-xl text-brand-indigo mb-1">Legal Consultation</h3>
                                <p>Book a session with a verified legal expert for property, family, or business matters.</p>
                            </li>
                            <li className="pl-2">
                                <h3 className="font-bold text-xl text-brand-indigo mb-1">CA Services</h3>
                                <p>Get your taxes and accounts managed by professionals with expertise in tax planning.</p>
                            </li>
                        </ol>
                        
                        <div className="my-10 p-6 bg-gradient-to-r from-brand-indigo/10 to-brand-purple/10 border-l-4 border-brand-indigo rounded-r-lg">
                            <p className="text-gray-800 flex items-start">
                                <Icon name="lightbulb" size={24} className="text-brand-indigo mr-3 flex-shrink-0 mt-1" />
                                <span>
                                    <strong className="text-brand-indigo">Pro Tip:</strong> Schedule recurring services like AC maintenance and pest control for discounted rates and preventive care.
                                </span>
                            </p>
                        </div>
                    </div>
                    
                    {/* Share buttons */}
                    <div className="mt-12 mb-12 flex items-center border-t border-b border-gray-200 py-6">
                        <span className="mr-4 font-medium text-gray-700">Share this article:</span>
                        <div className="flex space-x-3">
                            <button className="p-2 bg-[#1877F2] text-white rounded-full hover:bg-opacity-90 transition-all">
                                <Icon name="facebook" size={20} />
                            </button>
                            <button className="p-2 bg-[#1DA1F2] text-white rounded-full hover:bg-opacity-90 transition-all">
                                <Icon name="twitter" size={20} />
                            </button>
                            <button className="p-2 bg-[#0A66C2] text-white rounded-full hover:bg-opacity-90 transition-all">
                                <Icon name="linkedin" size={20} />
                            </button>
                            <button className="p-2 bg-[#25D366] text-white rounded-full hover:bg-opacity-90 transition-all">
                                <Icon name="whatsapp" size={20} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 relative inline-block">
                            <span className="text-gradient">Featured Home Services</span>
                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-indigo to-brand-pink rounded-full"></div>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {allListingsData.filter(item => item.category === 'home-services').slice(0, 3).map(item => (
                                <div key={item.id} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 card-hover-effect">
                                    <div className="mb-3 font-bold text-lg text-brand-indigo">{item.title}</div>
                                    <div className="flex items-center mb-2 text-sm text-gray-600">
                                        <Icon name="location" size={16} className="mr-1 text-brand-pink" />
                                        {item.location}
                                    </div>
                                    <div className="text-brand-purple font-bold mt-4">₹{item.price}</div>
                                    <button className="mt-4 w-full py-2 bg-brand-indigo text-white rounded-lg hover:bg-brand-indigoDark transition-all duration-300">
                                        Book Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* CTA Section */}
                    <div className="mt-12 text-center bg-gradient-to-r from-brand-indigo to-brand-purple rounded-2xl p-8 shadow-lg">
                        <h3 className="text-2xl font-bold text-white mb-4">Ready to Book a Service?</h3>
                        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                            Get started with MakeEasy today and experience hassle-free home services
                        </p>
                        <button className="px-8 py-3 bg-white text-brand-indigo font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg">
                            Explore Services
                        </button>
                    </div>
                </div>
                
                {/* Related Articles */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold mb-6 text-center">Related Articles</h3>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="border-b border-gray-200 pb-4 mb-4 hover:bg-gray-50 p-2 rounded transition-all">
                            <a href="/blogs/blog2" className="flex items-center text-brand-indigo hover:text-brand-indigoDark">
                                <Icon name="document" size={20} className="mr-2" />
                                <span>Why Online Home Service Booking is Better</span>
                            </a>
                        </div>
                        <div className="hover:bg-gray-50 p-2 rounded transition-all">
                            <a href="#" className="flex items-center text-brand-indigo hover:text-brand-indigoDark">
                                <Icon name="document" size={20} className="mr-2" />
                                <span>How to Choose the Right Service Provider</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blog1Page;
