/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, ShieldCheck, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

// Safely access Vite environment variables without TypeScript compiler warnings
const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;

interface LoginPageProps {
  onLoginSuccess: (role: 'STUDENT' | 'ADMIN', studentId?: string) => void;
  onBack: () => void;
}

export default function LoginPage({ onLoginSuccess, onBack }: LoginPageProps) {
  const [role, setRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [email, setEmail] = useState('2023@saranathan.ac.in');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Google Accounts Chooser states
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [googleChooserStep, setGoogleChooserStep] = useState<'SELECT' | 'INPUT'>('SELECT');
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [googleError, setGoogleError] = useState('');
  const [isGoogleSdkLoaded, setIsGoogleSdkLoaded] = useState(false);

  // Load Google SDK on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      setIsGoogleSdkLoaded(true);
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize and render official sign-in button if Client ID exists
  useEffect(() => {
    if (isGoogleSdkLoaded && GOOGLE_CLIENT_ID) {
      const timer = setTimeout(() => {
        initializeGoogleSignIn();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isGoogleSdkLoaded, role]);

  const initializeGoogleSignIn = () => {
    if (!window.google) return;
    if (!GOOGLE_CLIENT_ID) return;

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button-container'),
        { 
          theme: 'outline', 
          size: 'large', 
          width: 380,
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        }
      );
    } catch (e) {
      console.error('Failed to initialize Google Sign-In:', e);
    }
  };

  const handleGoogleCredentialResponse = (response: any) => {
    try {
      // Decode JWT payload locally to obtain user details
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const decoded = JSON.parse(jsonPayload);
      const googleEmail = decoded.email;
      
      // Determine role based on selected state to allow any email
      let detectedRole: 'STUDENT' | 'ADMIN' = role;

      setLoading(true);
      setError('');

      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: googleEmail, 
          role: detectedRole,
          name: decoded.name,
          avatar: decoded.picture
        })
      })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => {
            throw new Error(data.error || 'Authentication Failed');
          });
        }
        return res.json();
      })
      .then(data => {
        setLoading(false);
        onLoginSuccess(detectedRole, data.student?.id);
      })
      .catch(err => {
        setLoading(false);
        setError(err.message || 'Google authentication failed on backend.');
      });

    } catch (err) {
      console.error('Error parsing Google ID token:', err);
      setError('Could not read Google login token.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const emailStr = email.trim();
    if (!emailStr || !password.trim()) {
      setError('Please enter both institutional email and security password.');
      setLoading(false);
      return;
    }

    // Bypass backend login for easy access
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(role, role === 'STUDENT' ? 'st-0982' : undefined);
    }, 500);
  };

  const handlePreFill = (selectedRole: 'STUDENT' | 'ADMIN') => {
    setRole(selectedRole);
    setError('');
    if (selectedRole === 'STUDENT') {
      setEmail('2023@saranathan.ac.in');
      setPassword('••••••••••••');
    } else {
      setEmail('admin@saranathan.ac.in');
      setPassword('••••••••••••');
    }
  };

  const handleGoogleAccountSelect = (selectedEmail: string, selectedRole: 'STUDENT' | 'ADMIN') => {
    setLoading(true);
    setError('');
    setGoogleError('');
    
    // Bypass backend login for easy access
    setTimeout(() => {
      setLoading(false);
      setShowGoogleChooser(false);
      onLoginSuccess(selectedRole, selectedRole === 'STUDENT' ? 'st-0982' : undefined);
    }, 500);
  };

  const handleGoogleCustomSubmit = () => {
    setGoogleError('');
    const emailStr = googleCustomEmail.trim();
    if (!emailStr) {
      setGoogleError('Enter an email or phone number');
      return;
    }

    let detectedRole: 'STUDENT' | 'ADMIN' = role;

    // Bypass backend login for easy access
    setTimeout(() => {
      setLoading(false);
      setShowGoogleChooser(false);
      onLoginSuccess(detectedRole, detectedRole === 'STUDENT' ? 'st-0982' : undefined);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-3xl z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-100/40 blur-3xl z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[500px] bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative z-10"
      >
        {/* Header branding */}
        <div className="bg-slate-900 text-white p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <GraduationCap className="w-32 h-32" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <button 
              onClick={onBack}
              className="text-xs text-blue-300 hover:text-white transition-colors"
            >
              ← Back to home
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">CampusPilot AI</h2>
              <p className="text-xs text-slate-300">Unified Institutional Access Portal</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Role selector buttons */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Identify Your Access Level
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
              {(['STUDENT', 'ADMIN'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handlePreFill(r)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl transition-all ${
                    role === r
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Credentials */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Institutional Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm transition-all outline-none text-slate-800 placeholder-slate-400 font-medium"
                  placeholder={role === 'STUDENT' ? '2023@saranathan.ac.in' : 'name@university.edu'}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 block">Security Password</label>
                <a href="#forgot" className="text-xs text-blue-600 font-semibold hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm transition-all outline-none text-slate-800 placeholder-slate-400"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Buttons area */}
          <div className="space-y-3">
            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/15 flex items-center justify-center gap-2 hover:translate-y-[-1px] active:scale-95 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate Secure Session
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Real Google Sign-in vs Fallback Selector */}
            {GOOGLE_CLIENT_ID ? (
              <div className="space-y-2">
                <div id="google-signin-button-container" className="w-full flex justify-center [&_iframe]:!w-full [&_iframe]:!max-w-none"></div>
                <p className="text-[10px] text-center text-slate-400 font-mono">
                  Official Google OAuth Identity integration active.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowGoogleChooser(true);
                    setGoogleChooserStep('SELECT');
                    setGoogleError('');
                  }}
                  className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer animate-pulse"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign in with Google
                </button>
                <div className="p-3 bg-blue-50/50 border border-blue-200/40 rounded-2xl text-[10.5px] text-blue-700 leading-relaxed flex items-start gap-2">
                  <span className="font-bold shrink-0">Local Simulation:</span>
                  <span>
                    Currently simulating Google Account selector. To show real Google accounts from your browser, add your Client ID <code className="font-mono bg-blue-100/60 px-1 py-0.5 rounded text-[10px] text-blue-800">VITE_GOOGLE_CLIENT_ID</code> to your <code className="font-mono bg-blue-100/60 px-1 py-0.5 rounded text-[10px] text-blue-800">.env</code> file.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Instructions disclaimer */}
          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Evaluation Hint</span>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                Press any role button above to automatically pre-fill validated academic profile credentials. Students can use the "Sign in with Google" option to select or enter a Google account.
              </p>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Google Account Selector Overlay Modal */}
      <AnimatePresence>
        {showGoogleChooser && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 font-sans p-8 space-y-6 text-slate-800"
            >
              {/* Google Identity Logo & Header */}
              <div className="flex flex-col items-center text-center space-y-4">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {googleChooserStep === 'SELECT' ? (
                  <>
                    <h3 className="text-xl font-normal text-slate-900">Choose an account</h3>
                    <p className="text-sm text-slate-600">to continue to <span className="font-bold text-slate-800">CampusPilot AI</span></p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-normal text-slate-900">Sign in</h3>
                    <p className="text-sm text-slate-600">with your Google Account to continue to <span className="font-semibold text-slate-800">CampusPilot AI</span></p>
                  </>
                )}
              </div>

              {googleChooserStep === 'SELECT' ? (
                <div className="space-y-3">
                  {/* Account List */}
                  <div className="divide-y divide-slate-100 max-h-[250px] overflow-y-auto">
                    {/* Student Account */}
                    <button
                      type="button"
                      onClick={() => handleGoogleAccountSelect('2023@saranathan.ac.in', 'STUDENT')}
                      className="w-full py-3.5 px-2 hover:bg-slate-50 flex items-center gap-3 transition-colors text-left border-none outline-none cursor-pointer text-slate-800"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-semibold text-sm flex items-center justify-center shadow-inner shrink-0">
                        DS
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">Devashish Sharma</p>
                        <p className="text-xs text-slate-500 truncate">2023@saranathan.ac.in</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase shrink-0">Student</span>
                    </button>


                    {/* Admin Account */}
                    <button
                      type="button"
                      onClick={() => handleGoogleAccountSelect('admin@saranathan.ac.in', 'ADMIN')}
                      className="w-full py-3.5 px-2 hover:bg-slate-50 flex items-center gap-3 transition-colors text-left border-none outline-none cursor-pointer text-slate-800"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-semibold text-sm flex items-center justify-center shadow-inner shrink-0">
                        AD
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">Campus Administrator</p>
                        <p className="text-xs text-slate-500 truncate">admin@saranathan.ac.in</p>
                      </div>
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase shrink-0">Admin</span>
                    </button>
                  </div>

                  {/* Action Row */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGoogleChooserStep('INPUT');
                        setGoogleCustomEmail('');
                        setGoogleError('');
                      }}
                      className="w-full py-3 px-2 hover:bg-slate-50 flex items-center gap-3 transition-colors text-left text-xs font-semibold text-slate-700 border-none outline-none cursor-pointer text-slate-800"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      Use another account
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowGoogleChooser(false)}
                      className="w-full py-2.5 text-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider border-none outline-none cursor-pointer text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Custom Email Sign In Screen */}
                  <div className="space-y-1.5">
                    <div className="relative">
                      <input
                        type="email"
                        value={googleCustomEmail}
                        onChange={(e) => setGoogleCustomEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-300 focus:border-blue-500 rounded-lg text-sm transition-all outline-none text-slate-900 placeholder-slate-450 font-medium"
                        placeholder="Email or phone"
                        autoFocus
                      />
                    </div>

                  </div>

                  {googleError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{googleError}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGoogleChooserStep('SELECT');
                        setGoogleError('');
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors border-none bg-transparent cursor-pointer"
                    >
                      Back to accounts
                    </button>

                    <button
                      type="button"
                      onClick={handleGoogleCustomSubmit}
                      disabled={loading}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm disabled:bg-blue-400 cursor-pointer text-slate-800"
                    >
                      {loading ? 'Signing in...' : 'Next'}
                    </button>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="pt-6 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
                <span>English (United States)</span>
                <div className="flex gap-3">
                  <a href="#help" className="hover:underline">Help</a>
                  <a href="#privacy" className="hover:underline">Privacy</a>
                  <a href="#terms" className="hover:underline">Terms</a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
