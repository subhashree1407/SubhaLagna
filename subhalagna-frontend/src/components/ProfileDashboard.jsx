import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { Sparkles, Trash, Plus } from './Icons';

const ProfileDashboard = () => {
  const { user, token, updateProfileContext } = useContext(AuthContext);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [removePhotos, setRemovePhotos] = useState([]);
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

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles([...galleryFiles, ...files]);
    
    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews([...galleryPreviews, ...newPreviews]);
  };

  const handleRemoveExisting = (photoUrl) => {
    setRemovePhotos([...removePhotos, photoUrl]);
  };

  const handleRemoveNew = (index) => {
    const updatedFiles = [...galleryFiles];
    updatedFiles.splice(index, 1);
    setGalleryFiles(updatedFiles);

    const updatedPreviews = [...galleryPreviews];
    updatedPreviews.splice(index, 1);
    setGalleryPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('Saving Changes...');
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    if (file) submitData.append('profilePhoto', file);
    
    // Additional Photos
    galleryFiles.forEach(f => submitData.append('additionalPhotos', f));
    
    // Removals
    if (removePhotos.length > 0) {
      submitData.append('removePhotos', JSON.stringify(removePhotos));
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/profiles/${user.profile._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: submitData
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg('Profile and Gallery updated successfully!');
        updateProfileContext(data);
        setGalleryFiles([]);
        setGalleryPreviews([]);
        setRemovePhotos([]);
      } else {
        setStatusMsg('Failed to update: ' + data.message);
      }
    } catch (err) {
      console.error("Submit Error:", err);
      setStatusMsg('Error connecting to server.');
    }
  };

  if (!user || !user.profile) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  const existingGallery = (user.profile.additionalPhotos || []).filter(p => !removePhotos.includes(p));

  return (
    <div className="max-w-4xl mx-auto w-full p-4 md:p-8 relative z-10 animate-fade-in pb-32">
      <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-rose-100/20 border border-white/50">
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          Edit Your Profile
        </h2>

        {statusMsg && (
          <div className={`mb-8 p-4 rounded-2xl font-medium border animate-scale-in flex items-center gap-3 ${
            statusMsg.includes('success') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}>
            <div className={`w-2 h-2 rounded-full ${statusMsg.includes('success') ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            {statusMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-sans text-gray-800" />
              </div>
              
              <div className="flex gap-4">
                 <div className="flex-1">
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Age</label>
                   <input type="number" name="age" value={formData.age || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-sans text-gray-800" />
                 </div>
                 <div className="flex-[2]">
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Current City</label>
                   <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-sans text-gray-800" />
                 </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Community (Caste)</label>
                <input type="text" name="caste" value={formData.caste || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-sans text-gray-800" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Update Profile Photo</label>
                <div className="mt-1 flex items-center gap-4">
                   <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-rose-100 shadow-sm">
                      <img src={file ? URL.createObjectURL(file) : (user.profile.profilePhoto || '/man.png')} className="w-full h-full object-cover" alt="Preview" />
                   </div>
                   <input type="file" name="profilePhoto" onChange={handleFileChange} accept="image/png, image/jpeg" className="text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-rose-50 hover:file:text-rose-600 transition-all" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Educational Degree</label>
                <input type="text" name="education" value={formData.education || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-sans text-gray-800" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Profession</label>
                <input type="text" name="profession" value={formData.profession || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-sans text-gray-800" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Height</label>
                <input type="text" name="height" value={formData.height || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-sans text-gray-800" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">About Me / Bio</label>
                <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows="3" className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-sans text-gray-800"></textarea>
              </div>
            </div>
          </div>

          {/* Photo Gallery Section */}
          <div className="pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
               <div>
                  <h3 className="text-xl font-serif font-bold text-gray-800">Photo Gallery</h3>
                  <p className="text-sm text-gray-400 mt-1">Add up to 6 detailed photos to showcase your lifestyle</p>
               </div>
               {existingGallery.length + galleryFiles.length < 6 && (
                 <label className="cursor-pointer group">
                    <input type="file" multiple onChange={handleGalleryChange} accept="image/*" className="hidden" />
                    <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-100 transition-colors border border-rose-100">
                       <Plus className="w-4 h-4" />
                       Add Photos
                    </div>
                 </label>
               )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Existing Gallery Photos */}
              {existingGallery.map((photo, i) => (
                <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <img src={photo} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                  <button type="button" onClick={() => handleRemoveExisting(photo)} className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white shadow-xl">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* New (Unsaved) Photos */}
              {galleryPreviews.map((preview, i) => (
                <div key={`new-${i}`} className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-rose-200 border-dashed animate-pulse-subtle shadow-sm bg-rose-50/10">
                  <img src={preview} className="w-full h-full object-cover opacity-80" alt={`New Preview ${i}`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">NEW</span>
                  </div>
                  <button type="button" onClick={() => handleRemoveNew(i)} className="absolute top-2 right-2 p-2 bg-white text-gray-500 rounded-lg hover:text-rose-500 shadow-xl">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Empty placeholder card if no photos exist */}
              {existingGallery.length === 0 && galleryFiles.length === 0 && (
                <label className="flex flex-col items-center justify-center aspect-square rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-rose-50/50 hover:border-rose-200 transition-all cursor-pointer group col-span-2 sm:col-span-1">
                  <input type="file" multiple onChange={handleGalleryChange} accept="image/*" className="hidden" />
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-rose-500 shadow-sm group-hover:shadow-rose-100 transition-all mb-3">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-rose-500 uppercase tracking-widest">Start Gallery</span>
                </label>
              )}
            </div>
          </div>

          <div className="pt-10 flex justify-end">
            <button type="submit" className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 text-white font-bold rounded-2xl shadow-xl shadow-rose-200 transition-all hover:-translate-y-1">
              Save All Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileDashboard;

