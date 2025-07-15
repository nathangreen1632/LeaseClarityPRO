import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const INIT_LOGIN = { email: '', password: '' };
const INIT_REGISTER = { email: '', password: '', firstName: '', lastName: '' };

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fields, setFields] = useState(INIT_LOGIN);
  const { login, register, loading, error } = useAuthStore();

  const switchMode = () => {
    if (mode === 'login') {
      setMode('register');
      setFields(INIT_REGISTER);
    } else {
      setMode('login');
      setFields(INIT_LOGIN);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(fields as any);
    } else {
      await register(fields as any);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg p-6 border-2 border-[var(--theme-outline)]">
      <h2 className="text-2xl font-bold text-center text-[var(--theme-primary)] mb-4">
        {mode === 'login' ? 'Sign In' : 'Register'}
      </h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit} autoComplete="off">
        {mode === 'register' && (
          <>
            <input
              name="firstName"
              placeholder="First Name"
              value={(fields as any).firstName || ''}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 focus:outline-[var(--theme-primary)]"
              autoFocus
              required
              autoComplete="given-name"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={(fields as any).lastName ?? ''}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 focus:outline-[var(--theme-primary)]"
              required
              autoComplete="family-name"
            />
          </>
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={fields.email}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 focus:outline-[var(--theme-primary)]"
          autoFocus={mode === 'login'}
          required
          autoComplete="email"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={fields.password}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 focus:outline-[var(--theme-primary)]"
          required
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
        <button
          type="submit"
          className={`bg-[var(--theme-primary)] text-white font-bold rounded-lg py-2 mt-3 transition-colors hover:bg-[var(--theme-accent)] hover:text-[var(--theme-primary)] ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Register'}
        </button>
      </form>
      {error && (
        <div className="text-[var(--theme-error)] text-center font-semibold mt-3">
          {error}
        </div>
      )}
      <div className="text-center mt-4">
        <button
          type="button"
          className="text-[var(--theme-primary)] underline font-medium"
          onClick={switchMode}
        >
          {mode === 'login'
            ? "Don't have an account? Register"
            : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
