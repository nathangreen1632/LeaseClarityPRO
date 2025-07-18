import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="w-full p-4 flex justify-between items-center bg-black shadow-md border-b-2 border-[var(--theme-outline)]">
      {/* Brand/logo */}
      <div className="font-extrabold text-white text-xl tracking-tight">
        <Link to="/"><span>LeaseClarity</span>
          <span className="text-red-500">PRO</span>
        </Link>
      </div>
      {/* Navigation links */}
      <div className="flex items-center gap-6">
        {user && (
          <>
            <Link
              to="/dashboard"
              className="text-white font-semibold text-base hover:text-[var(--theme-primary)] transition"
            >
              Dashboard
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
      {/* Auth state */}
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold text-base truncate max-w-[8rem]">
              {user.firstName ?? user.email}
            </span>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-xs hover:bg-red-700 hover:text-white focus:outline-none transition"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-slate-50 font-bold underline text-base px-3 py-1 rounded-lg hover:bg-emerald-500 focus:outline-none transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
