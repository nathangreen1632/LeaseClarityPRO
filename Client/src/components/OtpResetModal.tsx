import React, { useEffect, useState } from 'react';
import { useOtpStore } from '../store/useOtpStore';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const OtpResetModal: React.FC = () => {
  const { isOpen, closeModal, step, email, setEmail, setStep } = useOtpStore();

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && step === 'enterEmail') {
      setOtp('');
      setNewPassword('');
      setConfirm('');
      setError('');
    }
  }, [isOpen, step]);

  if (!isOpen) return null;

  const handleEmailSubmit = async () => {
    setLoading(true);
    setError('');

    const trimmedEmail = email.trim().toLowerCase(); // ✅ Normalize input

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ✅ Format check
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      if (!window.grecaptcha || typeof window.grecaptcha.execute !== 'function') {
        setError('reCAPTCHA not loaded. Please try again shortly.');
        return;
      }

      const captchaToken = await window.grecaptcha.execute('6LclLo8rAAAAAG20j6CWhgkxLfB80NkzwzBVBCUN', {
        action: 'send_otp',
      });

      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, captchaToken }), // ✅ Use normalized email
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? 'Failed to send OTP. Please try again.');
      } else {
        setStep('verifyOtp');
      }

    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('An unexpected error occurred while sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setError('');

    if (!otp || !newPassword || !confirm) {
      setError('Please complete all fields.');
      return;
    }

    if (newPassword !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/otp/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp, newPassword }), // ✅ Normalize before sending
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? 'OTP verification failed.');
        return;
      }

      alert('✅ Password reset successfully.');
      closeModal();
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('An unexpected error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--theme-dark)] border border-[var(--theme-outline)] rounded-xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-[var(--theme-light)] text-center">Reset Password</h2>

        {/* Step 1: Email input */}
        {step === 'enterEmail' && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())} // ✅ Normalize on input
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-lg bg-[var(--theme-light)] focus:outline-[var(--theme-primary)]"
              required
            />
            <button
              onClick={handleEmailSubmit}
              className="w-full bg-[var(--theme-primary)] text-white font-bold py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
          </>
        )}

        {/* Step 2: OTP + Password fields */}
        {step === 'verifyOtp' && (
          <>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the 6-digit OTP"
              className="w-full px-3 py-2 rounded-lg bg-[var(--theme-light)] focus:outline-[var(--theme-primary)]"
              required
            />

            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full px-3 py-2 rounded-lg bg-[var(--theme-light)] focus:outline-[var(--theme-primary)] pr-16"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs underline font-semibold text-[var(--theme-primary)]"
                onClick={() => setShowPass((v) => !v)}
              >
                {showPass ? 'Hide' : 'View'}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-3 py-2 rounded-lg bg-[var(--theme-light)] focus:outline-[var(--theme-primary)] pr-16"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs underline font-semibold text-[var(--theme-primary)]"
                onClick={() => setShowConfirm((v) => !v)}
              >
                {showConfirm ? 'Hide' : 'View'}
              </button>
            </div>

            <button
              onClick={handleOtpSubmit}
              className="w-full bg-[var(--theme-primary)] text-white font-bold py-2 rounded-lg mt-2"
              disabled={loading}
            >
              {loading ? 'Verifying…' : 'Reset Password'}
            </button>
          </>
        )}

        {error && <div className="text-[var(--theme-error)] text-sm text-center">{error}</div>}

        <button
          className="text-xs text-center underline text-[var(--theme-light)] w-full"
          onClick={closeModal}
        >
          Cancel
        </button>

        {/*
        === 📱 TWILIO FALLBACK (future) ===

        const handlePhoneSubmit = async () => {
          const captchaToken = await window.grecaptcha.execute(...);
          await fetch('/api/otp/send', {
            method: 'POST',
            body: JSON.stringify({ phone, captchaToken }),
          });
        };

        const handleOtpSubmit = async () => {
          await fetch('/api/otp/verify', {
            method: 'POST',
            body: JSON.stringify({ phone, otp, newPassword }),
          });
        };
        */}
      </div>
    </div>
  );
};

export default OtpResetModal;
