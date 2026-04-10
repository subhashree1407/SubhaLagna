// src/components/MatchResults.jsx
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileCard from './ProfileCard';
import { CITIES } from '../data/mockProfiles';
import { API_BASE_URL } from '../config';

// ─── Clean Header ──────────────────────────────────────────────────────────
const MatchHeader = () => {
  const { user, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)',
        boxShadow: scrolled ? '0 4px 20px rgba(244,63,94,0.08)' : '0 1px 0 rgba(0,0,0,0.06)',
        transition: 'all 0.4s ease',
      }}
    >
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '40px', height: '40px',
            background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
            borderRadius: '12px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 4px 12px rgba(244,63,94,0.3)'
          }}>
            <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <span style={{ fontSize: '24px', fontFamily: 'serif', fontWeight: 'bold', color: '#1f2937' }}>
            Subha<span style={{ color: '#f43f5e' }}>Lagna</span>
          </span>
        </Link>

        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdown(!profileDropdown)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 12px', borderRadius: '12px', border: 'none',
              background: 'transparent', cursor: 'pointer', transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#fff1f2')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, #fb7185, #ec4899)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontWeight: 'bold',
              fontSize: '14px', boxShadow: '0 2px 8px rgba(244,63,94,0.3)'
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span style={{
              color: '#374151', fontWeight: 500, fontSize: '14px',
              maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>
              {user?.name || 'User'}
            </span>
            <svg style={{
              width: '16px', height: '16px', color: '#9ca3af',
              transition: 'transform 0.3s',
              transform: profileDropdown ? 'rotate(180deg)' : 'rotate(0)'
            }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div style={{
            position: 'absolute', right: 0, top: '100%', marginTop: '8px',
            width: '224px', backgroundColor: 'white', borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(244,63,94,0.12)', border: '1px solid #fff1f2',
            overflow: 'hidden', transition: 'all 0.3s ease', transformOrigin: 'top right',
            opacity: profileDropdown ? 1 : 0,
            transform: profileDropdown ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
            pointerEvents: profileDropdown ? 'auto' : 'none',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
              <p style={{ fontSize: '12px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
            </div>
            <div style={{ padding: '8px' }}>
              {[
                { label: 'My Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { label: '👑 Premium', path: '/premium', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              ].map((item) => (
                <Link key={item.label} to={item.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                    borderRadius: '12px', fontSize: '14px', color: '#4b5563', textDecoration: 'none', transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fff1f2'; e.currentTarget.style.color = '#e11d48'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#4b5563'; }}
                >
                  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              ))}
            </div>
            <div style={{ padding: '8px', borderTop: '1px solid #f3f4f6' }}>
              <button onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                  borderRadius: '12px', fontSize: '14px', color: '#ef4444', border: 'none',
                  background: 'transparent', cursor: 'pointer', width: '100%', transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// ─── Filter Tag ─────────────────────────────────────────────────────────────
const FilterTag = ({ label, value, onClear }) => {
  if (value === 'Any' || !value) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px',
      backgroundColor: '#fff1f2', color: '#e11d48', borderRadius: '9999px',
      fontSize: '12px', fontWeight: 500, border: '1px solid #fecdd3'
    }}>
      <span style={{ color: '#fb7185' }}>{label}:</span> {value}
      <button onClick={onClear} style={{
        marginLeft: '2px', width: '16px', height: '16px', borderRadius: '50%',
        backgroundColor: 'rgba(251,113,133,0.3)', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0
      }}>
        <svg style={{ width: '10px', height: '10px', color: '#e11d48' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
};

// ─── Skeleton Card ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div style={{
    backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6'
  }}>
    <div style={{ height: '224px', background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)', animation: 'pulse 2s ease-in-out infinite' }} />
    <div style={{ padding: '20px' }}>
      <div style={{ height: '20px', backgroundColor: '#e5e7eb', borderRadius: '8px', width: '75%', marginBottom: '12px' }} />
      <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', width: '50%', marginBottom: '12px' }} />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <div style={{ height: '24px', backgroundColor: '#f3f4f6', borderRadius: '9999px', width: '64px' }} />
        <div style={{ height: '24px', backgroundColor: '#f3f4f6', borderRadius: '9999px', width: '80px' }} />
      </div>
      <div style={{ height: '40px', backgroundColor: '#f3f4f6', borderRadius: '12px', width: '100%' }} />
    </div>
  </div>
);

// ─── Main MatchResults ──────────────────────────────────────────────────────
const MatchResults = () => {
  const { user, token } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('compatibility');
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState({
    minAge: 18, maxAge: 40, location: 'Any', education: 'Any',
  });

  const activeFilterCount = Object.entries(filters).filter(
    ([key, val]) => val !== 'Any' && key !== 'minAge' && key !== 'maxAge'
  ).length + (filters.minAge !== 18 || filters.maxAge !== 40 ? 1 : 0);

  const sortMatches = (data, sort) => {
    const sorted = [...data];
    switch (sort) {
      case 'compatibility': return sorted.sort((a, b) => (b.sharedCount || 0) - (a.sharedCount || 0));
      case 'newest': return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      case 'age-asc': return sorted.sort((a, b) => (a.age || 0) - (b.age || 0));
      case 'age-desc': return sorted.sort((a, b) => (b.age || 0) - (a.age || 0));
      default: return sorted;
    }
  };

  const fetchMatches = useCallback(async () => {
    if (!user || (!user.profile && !user.location)) return;
    setLoading(true);
    try {
      const targetGender = user?.profile?.gender === 'Male' ? 'Female' : 'Male';
      const queryParams = new URLSearchParams({
        gender: targetGender, location: filters.location, minAge: filters.minAge,
        maxAge: filters.maxAge, education: filters.education,
      });
      const res = await fetch(`${API_BASE_URL}/api/profiles?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        let data = await res.json();
        if (user?.profile) {
          const myInterests = user.profile.interests || [];
          const myTraits = user.profile.traits || [];
          data = data.map((profile) => {
            const sharedInterests = (profile.interests || []).filter((i) => myInterests.includes(i));
            const sharedTraits = (profile.traits || []).filter((t) => myTraits.includes(t));
            const totalShared = sharedInterests.length + sharedTraits.length;
            const maxPossible = Math.max(myInterests.length + myTraits.length, 1);
            const compatibilityScore = Math.min(Math.round((totalShared / maxPossible) * 100), 99);
            return { ...profile, sharedCount: totalShared, sharedInterests, sharedTraits, compatibilityScore };
          });
        }
        data = sortMatches(data, sortBy);
        setMatches(data);
      }
    } catch (err) {
      console.error('Failed to fetch matches', err);
    } finally {
      setLoading(false);
    }
  }, [user, token, filters, sortBy]);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const clearFilter = (key) => {
    if (key === 'age') setFilters({ ...filters, minAge: 18, maxAge: 40 });
    else setFilters({ ...filters, [key]: 'Any' });
  };

  const clearAllFilters = () => setFilters({
    minAge: 18, maxAge: 40, location: 'Any', education: 'Any'
  });

  const filteredMatches = searchQuery
    ? matches.filter((m) =>
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : matches;

  // ── Loading guard ──────────────────────────────────────────────────────────
  if (!user || (!user.profile && !user.location)) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', backgroundColor: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px', height: '64px', backgroundColor: '#ffe4e6', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
          }}>
            <svg style={{ width: '32px', height: '32px', color: '#fb7185', animation: 'spin 1s linear infinite' }}
              fill="none" viewBox="0 0 24 24">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p style={{ color: '#6b7280', fontWeight: 500 }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // ── Shared styles ──────────────────────────────────────────────────────────
  const selectStyle = {
    width: '100%', padding: '10px 32px 10px 12px', borderRadius: '12px',
    border: '1px solid #e5e7eb', fontSize: '14px', backgroundColor: 'white',
    outline: 'none', cursor: 'pointer', appearance: 'none',
    WebkitAppearance: 'none', MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px',
  };

  const labelStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600,
    color: '#4b5563', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  // ── Filter panel (shared desktop + mobile) ────────────────────────────────
  const FilterContent = ({ onApply }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Age */}
      <div>
        <label style={labelStyle}>
          <svg style={{ width: '14px', height: '14px', color: '#fb7185' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Age Range
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="number" name="minAge" value={filters.minAge} onChange={handleFilterChange} min="18" max="80"
            style={{ width: '100%', padding: '8px 12px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none' }} />
          <span style={{ color: '#d1d5db', fontWeight: 500, flexShrink: 0 }}>to</span>
          <input type="number" name="maxAge" value={filters.maxAge} onChange={handleFilterChange} min="18" max="80"
            style={{ width: '100%', padding: '8px 12px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none' }} />
        </div>
      </div>

      {/* Dynamic selects */}
      {[
        {
          name: 'location', label: 'City',
          icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
          options: [{ v: 'Any', l: 'All Cities' }, ...CITIES.map(c => ({ v: c, l: c }))]
        },
        {
          name: 'education', label: 'Education',
          icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
          options: [{ v: 'Any', l: "Doesn't Matter" }, { v: 'High School', l: 'High School' }, { v: "Bachelor's", l: "Bachelor's" }, { v: "Master's", l: "Master's" }, { v: 'PhD', l: 'PhD' }]
        },
      ].map((field) => (
        <div key={field.name}>
          <label style={labelStyle}>
            <svg style={{ width: '14px', height: '14px', color: '#fb7185' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
            </svg>
            {field.label}
          </label>
          <select name={field.name} value={filters[field.name]} onChange={handleFilterChange} style={selectStyle}>
            {field.options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>
      ))}

      {/* Buttons */}
      <div style={{ paddingTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => { fetchMatches(); if (onApply) onApply(); }}
          style={{
            width: '100%', padding: '10px',
            background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
            color: 'white', fontWeight: 600, borderRadius: '12px', border: 'none',
            cursor: 'pointer', fontSize: '14px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 4px 12px rgba(244,63,94,0.25)'
          }}>
          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Apply Filters
        </button>
        {activeFilterCount > 0 && (
          <button onClick={clearAllFilters}
            style={{
              width: '100%', padding: '8px', color: '#9ca3af', fontWeight: 500,
              borderRadius: '12px', border: 'none', background: 'transparent',
              cursor: 'pointer', fontSize: '14px'
            }}>
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    // Outer wrapper: fills viewport, stacks header → content → footer, NO extra gaps
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fafafa' }}>

      <MatchHeader />

      {/* ── Hero banner (flush under fixed header) ──────────────────────────── */}
      <div style={{ paddingTop: '64px' /* exact header height */ }}>
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #f43f5e 100%)',
          overflow: 'hidden',
        }}>
          {/* decorative dots */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.1,
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />
          {/* decorative blobs */}
          <div style={{
            position: 'absolute', top: '-96px', right: '-96px',
            width: '256px', height: '256px',
            background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(48px)'
          }} />
          <div style={{
            position: 'absolute', bottom: '-64px', left: '-64px',
            width: '192px', height: '192px',
            background: 'rgba(236,72,153,0.2)', borderRadius: '50%', filter: 'blur(32px)'
          }} />

          <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              alignItems: 'center', justifyContent: 'space-between', gap: '16px'
            }}>
              <div>
                <h1 style={{
                  fontSize: 'clamp(26px, 4vw, 38px)', fontFamily: 'serif',
                  fontWeight: 'bold', color: 'white', margin: '0 0 8px 0'
                }}>
                  Discover Your Match
                </h1>
                <p style={{
                  color: 'rgba(255,228,230,0.9)', fontSize: '15px',
                  maxWidth: '520px', lineHeight: 1.6, margin: 0
                }}>
                  Browse compatible profiles curated just for you based on your preferences and interests
                </p>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                borderRadius: '16px', padding: '16px 28px',
                border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', lineHeight: 1 }}>
                  {filteredMatches.length}
                </div>
                <div style={{ color: 'rgba(255,228,230,0.9)', fontSize: '12px', fontWeight: 500, marginTop: '4px' }}>
                  Matches Found
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content (grows to push footer down) ─────────────────────────── */}
      <div style={{ flex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

            {/* Desktop sidebar */}
            <aside style={{ width: '272px', flexShrink: 0, display: 'none' }} className="lg-sidebar">
              <div style={{
                position: 'sticky', top: '80px',
                backgroundColor: 'white', borderRadius: '20px',
                border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                overflow: 'hidden'
              }}>
                {/* sidebar header */}
                <div style={{
                  padding: '18px 20px', borderBottom: '1px solid #f3f4f6',
                  background: 'linear-gradient(135deg, rgba(255,241,242,0.9), rgba(252,231,243,0.9))'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{
                      fontWeight: 700, color: '#1f2937', margin: 0,
                      display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px'
                    }}>
                      <svg style={{ width: '20px', height: '20px', color: '#f43f5e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      Filters
                    </h3>
                    {activeFilterCount > 0 && (
                      <span style={{
                        padding: '2px 8px', backgroundColor: '#f43f5e', color: 'white',
                        fontSize: '12px', fontWeight: 700, borderRadius: '9999px'
                      }}>
                        {activeFilterCount}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <FilterContent />
                </div>
              </div>
            </aside>

            {/* Results column */}
            <main style={{ flex: 1, minWidth: 0 }}>

              {/* ── Toolbar ── */}
              <div style={{
                backgroundColor: 'white', borderRadius: '16px',
                border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                padding: '14px 16px', marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>

                  {/* Search */}
                  <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
                    <svg style={{
                      position: 'absolute', left: '12px', top: '50%',
                      transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af'
                    }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by name or city…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%', paddingLeft: '40px',
                        paddingRight: searchQuery ? '36px' : '16px',
                        paddingTop: '9px', paddingBottom: '9px',
                        borderRadius: '12px', border: '1px solid #e5e7eb',
                        fontSize: '14px', outline: 'none', backgroundColor: '#f9fafb',
                        boxSizing: 'border-box'
                      }}
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} style={{
                        position: 'absolute', right: '10px', top: '50%',
                        transform: 'translateY(-50%)', width: '20px', height: '20px',
                        borderRadius: '50%', backgroundColor: '#e5e7eb', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', padding: 0
                      }}>
                        <svg style={{ width: '12px', height: '12px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setMatches((prev) => sortMatches(prev, e.target.value)); }}
                    style={{ ...selectStyle, width: 'auto', minWidth: '152px', flex: 'none', backgroundColor: 'white' }}
                  >
                    <option value="compatibility">Best Match</option>
                    <option value="newest">Newest First</option>
                    <option value="age-asc">Age: Low → High</option>
                    <option value="age-desc">Age: High → Low</option>
                  </select>

                  {/* View toggle */}
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '4px'
                  }}>
                    {['grid', 'list'].map((mode) => (
                      <button key={mode} onClick={() => setViewMode(mode)} style={{
                        padding: '7px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: viewMode === mode ? 'white' : 'transparent',
                        boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        color: viewMode === mode ? '#f43f5e' : '#9ca3af',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {mode === 'grid' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          )}
                        </svg>
                      </button>
                    ))}
                  </div>

                  {/* Mobile filter button */}
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '9px 14px', borderRadius: '12px', border: '1px solid #e5e7eb',
                      fontSize: '14px', fontWeight: 500, color: '#4b5563',
                      backgroundColor: 'white', cursor: 'pointer'
                    }}
                  >
                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                    {activeFilterCount > 0 && (
                      <span style={{
                        width: '20px', height: '20px', backgroundColor: '#f43f5e',
                        color: 'white', fontSize: '11px', fontWeight: 700, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Active filter tags */}
                {activeFilterCount > 0 && (
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                    gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6'
                  }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500 }}>Active:</span>
                    {(filters.minAge !== 18 || filters.maxAge !== 40) && (
                      <FilterTag label="Age" value={`${filters.minAge}–${filters.maxAge}`} onClear={() => clearFilter('age')} />
                    )}
                    <FilterTag label="City" value={filters.location} onClear={() => clearFilter('location')} />
                    <FilterTag label="Education" value={filters.education} onClear={() => clearFilter('education')} />
                  </div>
                )}
              </div>

              {/* ── Cards ── */}
              {loading ? (
                <div style={{
                  display: 'grid', gap: '20px',
                  gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(270px, 1fr))' : '1fr'
                }}>
                  {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : filteredMatches.length > 0 ? (
                <>
                  <div style={{
                    display: 'grid', gap: '20px',
                    gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(270px, 1fr))' : '1fr'
                  }}>
                    {filteredMatches.map((profile, index) => (
                      <div key={profile._id || profile.id}>
                        <ProfileCard profile={profile} index={index} viewMode={viewMode} />
                      </div>
                    ))}
                  </div>
                  <p style={{
                    marginTop: '24px', textAlign: 'center',
                    fontSize: '13px', color: '#9ca3af', paddingBottom: '4px'
                  }}>
                    Showing {filteredMatches.length} of {matches.length} profiles
                    {searchQuery && (
                      <> matching "<span style={{ color: '#f43f5e', fontWeight: 500 }}>{searchQuery}</span>"</>
                    )}
                  </p>
                </>
              ) : (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', padding: '72px 24px', textAlign: 'center',
                  backgroundColor: 'white', borderRadius: '20px', border: '1px solid #f3f4f6'
                }}>
                  <div style={{
                    width: '96px', height: '96px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fff1f2, #fce7f3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '24px'
                  }}>
                    <svg style={{ width: '48px', height: '48px', color: '#fda4af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '22px', fontFamily: 'serif', fontWeight: 700,
                    color: '#1f2937', margin: '0 0 10px 0'
                  }}>
                    No matching profiles found
                  </h3>
                  <p style={{ color: '#9ca3af', maxWidth: '380px', marginBottom: '28px', lineHeight: 1.6 }}>
                    Try broadening your filters — expand the age range or choose more cities.
                  </p>
                  <button onClick={clearAllFilters} style={{
                    padding: '11px 24px',
                    background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                    color: 'white', fontWeight: 600, borderRadius: '12px',
                    border: 'none', cursor: 'pointer', fontSize: '14px',
                    boxShadow: '0 4px 12px rgba(244,63,94,0.25)',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}>
                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset All Filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ─────────────────────────────────────────────── */}
      {mobileFiltersOpen && (
        <>
          <div
            onClick={() => setMobileFiltersOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 60,
              backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)'
            }}
          />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 61,
            width: '100%', maxWidth: '360px', backgroundColor: 'white',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
            display: 'flex', flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 20px', borderBottom: '1px solid #f3f4f6'
            }}>
              <h3 style={{
                fontSize: '17px', fontWeight: 700, color: '#1f2937', margin: 0,
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <svg style={{ width: '20px', height: '20px', color: '#f43f5e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span style={{
                    padding: '2px 8px', backgroundColor: '#f43f5e', color: 'white',
                    fontSize: '12px', fontWeight: 700, borderRadius: '9999px'
                  }}>
                    {activeFilterCount}
                  </span>
                )}
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                style={{
                  width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                  backgroundColor: '#f3f4f6', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <svg style={{ width: '18px', height: '18px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              <FilterContent onApply={() => setMobileFiltersOpen(false)} />
            </div>
          </div>
        </>
      )}

      {/* ── Footer (hugs content, no gap) ───────────────────────────────────── */}
      <footer style={{ backgroundColor: '#111827', color: '#9ca3af', width: '100%' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 24px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px' }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  width: '40px', height: '40px',
                  background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <span style={{ fontSize: '22px', fontFamily: 'serif', fontWeight: 700, color: 'white' }}>
                  Subha<span style={{ color: '#fb7185' }}>Lagna</span>
                </span>
              </div>
              <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: '20px', fontSize: '14px' }}>
                The most trusted matrimonial platform. Building beautiful families since 2020.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['F', 'T', 'I', 'Y'].map((letter) => (
                  <a key={letter} href="#" style={{
                    width: '38px', height: '38px', backgroundColor: '#1f2937',
                    borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#9ca3af', textDecoration: 'none', fontSize: '13px', fontWeight: 600,
                    transition: 'all 0.3s'
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e11d48'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1f2937'; e.currentTarget.style.color = '#9ca3af'; }}>
                    {letter}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '20px', fontSize: '16px' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Home', 'About Us', 'Search Profiles', 'Success Stories', 'Pricing', 'Contact Us'].map((link) => (
                  <li key={link}>
                    <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.3s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#fb7185')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}>
                      <svg style={{ width: '12px', height: '12px', color: 'rgba(244,63,94,0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '20px', fontSize: '16px' }}>Support</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Help Center', 'Safety Tips', 'Privacy Policy', 'Terms of Service', 'Community Guidelines', 'Report an Issue'].map((link) => (
                  <li key={link}>
                    <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.3s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#fb7185')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}>
                      <svg style={{ width: '12px', height: '12px', color: 'rgba(244,63,94,0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '20px', fontSize: '16px' }}>Contact Us</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', text: 'Saheed Nagar, Bhubaneswar 751007, Odisha' },
                  { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', text: '+91 98765 43210' },
                  { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', text: 'support@subhalagna.com' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <svg style={{ width: '18px', height: '18px', color: '#fb7185', flexShrink: 0, marginTop: '2px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span style={{ fontSize: '14px', lineHeight: 1.6 }}>{item.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '24px' }}>
                <h5 style={{ color: 'white', fontWeight: 600, marginBottom: '10px', fontSize: '14px' }}>
                  Subscribe Newsletter
                </h5>
                <div style={{ display: 'flex' }}>
                  <input type="email" placeholder="Enter email" style={{
                    flex: 1, minWidth: 0, padding: '10px 14px',
                    backgroundColor: '#1f2937', border: '1px solid #374151',
                    borderRight: 'none', borderRadius: '12px 0 0 12px',
                    fontSize: '14px', outline: 'none', color: 'white'
                  }} />
                  <button style={{
                    padding: '10px 14px', backgroundColor: '#e11d48', border: 'none',
                    borderRadius: '0 12px 12px 0', cursor: 'pointer', color: 'white',
                    display: 'flex', alignItems: 'center'
                  }}>
                    <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div style={{ borderTop: '1px solid #1f2937' }}>
          <div style={{
            maxWidth: '1280px', margin: '0 auto', padding: '20px 24px',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: '12px'
          }}>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
              © {new Date().getFullYear()} SubhaLagna. All rights reserved. Made with{' '}
              <span style={{ color: '#f43f5e' }}>❤</span> for you.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px' }}>
              {['Privacy', 'Terms', 'Cookies'].map((link) => (
                <a key={link} href="#" style={{ color: '#6b7280', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fb7185')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── Global styles injected once ────────────────────────────────────── */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; padding: 0; }

        /* Show sidebar only on large screens */
        @media (min-width: 1024px) {
          .lg-sidebar { display: block !important; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MatchResults;