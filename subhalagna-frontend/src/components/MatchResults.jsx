// src/components/MatchResults.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ProfileCard from './ProfileCard';
import { CITIES } from '../data/mockProfiles';

const MatchResults = () => {
  const { user, token } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filters, setFilters] = useState({
    minAge: 18,
    maxAge: 40,
    location: 'Any',
    caste: 'Any',
    religion: 'Any',
    education: 'Any'
  });

  const fetchMatches = async () => {
    if (!user || (!user.profile && !user.location)) return; // Allow safety net 
    setLoading(true);
    try {
      // Calculate target opposite gender natively
      const targetGender = user?.profile?.gender === 'Male' ? 'Female' : 'Male';
      
      const queryParams = new URLSearchParams({
        gender: targetGender,
        location: filters.location,
        minAge: filters.minAge,
        maxAge: filters.maxAge,
        caste: filters.caste,
        religion: filters.religion,
        education: filters.education
      });

      const res = await fetch(`http://localhost:5000/api/profiles?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if(res.ok) {
        let data = await res.json();
        
        // Sorting logic based on common interests/traits
        if (user?.profile) {
           const myInterests = user.profile.interests || [];
           const myTraits = user.profile.traits || [];
           
           data = data.map(profile => {
              const sharedInterests = (profile.interests || []).filter(i => myInterests.includes(i));
              const sharedTraits = (profile.traits || []).filter(t => myTraits.traits ? myTraits.traits.includes(t) : myTraits.includes(t));
              const totalShared = sharedInterests.length + sharedTraits.length;
              return { ...profile, sharedCount: totalShared };
           }).sort((a, b) => b.sharedCount - a.sharedCount);
        }

        setMatches(data);
      }
    } catch(err) {
      console.error("Failed to fetch matches", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line
  }, [filters, user]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (!user || (!user.profile && !user.location)) return <div className="text-center p-8 mt-10">Loading profile data...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 relative z-10 flex flex-col md:flex-row gap-6">
      
      {/* Sidebar Filters */}
      <div className="w-full md:w-72 flex-shrink-0 animate-fade-in glass-panel p-6 rounded-2xl h-fit sticky top-6 border border-gray-100/50 shadow-sm">
         <h3 className="text-xl font-serif font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Advanced Filters
         </h3>
         
         <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Age Range</label>
              <div className="flex items-center gap-2">
                 <input type="number" name="minAge" value={filters.minAge} onChange={handleFilterChange} className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm" />
                 <span className="text-gray-400">-</span>
                 <input type="number" name="maxAge" value={filters.maxAge} onChange={handleFilterChange} className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">City Location</label>
              <select name="location" value={filters.location} onChange={handleFilterChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white">
                <option value="Any">All Selected Cities</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Caste</label>
              <select name="caste" value={filters.caste} onChange={handleFilterChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white">
                <option value="Any">Doesn't Matter</option>
                <option value="Telli">Telli</option>
                <option value="Khandayat">Khandayat</option>
                <option value="Brahmin">Brahmin</option>
                <option value="Karana">Karana</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Religion</label>
              <select name="religion" value={filters.religion} onChange={handleFilterChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white">
                <option value="Any">Doesn't Matter</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
              </select>
            </div>
            
            <button onClick={fetchMatches} className="w-full mt-4 py-2 bg-rose-50 text-rose-700 font-semibold rounded-lg hover:bg-rose-100 border border-rose-200 transition-colors">
               Apply Filters
            </button>
         </div>
      </div>

      {/* Main Results Board */}
      <div className="flex-1 animate-fade-in delay-100">
        <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-serif font-bold text-gray-800">
              Matches <span className="text-gray-400 font-normal text-lg">({matches.length} found)</span>
            </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32 glass-panel rounded-3xl">
              <svg className="animate-spin h-12 w-12 text-rose-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
          </div>
        ) : matches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {matches.map((profile, index) => (
              <ProfileCard key={profile._id || profile.id} profile={profile} index={index} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center glass-panel rounded-3xl">
            <div className="w-20 h-20 mb-6 rounded-full bg-rose-50 flex items-center justify-center">
              <svg className="w-10 h-10 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">No matching profiles</h3>
            <p className="text-gray-500 max-w-sm">
              Try adjusting your advanced filter criteria (like broadening the age or cities).
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default MatchResults;
