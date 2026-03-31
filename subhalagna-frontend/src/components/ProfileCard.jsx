import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ profile, index }) => {
  const navigate = useNavigate();
  // Cascading animation delay
  const animationDelay = Math.min(index * 100, 600);

  return (
    <div 
      className="glass-card rounded-2xl overflow-hidden flex flex-col group animate-fade-in"
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: 'both' }}
    >
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        <img 
          src={profile.image || profile.profilePhoto || '/man.png'} 
          alt={profile.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 relative z-10"
          onLoad={(e) => { e.target.previousSibling.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 pointer-events-none"></div>
        
        {profile.sharedCount > 0 && (
          <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 px-3 py-1 bg-rose-500 text-white rounded-full text-[10px] font-bold shadow-lg shadow-rose-900/20">
             <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
               <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
             </svg>
             {profile.sharedCount} Shared Interests
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 p-4 z-20 w-full">
          <h3 className="text-white text-xl font-serif font-bold drop-shadow-md">{profile.name}, {profile.age}</h3>
          <div className="flex items-center text-gray-200 text-sm mt-1 drop-shadow-sm">
            <svg className="w-4 h-4 mr-1 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {profile.location}
          </div>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-y-3 mb-4 text-sm border-b border-gray-100 pb-4">
          <div>
            <span className="block text-gray-500 font-medium text-xs">Profession</span>
            <span className="text-gray-800 font-semibold">{profile.profession}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium text-xs">Education</span>
            <span className="text-gray-800 font-semibold">{profile.education}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium text-xs">Height</span>
            <span className="text-gray-800 font-semibold">{profile.height}</span>
          </div>
        </div>
        
        <div className="mb-4 flex-1">
          <span className="block text-gray-500 font-medium text-xs mb-1">About</span>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{profile.bio}</p>
        </div>
        
        <button 
          onClick={() => navigate(`/profile/${profile._id || profile.id}`)}
          className="w-full mt-auto py-2.5 rounded-xl border-2 border-rose-100 text-rose-600 font-bold hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center justify-center gap-2"
        >
          View Full Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
