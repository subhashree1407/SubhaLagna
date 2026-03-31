import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  ChevronLeft, MapPin, Briefcase, GraduationCap, 
  Heart, Users, Sparkles, MessageCircle, 
  CheckCircle, ShieldCheck, Info
} from './Icons';

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchRequested, setMatchRequested] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profiles/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          setError("Profile not found or access denied.");
        }
      } catch (err) {
        setError("Failed to connect to server.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, token]);

  const handleMatchRequest = () => {
    setMatchRequested(true);
    // In a real app, this would hit an API: POST /api/matches/:id
    setTimeout(() => {
      alert("Match Request Sent Successfully! You will be notified when they respond.");
    }, 500);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-rose-50/10">
      <div className="animate-spin h-12 w-12 text-rose-600 border-4 border-rose-200 border-t-rose-600 rounded-full"></div>
    </div>
  );

  if (error || !profile) return (
    <div className="max-w-xl mx-auto mt-20 p-8 glass-panel text-center">
      <Info className="w-12 h-12 text-rose-300 mx-auto mb-4" />
      <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Oops!</h2>
      <p className="text-gray-500 mb-6">{error || "Something went wrong."}</p>
      <button onClick={() => navigate(-1)} className="px-6 py-3 bg-rose-500 text-white rounded-xl font-bold shadow-lg">Go Back</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in pb-32">
      {/* Navigation Header */}
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-rose-500 font-bold transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Matches
        </button>
        <div className="flex items-center gap-2 text-rose-500 text-sm font-bold bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100 shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          Verified Secure Profile
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Photos & Primary Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl shadow-rose-100/50 border-white/50 border">
            <div className="aspect-[3/4] relative">
              <img 
                src={profile.profilePhoto || '/man.png'} 
                alt={profile.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <h1 className="text-white text-3xl font-serif font-bold">{profile.name}, {profile.age}</h1>
                <div className="flex items-center text-rose-200 mt-2 text-sm font-medium">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  {profile.location || "Location Private"}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              disabled={matchRequested}
              onClick={handleMatchRequest}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3
                ${matchRequested 
                  ? 'bg-emerald-500 text-white cursor-default' 
                  : 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200'}`}
            >
              {matchRequested ? (
                <><CheckCircle className="w-6 h-6" /> Match Request Sent</>
              ) : (
                <><Heart className="w-6 h-6" /> Express Interest</>
              )}
            </button>
            
            <button className="w-full py-4 bg-white border border-rose-100 text-rose-600 rounded-2xl font-bold text-lg shadow-lg hover:bg-rose-50 transition-all flex items-center justify-center gap-3">
              <MessageCircle className="w-6 h-6" /> Shortlist Profile
            </button>
          </div>

          {/* Additional Photos Gallery */}
          {profile.additionalPhotos && profile.additionalPhotos.length > 0 && (
            <div className="glass-panel p-6 rounded-[2rem]">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                Gallery
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {profile.additionalPhotos.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:scale-105 transition-transform cursor-zoom-in">
                    <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Detailed Info Sections */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About Section */}
          <div className="glass-panel p-8 rounded-[2.5rem]">
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4 border-b border-rose-100 pb-3">About Myself</h2>
            <p className="text-gray-600 leading-relaxed text-lg italic">
              "{profile.bio || "No description provided yet."}"
            </p>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {[
                { label: 'Religion', val: profile.religion, icon: <Sparkles className="w-4 h-4" /> },
                { label: 'Caste', val: profile.caste, icon: <Users className="w-4 h-4" /> },
                { label: 'Height', val: profile.height, icon: <Sparkles className="w-4 h-4" /> },
                { label: 'Education', val: profile.education, icon: <GraduationCap className="w-4 h-4" /> }
              ].map((stat, i) => (
                <div key={stat.label} className="bg-rose-50/50 p-4 rounded-3xl border border-rose-100/30">
                  <div className="text-rose-500 mb-1">{stat.icon}</div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans">{stat.label}</div>
                  <div className="text-sm font-bold text-gray-800 truncate">{stat.val || "NA"}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Profile Info Cards */}
             <div className="glass-panel p-8 rounded-[2.5rem] border border-rose-100/20">
                <h3 className="text-lg font-serif font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-rose-500" />
                  Education & Career
                </h3>
                <ul className="space-y-4">
                  <li>
                    <span className="block text-xs uppercase font-bold text-gray-400 tracking-widest">Highest degree</span>
                    <span className="text-gray-700 font-semibold">{profile.education || "Under Graduate"}</span>
                  </li>
                  <li>
                    <span className="block text-xs uppercase font-bold text-gray-400 tracking-widest">Profession</span>
                    <span className="text-gray-700 font-semibold">{profile.profession || "Private Sector"}</span>
                  </li>
                </ul>
             </div>

             <div className="glass-panel p-8 rounded-[2.5rem] border border-rose-100/20">
                <h3 className="text-lg font-serif font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-500" />
                  Family Background
                </h3>
                <ul className="space-y-4">
                  <li>
                    <span className="block text-xs uppercase font-bold text-gray-400 tracking-widest">Father's Status</span>
                    <span className="text-gray-700 font-semibold">{profile.family?.fatherName || "Retired / Private"}</span>
                  </li>
                  <li>
                    <span className="block text-xs uppercase font-bold text-gray-400 tracking-widest">Mother's Status</span>
                    <span className="text-gray-700 font-semibold">{profile.family?.motherName || "Homemaker"}</span>
                  </li>
                </ul>
             </div>
          </div>

          {/* Interests & Traits */}
          <div className="glass-panel p-8 rounded-[2.5rem]">
             <h3 className="text-lg font-serif font-bold text-gray-800 mb-6 border-b border-rose-100 pb-3">Personality & Hobbies</h3>
             
             <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {(profile.interests || ['Music', 'Travel', 'Reading']).map(interest => (
                      <span key={interest} className="px-5 py-2 bg-pink-50 text-pink-700 rounded-full text-xs font-bold border border-pink-100 shadow-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Traits</h4>
                  <div className="flex flex-wrap gap-2">
                    {(profile.traits || ['Creative', 'Calm', 'Optimistic']).map(trait => (
                      <span key={trait} className="px-5 py-2 bg-purple-50 text-purple-700 rounded-full text-xs font-bold border border-purple-100 shadow-sm">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
             </div>
          </div>

          {/* Partner Expectations */}
          {profile.partnerInterests && (
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-[2px] rounded-[2.5rem] shadow-xl shadow-rose-200">
               <div className="bg-white p-8 rounded-[2.4rem]">
                  <h3 className="text-2xl font-serif font-bold text-rose-600 mb-4 flex items-center gap-3">
                    <Heart className="w-7 h-7" />
                    Ideally, I'm looking for...
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed font-medium">
                    {profile.partnerInterests}
                  </p>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
