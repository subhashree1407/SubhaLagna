import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ profile, index, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const animationDelay = Math.min(index * 80, 500);
  const isList = viewMode === 'list';

  const getProfileImage = () => profile.image || profile.profilePhoto || '/man.png';

  const handleNavigate = () => navigate(`/profile/${profile._id || profile.id}`);

  // ── Compatibility badge ───────────────────────────────────────────────────
  const CompatibilityBadge = () => {
    if (!profile.sharedCount) return null;
    return (
      <div style={{
        position: 'absolute', top: '14px', left: '14px', zIndex: 30,
        display: 'flex', alignItems: 'center', gap: '5px',
        padding: '5px 10px',
        background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
        backdropFilter: 'blur(8px)',
        color: 'white', borderRadius: '9999px',
        fontSize: '11px', fontWeight: 700,
        boxShadow: '0 4px 12px rgba(244,63,94,0.4)',
        letterSpacing: '0.01em',
      }}>
        <svg style={{ width: '12px', height: '12px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
        {profile.sharedCount} Shared
      </div>
    );
  };

  // ── Compatibility score ring ──────────────────────────────────────────────
  const ScoreRing = () => {
    if (!profile.compatibilityScore) return null;
    const score = profile.compatibilityScore;
    const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#f43f5e';
    return (
      <div style={{
        position: 'absolute', top: '14px', right: '14px', zIndex: 30,
        width: '44px', height: '44px', borderRadius: '50%',
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        border: `2px solid ${color}`,
        boxShadow: `0 0 12px ${color}55`,
      }}>
        <span style={{ fontSize: '13px', fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.03em' }}>MATCH</span>
      </div>
    );
  };

  // ── Name + location overlay ───────────────────────────────────────────────
  const NameBanner = () => (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '32px 18px 18px',
      background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
      zIndex: 20,
    }}>
      <h3 style={{
        color: 'white', fontSize: '20px', fontFamily: 'serif',
        fontWeight: 700, margin: '0 0 4px 0',
        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
        letterSpacing: '0.01em', lineHeight: 1.2,
      }}>
        {profile.name}, {profile.age}
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,210,215,0.95)', fontSize: '12px', fontWeight: 500 }}>
        <svg style={{ width: '13px', height: '13px', flexShrink: 0, color: '#fb7185' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {profile.location || 'Location not provided'}
      </div>
    </div>
  );

  // ── Info pill ─────────────────────────────────────────────────────────────
  const InfoPill = ({ icon, label, value }) => (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '3px',
    }}>
      <span style={{
        fontSize: '9px', fontWeight: 700, color: '#9ca3af',
        textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: '13px', fontWeight: 600, color: '#1f2937',
        lineHeight: 1.3,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {value || '—'}
      </span>
    </div>
  );

  // ── View Profile button ───────────────────────────────────────────────────
  const ViewButton = ({ fullWidth = false }) => (
    <button
      onClick={handleNavigate}
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: '11px 20px',
        borderRadius: '14px',
        border: '1.5px solid #fecdd3',
        background: 'linear-gradient(135deg, #fff1f2, #fce7f3)',
        color: '#e11d48',
        fontWeight: 700,
        fontSize: '13px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        transition: 'all 0.25s ease',
        letterSpacing: '0.01em',
        boxShadow: '0 2px 8px rgba(244,63,94,0.08)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, #f43f5e, #ec4899)';
        e.currentTarget.style.color = 'white';
        e.currentTarget.style.borderColor = '#f43f5e';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,63,94,0.35)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, #fff1f2, #fce7f3)';
        e.currentTarget.style.color = '#e11d48';
        e.currentTarget.style.borderColor = '#fecdd3';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(244,63,94,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      View Full Profile
      <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  );

  // ── Card shell styles ─────────────────────────────────────────────────────
  const cardBase = {
    backgroundColor: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid #f3f4f6',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'all 0.3s ease',
    animationDelay: `${animationDelay}ms`,
    animationFillMode: 'both',
  };

  // ════════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ════════════════════════════════════════════════════════════════════════════
  if (isList) {
    return (
      <div
        style={{ ...cardBase, display: 'flex', flexDirection: 'row' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(244,63,94,0.12)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.borderColor = '#fecdd3';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = '#f3f4f6';
        }}
      >
        {/* Image */}
        <div style={{
          position: 'relative', width: '260px', flexShrink: 0,
          overflow: 'hidden', backgroundColor: '#f3f4f6',
        }}>
          <img
            src={getProfileImage()}
            alt={profile.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              display: 'block', transition: 'transform 0.6s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <CompatibilityBadge />
          <ScoreRing />
          <NameBanner />
        </div>

        {/* Content */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          padding: '28px 32px',
        }}>
          {/* Stats row */}
          <div style={{
            display: 'flex', gap: '32px', flexWrap: 'wrap',
            paddingBottom: '20px',
            borderBottom: '1px solid #f3f4f6',
            marginBottom: '20px',
          }}>
            <InfoPill label="Profession" value={profile.profession} />
            <InfoPill label="Education" value={profile.education} />
            <InfoPill label="Height" value={profile.height} />
            <InfoPill label="Caste" value={profile.caste} />
            <InfoPill label="Religion" value={profile.religion} />
          </div>

          {/* Bio */}
          <div style={{ flex: 1, marginBottom: '24px' }}>
            <span style={{
              display: 'block', fontSize: '9px', fontWeight: 700,
              color: '#9ca3af', textTransform: 'uppercase',
              letterSpacing: '0.08em', marginBottom: '8px',
            }}>
              About
            </span>
            <p style={{
              color: '#4b5563', fontSize: '14px', lineHeight: 1.75,
              margin: 0,
              display: '-webkit-box', WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {profile.bio || "This user hasn't written a bio yet."}
            </p>
          </div>

          {/* Interests */}
          {profile.sharedInterests?.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <span style={{
                display: 'block', fontSize: '9px', fontWeight: 700,
                color: '#9ca3af', textTransform: 'uppercase',
                letterSpacing: '0.08em', marginBottom: '8px',
              }}>
                Shared Interests
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {profile.sharedInterests.slice(0, 5).map((interest) => (
                  <span key={interest} style={{
                    padding: '4px 10px', borderRadius: '9999px',
                    backgroundColor: '#fff1f2', color: '#e11d48',
                    fontSize: '11px', fontWeight: 600,
                    border: '1px solid #fecdd3',
                  }}>
                    {interest}
                  </span>
                ))}
                {profile.sharedInterests.length > 5 && (
                  <span style={{
                    padding: '4px 10px', borderRadius: '9999px',
                    backgroundColor: '#f3f4f6', color: '#6b7280',
                    fontSize: '11px', fontWeight: 600,
                  }}>
                    +{profile.sharedInterests.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Button */}
          <div style={{ marginTop: 'auto' }}>
            <ViewButton />
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // GRID VIEW
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div
      style={{ ...cardBase, display: 'flex', flexDirection: 'column', height: '100%' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(244,63,94,0.12)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = '#fecdd3';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#f3f4f6';
      }}
    >
      {/* ── Image block ── */}
      <div style={{
        position: 'relative', height: '240px',
        flexShrink: 0, overflow: 'hidden', backgroundColor: '#f3f4f6',
      }}>
        <img
          src={getProfileImage()}
          alt={profile.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            display: 'block', transition: 'transform 0.6s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <CompatibilityBadge />
        <ScoreRing />
        <NameBanner />
      </div>

      {/* ── Body ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '20px 20px 20px',
      }}>

        {/* Info grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '14px 12px',
          paddingBottom: '16px',
          borderBottom: '1px solid #f9fafb',
          marginBottom: '16px',
        }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <InfoPill label="Profession" value={profile.profession} />
          </div>
          <InfoPill label="Education" value={profile.education} />
          <InfoPill label="Height" value={profile.height} />
          <InfoPill label="Caste" value={profile.caste} />
          <InfoPill label="Religion" value={profile.religion} />
        </div>

        {/* Bio */}
        <div style={{ flex: 1, marginBottom: '16px' }}>
          <span style={{
            display: 'block', fontSize: '9px', fontWeight: 700,
            color: '#9ca3af', textTransform: 'uppercase',
            letterSpacing: '0.08em', marginBottom: '6px',
          }}>
            About
          </span>
          <p style={{
            color: '#6b7280', fontSize: '13px', lineHeight: 1.7,
            margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {profile.bio || "This user hasn't written a bio yet."}
          </p>
        </div>

        {/* Shared interests */}
        {profile.sharedInterests?.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {profile.sharedInterests.slice(0, 3).map((interest) => (
                <span key={interest} style={{
                  padding: '3px 9px', borderRadius: '9999px',
                  backgroundColor: '#fff1f2', color: '#e11d48',
                  fontSize: '11px', fontWeight: 600,
                  border: '1px solid #fecdd3',
                }}>
                  {interest}
                </span>
              ))}
              {profile.sharedInterests.length > 3 && (
                <span style={{
                  padding: '3px 9px', borderRadius: '9999px',
                  backgroundColor: '#f3f4f6', color: '#6b7280',
                  fontSize: '11px', fontWeight: 600,
                }}>
                  +{profile.sharedInterests.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
          <ViewButton fullWidth />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;