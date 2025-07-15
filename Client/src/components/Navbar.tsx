import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="w-full p-4 flex justify-between items-center bg-white shadow-md border-b-2 border-[var(--theme-outline)]">
      {/* Brand/logo */}
      <div className="font-extrabold text-[var(--theme-primary)] text-xl tracking-tight">
        <Link to="/">LeaseClarityPRO</Link>
      </div>
      {/* Navigation links */}
      <div className="flex items-center gap-6">
        {user && (
          <>
            <Link
              to="/dashboard"
              className="text-[var(--theme-outline)] font-semibold text-base hover:text-[var(--theme-primary)] transition"
            >
              Dashboard
            </Link>
            <Link
              to="/upload"
              className="text-[var(--theme-outline)] font-semibold text-base hover:text-[var(--theme-primary)] transition"
            >
              Upload
            </Link>
          </>
        )}
      </div>
      {/* Auth state */}
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-[var(--theme-outline)] font-semibold text-base truncate max-w-[8rem]">
              {user.firstName ?? user.email}
            </span>
            <button
              className="bg-[var(--theme-button)] text-white px-3 py-1 rounded-lg font-bold text-xs hover:bg-[var(--theme-outline)] hover:text-white focus:outline-none transition"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-[var(--theme-primary)] font-bold underline text-base px-3 py-1 rounded-lg hover:bg-[var(--theme-accent)] focus:outline-none transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
