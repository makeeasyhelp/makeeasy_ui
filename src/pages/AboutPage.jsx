import React, { useEffect, useState } from 'react';
import Icon from '../components/ui/Icon';
import newLogo from '../assets/newwlogo.png';
import { API_BASE_URL } from '../config/apiConfig';

const AboutPage = ({ onNavigate }) => {
    const [about, setAbout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState(null);
    const [editSuccess, setEditSuccess] = useState(null);

    // Replace with your actual admin check logic
    const isAdmin = localStorage.getItem('role') === 'admin';

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/about`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data.length > 0) {
                    setAbout(data.data[0]);
                } else {
                    setError('No about data found');
                }
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch about data');
                setLoading(false);
            });
    }, []);

    const handleLogoError = (e) => {
        e.target.src = 'https://placehold.co/200x80/4f46e5/ffffff?text=MakeEasy';
        e.target.onerror = null;
    };
    const handleFounderImageError = (name) => (e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/200x200/f1f5f9/4f46e5?text=${name}`;
    };

    // Edit handlers
    const openEdit = () => {
        setEditData(about);
        setShowEdit(true);
        setEditError(null);
        setEditSuccess(null);
    };
    const closeEdit = () => {
        setShowEdit(false);
        setEditError(null);
        setEditSuccess(null);
    };
    const handleEditChange = (section, field, value, idx) => {
        setEditData(prev => {
            const updated = { ...prev };
            if (idx !== undefined) {
                updated[section][idx][field] = value;
            } else if (section && field) {
                updated[section][field] = value;
            } else if (section) {
                updated[section] = value;
            }
            return updated;
        });
    };
    const handleEditArrayChange = (section, idx, field, value) => {
        setEditData(prev => {
            const updated = { ...prev };
            updated[section][idx][field] = value;
            return updated;
        });
    };
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setEditError(null);
        setEditSuccess(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/about/${about._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editData)
            });
            const data = await res.json();
            if (data.success) {
                setAbout(data.data);
                setEditSuccess('About section updated successfully!');
                setShowEdit(false);
            } else {
                setEditError(data.error || 'Failed to update');
            }
        } catch (err) {
            setEditError('Failed to update');
        }
        setEditLoading(false);
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Icon name="loading" size={32} className="animate-spin" /> Loading...</div>;
    if (error) return <div className="text-center text-red-500 py-20">{error}</div>;
    if (!about) return null;

    const { mission, story, coreValues, leadershipTeam, blog, journey, community } = about;

    return (
        <div className="bg-background-faint min-h-screen">
            {/* Edit Button for Admin */}
            {isAdmin && (
                <div className="flex justify-end p-4">
                    <button onClick={openEdit} className="px-4 py-2 bg-brand-indigo text-white rounded shadow hover:bg-brand-indigoDark transition">Edit About Section</button>
                </div>
            )}
            {/* Edit Modal */}
            {showEdit && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
                    <form className="bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl overflow-y-auto max-h-[90vh]" onSubmit={handleEditSubmit}>
                        <h2 className="text-2xl font-bold mb-6">Edit About Section</h2>
                        {/* Mission */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Mission Title</label>
                            <input type="text" className="input input-bordered w-full" value={editData.mission.title} onChange={e => handleEditChange('mission', 'title', e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Mission Subtitle</label>
                            <input type="text" className="input input-bordered w-full" value={editData.mission.subtitle} onChange={e => handleEditChange('mission', 'subtitle', e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Logo URL</label>
                            <input type="text" className="input input-bordered w-full" value={editData.mission.logoUrl} onChange={e => handleEditChange('mission', 'logoUrl', e.target.value)} />
                        </div>
                        {/* Story */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Story Heading</label>
                            <input type="text" className="input input-bordered w-full" value={editData.story.heading} onChange={e => handleEditChange('story', 'heading', e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Story Description</label>
                            <textarea className="input input-bordered w-full" value={editData.story.description} onChange={e => handleEditChange('story', 'description', e.target.value)} />
                        </div>
                        {/* Highlights */}
                        <div className="mb-4 grid grid-cols-3 gap-2">
                            <div>
                                <label className="block font-semibold mb-1">Customers</label>
                                <input type="text" className="input input-bordered w-full" value={editData.story.highlights.customers} onChange={e => handleEditChange('story', 'highlights', { ...editData.story.highlights, customers: e.target.value })} />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Providers</label>
                                <input type="text" className="input input-bordered w-full" value={editData.story.highlights.providers} onChange={e => handleEditChange('story', 'highlights', { ...editData.story.highlights, providers: e.target.value })} />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Cities</label>
                                <input type="text" className="input input-bordered w-full" value={editData.story.highlights.cities} onChange={e => handleEditChange('story', 'highlights', { ...editData.story.highlights, cities: e.target.value })} />
                            </div>
                        </div>
                        {/* Core Values */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Core Values</label>
                            {editData.coreValues.map((value, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input type="text" className="input input-bordered w-1/3" value={value.title} onChange={e => handleEditArrayChange('coreValues', idx, 'title', e.target.value)} placeholder="Title" />
                                    <input type="text" className="input input-bordered w-2/3" value={value.description} onChange={e => handleEditArrayChange('coreValues', idx, 'description', e.target.value)} placeholder="Description" />
                                </div>
                            ))}
                        </div>
                        {/* Leadership Team */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Leadership Team</label>
                            {editData.leadershipTeam.map((leader, idx) => (
                                <div key={idx} className="mb-2 grid grid-cols-2 gap-2">
                                    <input type="text" className="input input-bordered" value={leader.name} onChange={e => handleEditArrayChange('leadershipTeam', idx, 'name', e.target.value)} placeholder="Name" />
                                    <input type="text" className="input input-bordered" value={leader.role} onChange={e => handleEditArrayChange('leadershipTeam', idx, 'role', e.target.value)} placeholder="Role" />
                                    <input type="text" className="input input-bordered col-span-2" value={leader.bio} onChange={e => handleEditArrayChange('leadershipTeam', idx, 'bio', e.target.value)} placeholder="Bio" />
                                    <input type="text" className="input input-bordered col-span-2" value={leader.imageUrl} onChange={e => handleEditArrayChange('leadershipTeam', idx, 'imageUrl', e.target.value)} placeholder="Image URL" />
                                </div>
                            ))}
                        </div>
                        {/* Blog */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Blog Posts</label>
                            {editData.blog.map((post, idx) => (
                                <div key={idx} className="mb-2 grid grid-cols-2 gap-2">
                                    <input type="text" className="input input-bordered" value={post.category} onChange={e => handleEditArrayChange('blog', idx, 'category', e.target.value)} placeholder="Category" />
                                    <input type="date" className="input input-bordered" value={post.date?.slice(0,10)} onChange={e => handleEditArrayChange('blog', idx, 'date', e.target.value)} />
                                    <input type="text" className="input input-bordered col-span-2" value={post.title} onChange={e => handleEditArrayChange('blog', idx, 'title', e.target.value)} placeholder="Title" />
                                    <input type="text" className="input input-bordered col-span-2" value={post.description} onChange={e => handleEditArrayChange('blog', idx, 'description', e.target.value)} placeholder="Description" />
                                    <input type="text" className="input input-bordered col-span-2" value={post.link} onChange={e => handleEditArrayChange('blog', idx, 'link', e.target.value)} placeholder="Link" />
                                </div>
                            ))}
                        </div>
                        {/* Journey */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Journey Timeline</label>
                            {editData.journey.map((step, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input type="text" className="input input-bordered w-1/3" value={step.year} onChange={e => handleEditArrayChange('journey', idx, 'year', e.target.value)} placeholder="Year" />
                                    <input type="text" className="input input-bordered w-2/3" value={step.description} onChange={e => handleEditArrayChange('journey', idx, 'description', e.target.value)} placeholder="Description" />
                                </div>
                            ))}
                        </div>
                        {/* Community */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Community Heading</label>
                            <input type="text" className="input input-bordered w-full" value={editData.community.heading} onChange={e => handleEditChange('community', 'heading', e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Community Description</label>
                            <input type="text" className="input input-bordered w-full" value={editData.community.description} onChange={e => handleEditChange('community', 'description', e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Community Buttons</label>
                            {editData.community.buttons.map((btn, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input type="text" className="input input-bordered w-1/2" value={btn.text} onChange={e => {
                                        const updatedBtns = [...editData.community.buttons];
                                        updatedBtns[idx].text = e.target.value;
                                        setEditData(prev => ({ ...prev, community: { ...prev.community, buttons: updatedBtns } }));
                                    }} placeholder="Button Text" />
                                    <input type="text" className="input input-bordered w-1/2" value={btn.link} onChange={e => {
                                        const updatedBtns = [...editData.community.buttons];
                                        updatedBtns[idx].link = e.target.value;
                                        setEditData(prev => ({ ...prev, community: { ...prev.community, buttons: updatedBtns } }));
                                    }} placeholder="Button Link" />
                                </div>
                            ))}
                        </div>
                        {editError && <div className="text-red-500 mb-2">{editError}</div>}
                        {editSuccess && <div className="text-green-500 mb-2">{editSuccess}</div>}
                        <div className="flex gap-4 mt-6">
                            <button type="submit" className="px-6 py-2 bg-brand-indigo text-white rounded shadow hover:bg-brand-indigoDark transition" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save Changes'}</button>
                            <button type="button" className="px-6 py-2 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 transition" onClick={closeEdit}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Mission Section */}
            <div className="bg-gradient-to-r from-brand-indigo to-brand-purple py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <img 
                        src={mission.logoUrl || newLogo} 
                        alt="MakeEasy Logo" 
                        className="mx-auto h-20 w-auto mb-6 hover:scale-105 transition-transform duration-300" 
                        onError={handleLogoError}
                    />
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">{mission.title}</h1>
                    <p className="text-lg text-white/90 max-w-3xl mx-auto">{mission.subtitle}</p>
                </div>
            </div>

            {/* Story & Highlights Section */}
            <section className="container mx-auto px-4 py-16 max-w-6xl">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-brand-indigo/10 to-transparent rounded-bl-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-brand-pink/10 to-transparent rounded-tr-full pointer-events-none"></div>
                    <h2 className="text-3xl font-bold mb-8 text-center relative inline-block">
                        <span className="text-gradient">{story.heading}</span>
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-indigo to-brand-pink rounded-full"></div>
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p className="leading-relaxed mb-6">{story.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                                <div className="bg-brand-indigo/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <Icon name="users" size={28} className="text-brand-indigo" />
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 mb-2">{story.highlights?.customers}</h3>
                                <p className="text-gray-600">Happy Customers</p>
                            </div>
                            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                                <div className="bg-brand-purple/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <Icon name="tool" size={28} className="text-brand-purple" />
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 mb-2">{story.highlights?.providers}</h3>
                                <p className="text-gray-600">Service Providers</p>
                            </div>
                            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                                <div className="bg-brand-pink/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <Icon name="map" size={28} className="text-brand-pink" />
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 mb-2">{story.highlights?.cities}</h3>
                                <p className="text-gray-600">Cities Covered</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Core Values Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {coreValues?.map((value) => (
                            <div key={value._id || value.title} className="bg-white p-8 rounded-xl shadow-lg flex items-start">
                                <div className="bg-brand-indigo/10 rounded-full p-4 mr-5 flex-shrink-0">
                                    <Icon name="star" size={28} className="text-brand-indigo" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                    <p className="text-gray-700">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Leadership Team Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center relative inline-block">
                        <span className="text-gradient">Leadership Team</span>
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-indigo to-brand-pink rounded-full"></div>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {leadershipTeam?.map((leader) => (
                            <div key={leader._id || leader.name} className="bg-white rounded-xl shadow-xl p-8 text-center shine-effect">
                                <div className="relative w-40 h-40 rounded-full mx-auto mb-6 overflow-hidden ring-4 ring-brand-indigo/20">
                                    <img 
                                        src={leader.imageUrl} 
                                        alt={leader.name} 
                                        className="w-full h-full object-cover"
                                        onError={handleFounderImageError(leader.name)}
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-brand-indigo mb-1">{leader.name}</h3>
                                <p className="text-lg text-gray-600 mb-4">{leader.role}</p>
                                <p className="text-gray-700 mb-6">{leader.bio}</p>
                                <div className="flex justify-center space-x-4">
                                    {leader.socials?.linkedin && (
                                        <a href={leader.socials.linkedin} target="_blank" rel="noopener noreferrer" className="bg-brand-indigo/10 hover:bg-brand-indigo p-3 rounded-full transition-all duration-300 group">
                                            <Icon name="linkedin" size={20} className="text-brand-indigo group-hover:text-white" />
                                        </a>
                                    )}
                                    {leader.socials?.twitter && (
                                        <a href={leader.socials.twitter} target="_blank" rel="noopener noreferrer" className="bg-brand-indigo/10 hover:bg-brand-indigo p-3 rounded-full transition-all duration-300 group">
                                            <Icon name="twitter" size={20} className="text-brand-indigo group-hover:text-white" />
                                        </a>
                                    )}
                                    {leader.socials?.facebook && (
                                        <a href={leader.socials.facebook} target="_blank" rel="noopener noreferrer" className="bg-brand-indigo/10 hover:bg-brand-indigo p-3 rounded-full transition-all duration-300 group">
                                            <Icon name="facebook" size={20} className="text-brand-indigo group-hover:text-white" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Blog Posts Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center">From Our Blog</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {blog?.map((post) => (
                            <div key={post._id || post.title} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 card-hover-effect">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-brand-indigo/10 rounded-full p-2 mr-3">
                                            <Icon name="home" size={16} className="text-brand-indigo" />
                                        </div>
                                        <span className="text-sm text-gray-500">{post.category}</span>
                                        <span className="mx-2 text-gray-300">•</span>
                                        <span className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-3">{post.title}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{post.description}</p>
                                    <a 
                                        href={post.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center text-brand-indigo hover:text-brand-indigoDark font-medium animated-underline"
                                    >
                                        Read More
                                        <Icon name="arrow-right" size={16} className="ml-1" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center">Our Journey</h2>
                    <div className="relative border-l-4 border-brand-indigo ml-6 md:ml-0 md:mx-auto md:max-w-3xl pl-8 pb-8">
                        {journey?.map((step, idx) => (
                            <div key={step._id || step.year} className={`mb-12 relative ${idx === journey.length - 1 ? '' : ''}`}>
                                <div className={`absolute -left-12 ${idx % 3 === 0 ? 'bg-brand-indigo' : idx % 3 === 1 ? 'bg-brand-purple' : 'bg-brand-pink'} rounded-full w-8 h-8 flex items-center justify-center ring-4 ring-white`}>
                                    <div className="bg-white rounded-full w-3 h-3"></div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-md ml-2">
                                    <h3 className="text-xl font-bold mb-1">{step.year}</h3>
                                    <p className="text-gray-700">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-gradient-to-r from-brand-indigo to-brand-purple rounded-2xl p-10 shadow-xl">
                    <h3 className="text-3xl font-bold text-white mb-4">{community.heading}</h3>
                    <p className="text-white/90 mb-6 max-w-2xl mx-auto">{community.description}</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {community.buttons?.map((btn) => (
                            <a key={btn._id || btn.text} href={btn.link} target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-white text-brand-indigo font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg">
                                {btn.text}
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
