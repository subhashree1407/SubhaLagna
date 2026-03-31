import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfileDashboard = () => {
  const { user, token, updateProfileContext } = useContext(AuthContext);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (user && user.profile) {
      setFormData({
        name: user.profile.name || '',
        location: user.profile.location || '',
        age: user.profile.age || '',
        caste: user.profile.caste || 'Telli',
        religion: user.profile.religion || 'Hindu',
        education: user.profile.education || '',
        profession: user.profile.profession || '',
        bio: user.profile.bio || '',
        height: user.profile.height || ''
      });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('Saving...');
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    if (file) submitData.append('profilePhoto', file);

    try {
      const res = await fetch(`http://localhost:5000/api/profiles/${user.profile._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: submitData
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg('Profile updated successfully!');
        updateProfileContext(data);
      } else {
        setStatusMsg('Failed to update: ' + data.message);
      }
    } catch (err) {
      setStatusMsg('Error connecting to server.');
    }
  };

  if (!user || !user.profile) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto w-full p-4 md:p-8 relative z-10 animate-fade-in">
      <div className="glass-panel p-6 rounded-3xl">
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
          Edit Your Profile
        </h2>

        {statusMsg && <div className="mb-6 p-4 rounded-xl font-medium bg-rose-50 text-rose-700 border border-rose-100">{statusMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Full Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all font-sans text-sm text-gray-800" />
              </div>
              <div className="flex gap-4">
                 <div className="flex-1">
                   <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Age</label>
                   <input type="number" name="age" value={formData.age || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all font-sans text-sm text-gray-800" />
                 </div>
                 <div className="flex-[2]">
                   <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">City Location</label>
                   <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all font-sans text-sm text-gray-800" />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Caste / Community</label>
                <input type="text" name="caste" value={formData.caste || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all font-sans text-sm text-gray-800" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Religion</label>
                <input type="text" name="religion" value={formData.religion || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all font-sans text-sm text-gray-800" />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Education</label>
                <input type="text" name="education" value={formData.education || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all font-sans text-sm text-gray-800" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Profession</label>
                <input type="text" name="profession" value={formData.profession || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all font-sans text-sm text-gray-800" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Height</label>
                <input type="text" name="height" value={formData.height || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all font-sans text-sm text-gray-800" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Update Profile Photo</label>
                <input type="file" name="profilePhoto" onChange={handleFileChange} accept="image/png, image/jpeg" className="w-full px-4 py-2 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
              </div>
            </div>
          </div>

          <div className="mt-4">
             <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">About Me / Bio</label>
             <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all font-sans text-sm text-gray-800"></textarea>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow border border-rose-500 transition-all">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileDashboard;
