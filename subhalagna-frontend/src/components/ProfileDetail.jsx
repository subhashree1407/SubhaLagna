import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

// ─── Shared Header (identical to MatchResults) ─────────────────────────────
const ProfileHeader = () => {
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
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      backgroundColor: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(16px)',
      boxShadow: scrolled ? '0 4px 20px rgba(244,63,94,0.08)' : '0 1px 0 rgba(0,0,0,0.06)',
      transition: 'all 0.4s ease',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Logo */}
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

          {/* Back Action */}
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '8px', border: '1px solid #e5e7eb',
              backgroundColor: 'white', cursor: 'pointer', fontSize: '13px',
              fontWeight: 600, color: '#4b5563',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fecdd3'; e.currentTarget.style.color = '#e11d48'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#4b5563'; }}
          >
            <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* User dropdown */}
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

          {/* Dropdown panel */}
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
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                {user?.name}
              </p>
              <p style={{ fontSize: '12px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: '2px 0 0 0' }}>
                {user?.email}
              </p>
            </div>
            <div style={{ padding: '8px' }}>
              {[
                { label: 'My Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { label: '👑 Premium', path: '/premium', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              ].map((item) => (
                <Link key={item.label} to={item.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                    borderRadius: '12px', fontSize: '14px', color: '#4b5563',
                    textDecoration: 'none', transition: 'all 0.2s'
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

// ─── Shared Footer (identical to MatchResults) ─────────────────────────────
const ProfileFooter = () => (
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

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '20px', fontSize: '16px', margin: '0 0 20px 0' }}>Quick Links</h4>
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
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '20px', fontSize: '16px', margin: '0 0 20px 0' }}>Support</h4>
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
          <h4 style={{ color: 'white', fontWeight: 700, fontSize: '16px', margin: '0 0 20px 0' }}>Contact Us</h4>
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
            <h5 style={{ color: 'white', fontWeight: 600, fontSize: '14px', margin: '0 0 10px 0' }}>
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

    {/* Bottom bar */}
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
);

// ─── Main ProfileDetail ─────────────────────────────────────────────────────
const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchRequested, setMatchRequested] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/profiles/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          // Prefer image if present, fallback to profilePhoto, then generic avatar
          const imgUrl = data.image || data.profilePhoto || (data.gender === 'Female' ? '/woman.png' : '/man.png');
          setActivePhoto(imgUrl);
        } else {
          setError('Profile not found or access denied.');
        }
      } catch {
        setError('Failed to connect to server.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, token]);

  const handleMatchRequest = () => {
    setMatchRequested(true);
    setTimeout(() => {
      alert('Match Request Sent! You will be notified when they respond.');
    }, 400);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fafafa'
    }}>
      <ProfileHeader />
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingTop: '64px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            border: '4px solid #fecdd3', borderTopColor: '#f43f5e',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
          }} />
          <p style={{ color: '#9ca3af', fontSize: '14px', fontWeight: 500 }}>Loading profile…</p>
        </div>
      </div>
      <ProfileFooter />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; padding: 0; }
      `}</style>
    </div>
  );

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !profile) return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <ProfileHeader />
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingTop: '64px', padding: '80px 24px'
      }}>
        <div style={{
          maxWidth: '440px', width: '100%', textAlign: 'center',
          backgroundColor: 'white', borderRadius: '24px',
          border: '1px solid #f3f4f6', padding: '48px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #fff1f2, #fce7f3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <svg style={{ width: '36px', height: '36px', color: '#fda4af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 style={{ fontSize: '22px', fontFamily: 'serif', fontWeight: 700, color: '#1f2937', margin: '0 0 8px 0' }}>
            Profile Unavailable
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: 1.6, margin: '0 0 28px 0' }}>
            {error || 'Something went wrong.'}
          </p>
          <button onClick={() => navigate(-1)} style={{
            padding: '11px 28px',
            background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
            color: 'white', fontWeight: 600, borderRadius: '12px', border: 'none',
            cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(244,63,94,0.25)'
          }}>
            ← Go Back
          </button>
        </div>
      </div>
      <ProfileFooter />
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { margin: 0; padding: 0; }`}</style>
    </div>
  );

  // ── Stat tile ──────────────────────────────────────────────────────────────
  const StatTile = ({ label, value, iconPath }) => (
    <div style={{
      backgroundColor: '#fff8f8', borderRadius: '16px',
      padding: '16px', border: '1px solid #fce7f3',
      display: 'flex', flexDirection: 'column', gap: '6px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <svg style={{ width: '14px', height: '14px', color: '#f43f5e', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
        </svg>
        <span style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </span>
      </div>
      <span style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>
        {value || '—'}
      </span>
    </div>
  );

  // ── Info row ───────────────────────────────────────────────────────────────
  const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingBottom: '14px', borderBottom: '1px solid #f9fafb' }}>
      <span style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </span>
      <span style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937' }}>
        {value || '—'}
      </span>
    </div>
  );

  // ── Tag pill ───────────────────────────────────────────────────────────────
  const Tag = ({ label, color = 'rose' }) => {
    const colors = {
      rose: { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' },
      purple: { bg: '#faf5ff', text: '#7c3aed', border: '#e9d5ff' },
    };
    const c = colors[color];
    return (
      <span style={{
        padding: '5px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
        backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}`
      }}>
        {label}
      </span>
    );
  };

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fafafa' }}>

      <ProfileHeader />

      {/* ── Page content (offset by header height) ── */}
      <div style={{ flex: 1, paddingTop: '64px' }}>

        {/* ── Main grid ── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px' }} className="profile-grid">

            {/* ══ LEFT COLUMN ══════════════════════════════════════════════════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="profile-left">

              {/* Photo card */}
              <div style={{
                backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden',
                border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(244,63,94,0.08)'
              }}>
                {/* Main photo */}
                <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                  <img
                    src={activePhoto}
                    alt={profile.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 45%, transparent 100%)',
                    pointerEvents: 'none'
                  }} />
                  {/* Name overlay */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px' }}>
                    <h1 style={{
                      color: 'white', fontSize: '26px', fontFamily: 'serif',
                      fontWeight: 700, margin: '0 0 6px 0',
                      textShadow: '0 2px 8px rgba(0,0,0,0.4)'
                    }}>
                      {profile.name}, {profile.age}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(255,200,210,0.95)', fontSize: '13px', fontWeight: 500 }}>
                      <svg style={{ width: '14px', height: '14px', color: '#fb7185', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {profile.location || 'Location Private'}
                    </div>
                  </div>
                </div>

                {/* Thumbnail strip */}
                {profile.additionalPhotos?.length > 0 && (
                  <div style={{ padding: '14px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
                    {[profile.image || profile.profilePhoto || (profile.gender === 'Female' ? '/woman.png' : '/man.png'), ...profile.additionalPhotos].map((img, idx) => (
                      <button key={idx} onClick={() => setActivePhoto(img)}
                        style={{
                          width: '60px', height: '60px', flexShrink: 0, borderRadius: '10px',
                          overflow: 'hidden', border: activePhoto === img ? '2.5px solid #f43f5e' : '2.5px solid transparent',
                          padding: 0, cursor: 'pointer', transition: 'border-color 0.2s',
                          boxShadow: activePhoto === img ? '0 0 0 3px rgba(244,63,94,0.15)' : 'none'
                        }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={handleMatchRequest}
                  disabled={matchRequested}
                  style={{
                    width: '100%', padding: '14px 20px', borderRadius: '16px', border: 'none',
                    cursor: matchRequested ? 'default' : 'pointer', fontSize: '15px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    transition: 'all 0.25s ease',
                    background: matchRequested
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'linear-gradient(135deg, #f43f5e, #ec4899)',
                    color: 'white',
                    boxShadow: matchRequested
                      ? '0 4px 16px rgba(16,185,129,0.3)'
                      : '0 4px 16px rgba(244,63,94,0.35)',
                  }}
                  onMouseEnter={(e) => { if (!matchRequested) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {matchRequested ? (
                    <>
                      <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Interest Sent!
                    </>
                  ) : (
                    <>
                      <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      Express Interest
                    </>
                  )}
                </button>

                <button style={{
                  width: '100%', padding: '13px 20px', borderRadius: '16px',
                  border: '1.5px solid #fecdd3', backgroundColor: 'white',
                  color: '#e11d48', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  transition: 'all 0.25s ease', boxShadow: '0 2px 8px rgba(244,63,94,0.08)'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff1f2';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,63,94,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(244,63,94,0.08)';
                  }}
                >
                  <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Shortlist Profile
                </button>
              </div>
            </div>

            {/* ══ RIGHT COLUMN ═════════════════════════════════════════════════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="profile-right">

              {/* About */}
              <div style={{
                backgroundColor: 'white', borderRadius: '20px',
                border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '28px'
              }}>
                <h2 style={{
                  fontSize: '20px', fontFamily: 'serif', fontWeight: 700,
                  color: '#1f2937', margin: '0 0 16px 0',
                  paddingBottom: '14px', borderBottom: '1px solid #f3f4f6'
                }}>
                  About
                </h2>
                <p style={{
                  color: '#4b5563', fontSize: '15px', lineHeight: 1.8,
                  fontStyle: 'italic', margin: '0 0 24px 0'
                }}>
                  "{profile.bio || 'No description provided yet.'}"
                </p>

                {/* Quick stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px'
                }} className="stats-grid">
                  <StatTile label="Religion" value={profile.religion}
                    iconPath="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  <StatTile label="Caste" value={profile.caste}
                    iconPath="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  <StatTile label="Height" value={profile.height}
                    iconPath="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  <StatTile label="Education" value={profile.education}
                    iconPath="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </div>
              </div>

              {/* Education & Career + Family */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }} className="info-cards-grid">

                {/* Education & Career */}
                <div style={{
                  backgroundColor: 'white', borderRadius: '20px',
                  border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  padding: '24px'
                }}>
                  <h3 style={{
                    fontSize: '16px', fontFamily: 'serif', fontWeight: 700,
                    color: '#1f2937', margin: '0 0 20px 0',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}>
                    <svg style={{ width: '18px', height: '18px', color: '#f43f5e', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Education & Career
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <InfoRow label="Highest Degree" value={profile.education} />
                    <InfoRow label="Profession" value={profile.profession} />
                  </div>
                </div>

                {/* Family Background */}
                <div style={{
                  backgroundColor: 'white', borderRadius: '20px',
                  border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  padding: '24px'
                }}>
                  <h3 style={{
                    fontSize: '16px', fontFamily: 'serif', fontWeight: 700,
                    color: '#1f2937', margin: '0 0 20px 0',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}>
                    <svg style={{ width: '18px', height: '18px', color: '#f43f5e', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Family Background
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <InfoRow label="Father's Status" value={profile.family?.fatherName} />
                    <InfoRow label="Mother's Status" value={profile.family?.motherName} />
                  </div>
                </div>
              </div>

              {/* Interests & Traits */}
              <div style={{
                backgroundColor: 'white', borderRadius: '20px',
                border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '24px'
              }}>
                <h3 style={{
                  fontSize: '16px', fontFamily: 'serif', fontWeight: 700,
                  color: '#1f2937', margin: '0 0 20px 0',
                  paddingBottom: '14px', borderBottom: '1px solid #f3f4f6'
                }}>
                  Personality & Hobbies
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <span style={{
                      display: 'block', fontSize: '10px', fontWeight: 700, color: '#9ca3af',
                      textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px'
                    }}>
                      Interests
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(profile.interests?.length ? profile.interests : ['Music', 'Travel', 'Reading']).map((interest) => (
                        <Tag key={interest} label={interest} color="rose" />
                      ))}
                    </div>
                  </div>

                  <div>
                    <span style={{
                      display: 'block', fontSize: '10px', fontWeight: 700, color: '#9ca3af',
                      textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px'
                    }}>
                      Traits
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(profile.traits?.length ? profile.traits : ['Creative', 'Calm', 'Optimistic']).map((trait) => (
                        <Tag key={trait} label={trait} color="purple" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Partner expectations */}
              {profile.partnerInterests && (
                <div style={{
                  borderRadius: '20px', overflow: 'hidden',
                  border: '1px solid #fecdd3',
                  background: 'linear-gradient(135deg, #fff1f2 0%, #fce7f3 100%)',
                  padding: '24px', boxShadow: '0 4px 16px rgba(244,63,94,0.1)'
                }}>
                  <h3 style={{
                    fontSize: '16px', fontFamily: 'serif', fontWeight: 700,
                    color: '#e11d48', margin: '0 0 12px 0',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}>
                    <svg style={{ width: '18px', height: '18px' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    Ideally, I'm looking for…
                  </h3>
                  <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: 1.75, margin: 0 }}>
                    {profile.partnerInterests}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProfileFooter />

      {/* ── Responsive grid styles + global resets ── */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; padding: 0; }

        /* Two-column layout on large screens */
        @media (min-width: 1024px) {
          .profile-grid {
            grid-template-columns: 360px 1fr !important;
          }
          .info-cards-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }

        /* Slightly larger stats on medium screens */
        @media (min-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .info-cards-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProfileDetail;