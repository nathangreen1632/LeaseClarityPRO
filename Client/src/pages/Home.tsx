import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';

export default function HomePage() {
  return (
    <PageContainer>
      <header className="text-center py-24 sm:py-30">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-red-500 tracking-tighter">
          Digital Lease Reader
        </h1>
        <p className="mt-2 text-white font-medium text-base sm:text-lg">
          Instantly understand your lease.
        </p>
      </header>
      <div className="flex flex-col items-center justify-center">
        <Link to="/login" aria-label="Login">
          <button
            type="button"
            className="
            w-20 h-20 sm:w-24 sm:h-24
            rounded-full bg-black flex items-center justify-center mb-2
            shadow-md border-2 border-red-500 cursor-pointer
            hover:scale-105 transition-transform
          "
          >
          <span className="text-3xl sm:text-4xl text-red-500 font-extrabold">
            PDF
          </span>
          </button>
        </Link>
        <p className="text-white text-center font-semibold text-sm sm:text-base">
          Upload. Parse. Know your rights.
        </p>
      </div>
    </PageContainer>
  );
}
