import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { token, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full py-5 px-4 md:px-8 flex items-center justify-between animate-fade-in relative z-10 glass-panel border-b border-pink-100/60 bg-white/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Logo Icon */}
        <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 shadow-lg shadow-pink-200/50 flex items-center justify-center overflow-hidden">
          {/* Decorative inner glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-xl"></div>
          {/* Heart with rings icon */}
          <svg
            className="w-6 h-6 text-white relative z-10 drop-shadow-sm"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer heart */}
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="currentColor"
              opacity="0.9"
            />
            {/* Two interlocking rings */}
            <circle
              cx="9.5"
              cy="10"
              r="2.5"
              stroke="white"
              strokeWidth="1.2"
              fill="none"
              opacity="0.85"
            />
            <circle
              cx="14.5"
              cy="10"
              r="2.5"
              stroke="white"
              strokeWidth="1.2"
              fill="none"
              opacity="0.85"
            />
          </svg>
        </div>

        {/* Brand Text */}
        <Link to="/" className="hover:opacity-80 transition-opacity group">
          <h1 className="text-2xl font-serif font-bold m-0 leading-tight tracking-tight">
            <span className="text-gray-700 group-hover:text-gray-800 transition-colors">
              Subha
            </span>
            <span className="bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
              Lagna
            </span>
          </h1>
          <p className="text-[10px] text-pink-400 font-semibold uppercase tracking-[0.2em] mt-0.5">
            ❦ Matrimony
          </p>
        </Link>
      </div>

      <div>
        {token ? (
          <nav className="flex items-center gap-4 md:gap-6">
            <Link
              to="/matches"
              className="text-sm font-semibold text-gray-500 hover:text-pink-500 transition-colors"
            >
              Find Matches
            </Link>
            <Link
              to="/profile"
              className="text-sm font-semibold text-gray-500 hover:text-pink-500 transition-colors"
            >
              My Profile
            </Link>
            <div className="h-5 w-px bg-pink-200/60 mx-1"></div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-pink-50 border border-pink-200 text-sm font-bold text-pink-600 hover:bg-pink-100 hover:border-pink-300 transition-all duration-200"
            >
              Log Out
            </button>
          </nav>
        ) : (
          <span className="text-sm font-medium text-gray-400 hidden md:inline-block italic">
            ✦ Trusted Matrimony ✦
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;