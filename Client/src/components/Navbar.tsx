import { useState } from 'react';
import { Link, type NavigateFunction, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Menu, X } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate: NavigateFunction = useNavigate();

  return (
    <nav className="w-full px-4 py-3 flex justify-between items-center bg-black shadow-md border-b-2 border-[var(--theme-outline)] relative z-50">
      <div className="font-extrabold text-white text-xl tracking-tight">
        <Link to="/">
          <span>LeaseClarity</span>
          <span className="text-red-500">PRO</span>
        </Link>
      </div>

      <button
        className="md:hidden flex items-center justify-center text-white p-2"
        onClick={(): void => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
      </button>

      <div className="hidden md:flex items-center gap-6">
        {user && (
          <>
            <Link
              to="/dashboard"
              className="text-white font-semibold text-base hover:text-[var(--theme-primary)] transition"
            >
              Dashboard
            </Link>
            <Link
              to="/lease-review"
              className="text-white font-semibold text-base hover:text-[var(--theme-primary)] transition"
            >
              Tenant Rights
            </Link>
            <Link
              to="/upload"
              className="text-white font-semibold text-base hover:text-[var(--theme-primary)] transition"
            >
              Upload
            </Link>
          </>
        )}
      </div>

      <div className="hidden md:flex items-center">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold text-base truncate max-w-[8rem]">
              {user.firstName ?? user.email}
            </span>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-xs hover:bg-red-700 hover:text-white focus:outline-none transition"
              onClick={(): void => {
                logout();
                navigate('/');
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-[var(--theme-light)] font-bold underline text-base px-3 py-1 rounded-lg hover:bg-[var(--theme-success)] hover:text-[var(--theme-base)] focus:outline-none transition"
          >
            Sign In
          </Link>
        )}
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-b-2 border-[var(--theme-outline)] shadow-lg flex flex-col items-center py-4 gap-4 animate-fade-in-down">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="block w-full text-center text-[var(--theme-light)] font-semibold text-lg hover:text-[var(--theme-primary)] transition"
                onClick={(): void => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/lease-review"
                className="block w-full text-center text-[var(--theme-light)] font-semibold text-lg hover:text-[var(--theme-primary)] transition"
                onClick={(): void => setMenuOpen(false)}
              >
                Tenant Rights
              </Link>
              <Link
                to="/upload"
                className="block w-full text-center text-[var(--theme-light)] font-semibold text-lg hover:text-[var(--theme-primary)] transition"
                onClick={(): void => setMenuOpen(false)}
              >
                Upload
              </Link>
              <div className="w-full flex flex-col items-center gap-2 mt-2">
                <span className="text-[var(--theme-light)] font-semibold text-base truncate max-w-[12rem]">
                  {user.firstName ?? user.email}
                </span>
                <button
                  className="bg-[var(--theme-error)] text-[var(--theme-light)] px-4 py-2 rounded-lg font-bold text-base hover:bg-[var(--theme-error)] hover:text-[var(--theme-light)] focus:outline-none transition"
                  onClick={(): void => {
                    logout();
                    setMenuOpen(false);
                    navigate('/');
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="block w-full text-center text-[var(--theme-light)] font-bold underline text-lg px-3 py-1 rounded-lg hover:bg-[var(--theme-success)] focus:outline-none transition"
              onClick={(): void => setMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
