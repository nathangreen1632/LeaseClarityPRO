import React, {type FormEvent, useState} from 'react';
import { useAuthStore } from '../store/useAuthStore';

const INIT_LOGIN = { email: '', password: '' };
const INIT_REGISTER = { email: '', password: '', firstName: '', lastName: '' };

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fields, setFields] = useState(INIT_LOGIN);
  const { login, register, loading, error } = useAuthStore();

  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const switchMode: () => void = (): void => {
    if (mode === 'login') {
      setMode('register');
      setFields(INIT_REGISTER);
      setConfirmPassword('');
      setPasswordError('');
    } else {
      setMode('login');
      setFields(INIT_LOGIN);
      setConfirmPassword('');
      setPasswordError('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFields((f: {email: string; password: string}): {email: string; password: string} => ({ ...f, [e.target.name]: e.target.value }));
    if (e.target.name === 'password') setPasswordError('');
  };

  const handleSubmit: (e: FormEvent) => Promise<void> = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (mode === 'register') {
      if (fields.password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      setPasswordError('');
      await register(fields as any);
    } else {
      await login(fields as any);
    }
  };

  let submitLabel: string;
  if (loading) {
    submitLabel = 'Please wait…';
  } else if (mode === 'login') {
    submitLabel = 'Sign In';
  } else {
    submitLabel = 'Register';
  }


  return (
    <div className="w-full max-w-sm mx-auto bg-[var(--theme-dark)] rounded-2xl shadow-lg p-6 border-2 border-[var(--theme-outline)]">
      <h2 className="text-2xl font-bold text-center text-[var(--theme-light)] mb-4">
        {mode === 'login' ? 'Sign In' : 'Register'}
      </h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit} autoComplete="on">
        {mode === 'register' && (
          <>
            <input
              name="firstName"
              placeholder="First Name"
              value={(fields as any).firstName ?? ''}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 bg-[var(--theme-light)] focus:outline-[var(--theme-primary)]"
              autoFocus
              required
              autoComplete="given-name"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={(fields as any).lastName ?? ''}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 bg-[var(--theme-light)] focus:outline-[var(--theme-primary)]"
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
          className="border rounded-lg px-3 py-2 bg-[var(--theme-light)] focus:outline-[var(--theme-primary)]"
          autoFocus={mode === 'login'}
          required
          autoComplete="email"
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={fields.password}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 bg-[var(--theme-light)] focus:outline-[var(--theme-primary)] w-full pr-16"
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--theme-primary)] font-bold underline"
            onClick={() => setShowPassword(v => !v)}
          >
            {showPassword ? "Hide" : "View"}
          </button>
        </div>

        {mode === 'register' && (
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value);
                setPasswordError('');
              }}
              className="border rounded-lg px-3 py-2 bg-[var(--theme-light)] focus:outline-[var(--theme-primary)] w-full pr-16"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--theme-primary)] font-bold underline"
              onClick={() => setShowConfirm(v => !v)}
            >
              {showConfirm ? "Hide" : "View"}
            </button>
          </div>
        )}

        {passwordError && (
          <div className="text-[var(--theme-error)] text-center font-semibold">
            {passwordError}
          </div>
        )}
        <button
          type="submit"
          className={`bg-[var(--theme-primary)] text-[var(--theme-light)] font-bold rounded-lg py-2 mt-3 transition-colors hover:bg-[var(--theme-success)] hover:text-[var(--theme-base)] ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {submitLabel}
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
          className="text-[var(--theme-light)] underline font-medium"
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
