import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';

export default function HomePage() {
  return (
    <PageContainer>
      <header className="text-center py-8">
        <h1 className="text-3xl font-extrabold text-red-500 tracking-tighter sm:text-4xl">
          Digital Lease Reader
        </h1>
        <p className="mt-2 text-white font-medium text-base">
          Instantly understand your lease.
        </p>
      </header>
      {/* File upload UI and summary coming next */}
      <div className="my-8 flex flex-col items-center justify-center mt-72">
        <Link to="/login" aria-label="Login">
          <button
            type="button"
            className="w-24 h-24 rounded-full bg-black flex items-center justify-center mb-2 shadow-md border-2 border-red-500 cursor-pointer hover:scale-105 transition-transform"
          >
            <span className="text-4xl text-red-500 font-extrabold">
              PDF
            </span>
          </button>
        </Link>
        <p className="text-white text-center font-semibold">
          Upload. Parse. Know your rights.
        </p>
      </div>
    </PageContainer>
  );
}
