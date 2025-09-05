import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/apiConfig';
import Icon from '../../components/ui/Icon';

const AdminAboutCRUDPage = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/about`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setAbout(data.data[0]);
        setForm(data.data[0]);
      } else {
        setError('No About data found');
      }
    } catch (err) {
      setError('Failed to fetch About data');
    }
    setLoading(false);
  };

  const handleChange = (section, field, value, idx) => {
    setForm(prev => {
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

  const handleArrayChange = (section, idx, field, value) => {
    setForm(prev => {
      const updated = { ...prev };
      updated[section][idx][field] = value;
      return updated;
    });
  };

  const addItem = (section, newItem) => {
    setForm(prev => ({ ...prev, [section]: [...prev[section], newItem] }));
  };

  const removeItem = (section, idx) => {
    setForm(prev => {
      const updated = { ...prev };
      updated[section] = prev[section].filter((_, i) => i !== idx);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/about/${form._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setAbout(data.data);
        setSuccess('About section updated successfully!');
      } else {
        setError(data.error || 'Failed to update');
      }
    } catch (err) {
      setError('Failed to update');
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Icon name="loading" size={32} className="animate-spin" /> Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;
  if (!form) return null;

  return (
    <div className="p-8 min-h-screen bg-background-faint">
      <h1 className="text-2xl font-bold mb-6">Manage About Section</h1>
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <form className="bg-white p-6 rounded-xl shadow-lg mb-8" onSubmit={handleSubmit}>
        {/* Mission */}
        <h2 className="text-xl font-bold mb-2">Mission</h2>
        <input type="text" className="input input-bordered w-full mb-2" value={form.mission.title} onChange={e => handleChange('mission', 'title', e.target.value)} placeholder="Mission Title" />
        <input type="text" className="input input-bordered w-full mb-2" value={form.mission.subtitle} onChange={e => handleChange('mission', 'subtitle', e.target.value)} placeholder="Mission Subtitle" />
        <input type="text" className="input input-bordered w-full mb-4" value={form.mission.logoUrl} onChange={e => handleChange('mission', 'logoUrl', e.target.value)} placeholder="Logo URL" />

        {/* Story */}
        <h2 className="text-xl font-bold mb-2">Story</h2>
        <input type="text" className="input input-bordered w-full mb-2" value={form.story.heading} onChange={e => handleChange('story', 'heading', e.target.value)} placeholder="Story Heading" />
        <textarea className="input input-bordered w-full mb-2" value={form.story.description} onChange={e => handleChange('story', 'description', e.target.value)} placeholder="Story Description" />
        <div className="grid grid-cols-3 gap-2 mb-4">
          <input type="text" className="input input-bordered" value={form.story.highlights.customers} onChange={e => handleChange('story', 'highlights', { ...form.story.highlights, customers: e.target.value })} placeholder="Customers" />
          <input type="text" className="input input-bordered" value={form.story.highlights.providers} onChange={e => handleChange('story', 'highlights', { ...form.story.highlights, providers: e.target.value })} placeholder="Providers" />
          <input type="text" className="input input-bordered" value={form.story.highlights.cities} onChange={e => handleChange('story', 'highlights', { ...form.story.highlights, cities: e.target.value })} placeholder="Cities" />
        </div>

        {/* Core Values */}
        <h2 className="text-xl font-bold mb-2">Core Values</h2>
        {form.coreValues.map((value, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input type="text" className="input input-bordered w-1/3" value={value.title} onChange={e => handleArrayChange('coreValues', idx, 'title', e.target.value)} placeholder="Title" />
            <input type="text" className="input input-bordered w-2/3" value={value.description} onChange={e => handleArrayChange('coreValues', idx, 'description', e.target.value)} placeholder="Description" />
            <button type="button" onClick={() => removeItem('coreValues', idx)} className="text-red-500">X</button>
          </div>
        ))}
        <button type="button" onClick={() => addItem('coreValues', { title: "", description: "" })} className="text-blue-500 mb-4">+ Add Core Value</button>

        {/* Leadership Team */}
        <h2 className="text-xl font-bold mb-2 mt-4">Leadership Team</h2>
        {form.leadershipTeam.map((leader, idx) => (
          <div key={idx} className="mb-4 p-3 border rounded-lg">
            <input type="text" className="input input-bordered w-full mb-2" value={leader.name} onChange={e => handleArrayChange('leadershipTeam', idx, 'name', e.target.value)} placeholder="Name" />
            <input type="text" className="input input-bordered w-full mb-2" value={leader.role} onChange={e => handleArrayChange('leadershipTeam', idx, 'role', e.target.value)} placeholder="Role" />
            <textarea className="input input-bordered w-full mb-2" value={leader.bio} onChange={e => handleArrayChange('leadershipTeam', idx, 'bio', e.target.value)} placeholder="Bio" />
            <input type="text" className="input input-bordered w-full mb-2" value={leader.imageUrl} onChange={e => handleArrayChange('leadershipTeam', idx, 'imageUrl', e.target.value)} placeholder="Image URL" />
            {/* Socials */}
            {["linkedin", "twitter", "facebook"].map(social => (
              <input key={social} type="text" className="input input-bordered w-full mb-2"
                value={leader.socials?.[social] || ""}
                onChange={e => {
                  const updated = [...form.leadershipTeam];
                  updated[idx].socials = { ...updated[idx].socials, [social]: e.target.value };
                  setForm(prev => ({ ...prev, leadershipTeam: updated }));
                }}
                placeholder={`${social.charAt(0).toUpperCase() + social.slice(1)} URL`} />
            ))}
            <button type="button" onClick={() => removeItem('leadershipTeam', idx)} className="text-red-500">Remove Leader</button>
          </div>
        ))}
        <button type="button" onClick={() => addItem('leadershipTeam', { name: "", role: "", bio: "", imageUrl: "", socials: {} })} className="text-blue-500 mb-4">+ Add Leader</button>

        {/* Blog */}
        <h2 className="text-xl font-bold mb-2 mt-4">Blog Posts</h2>
        {form.blog.map((post, idx) => (
          <div key={idx} className="mb-4 p-3 border rounded-lg">
            <input type="text" className="input input-bordered w-full mb-2" value={post.category} onChange={e => handleArrayChange('blog', idx, 'category', e.target.value)} placeholder="Category" />
            <input type="date" className="input input-bordered w-full mb-2" value={post.date?.slice(0, 10)} onChange={e => handleArrayChange('blog', idx, 'date', e.target.value)} />
            <input type="text" className="input input-bordered w-full mb-2" value={post.title} onChange={e => handleArrayChange('blog', idx, 'title', e.target.value)} placeholder="Title" />
            <textarea className="input input-bordered w-full mb-2" value={post.description} onChange={e => handleArrayChange('blog', idx, 'description', e.target.value)} placeholder="Description" />
            <input type="text" className="input input-bordered w-full mb-2" value={post.link} onChange={e => handleArrayChange('blog', idx, 'link', e.target.value)} placeholder="Link" />
            <button type="button" onClick={() => removeItem('blog', idx)} className="text-red-500">Remove Post</button>
          </div>
        ))}
        <button type="button" onClick={() => addItem('blog', { category: "", date: "", title: "", description: "", link: "" })} className="text-blue-500 mb-4">+ Add Blog</button>

        {/* Journey */}
        <h2 className="text-xl font-bold mb-2 mt-4">Journey Timeline</h2>
        {form.journey.map((step, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input type="text" className="input input-bordered w-1/3" value={step.year} onChange={e => handleArrayChange('journey', idx, 'year', e.target.value)} placeholder="Year" />
            <input type="text" className="input input-bordered w-2/3" value={step.description} onChange={e => handleArrayChange('journey', idx, 'description', e.target.value)} placeholder="Description" />
            <button type="button" onClick={() => removeItem('journey', idx)} className="text-red-500">X</button>
          </div>
        ))}
        <button type="button" onClick={() => addItem('journey', { year: "", description: "" })} className="text-blue-500 mb-4">+ Add Step</button>

        {/* Community */}
        <h2 className="text-xl font-bold mb-2 mt-4">Community</h2>
        <input type="text" className="input input-bordered w-full mb-2" value={form.community.heading} onChange={e => handleChange('community', 'heading', e.target.value)} placeholder="Community Heading" />
        <textarea className="input input-bordered w-full mb-2" value={form.community.description} onChange={e => handleChange('community', 'description', e.target.value)} placeholder="Community Description" />
        {form.community.buttons.map((btn, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input type="text" className="input input-bordered w-1/2" value={btn.text} onChange={e => {
              const updatedBtns = [...form.community.buttons];
              updatedBtns[idx].text = e.target.value;
              setForm(prev => ({ ...prev, community: { ...prev.community, buttons: updatedBtns } }));
            }} placeholder="Button Text" />
            <input type="text" className="input input-bordered w-1/2" value={btn.link} onChange={e => {
              const updatedBtns = [...form.community.buttons];
              updatedBtns[idx].link = e.target.value;
              setForm(prev => ({ ...prev, community: { ...prev.community, buttons: updatedBtns } }));
            }} placeholder="Button Link" />
            <button type="button" onClick={() => {
              const updatedBtns = form.community.buttons.filter((_, i) => i !== idx);
              setForm(prev => ({ ...prev, community: { ...prev.community, buttons: updatedBtns } }));
            }} className="text-red-500">X</button>
          </div>
        ))}
        <button type="button" onClick={() => setForm(prev => ({
          ...prev,
          community: { ...prev.community, buttons: [...prev.community.buttons, { text: "", link: "" }] }
        }))} className="text-blue-500 mb-4">+ Add Button</button>

        <button type="submit" className="bg-brand-indigo text-white px-6 py-2 rounded-lg font-bold mt-6" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default AdminAboutCRUDPage;
