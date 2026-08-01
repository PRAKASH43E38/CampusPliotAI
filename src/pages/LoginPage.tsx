import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, User, ShieldCheck, ArrowRight, Lock, Mail, GraduationCap, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window {
    google?: any;
  }
}

export const LoginPage: React.FC = () => {
  const { user, loginWithGoogle, loginAsStudent, loginAsFaculty, loginAsAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const portalParam = searchParams.get('portal');

  const [activeTab, setActiveTab] = useState<'student' | 'faculty' | 'admin'>(
    portalParam === 'admin' ? 'admin' : portalParam === 'faculty' ? 'faculty' : 'student'
  );
  const [email, setEmail] = useState('astrabyte@gmail.com');
  const [password, setPassword] = useState('••••••••••••');

  useEffect(() => {
    if (portalParam === 'admin' || portalParam === 'faculty' || portalParam === 'student') {
      setActiveTab(portalParam);
    }
  }, [portalParam]);

  // Redirect authenticated users directly to their designated dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'faculty') {
        navigate('/faculty-dashboard', { replace: true });
      } else {
        navigate('/student', { replace: true });
      }
    }
  }, [user, navigate]);

  // Real Google Identity Services (GIS) Callback Handler
  const handleCredentialResponse = async (response: any) => {
    if (response && response.credential) {
      await loginWithGoogle({
        credential: response.credential,
        role: activeTab
      });
      const target = activeTab === 'admin' ? '/admin' : activeTab === 'faculty' ? '/faculty-dashboard' : '/student';
      navigate(target);
    }
  };

  // Dynamically load & initialize Google Identity Services SDK per portal
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';

    const initGIS = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        const btnDiv = document.getElementById('googleSignInBtn');
        if (btnDiv) {
          btnDiv.innerHTML = '';
          window.google.accounts.id.renderButton(btnDiv, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left'
          });
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGIS();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGIS;
      document.body.appendChild(script);
    }
  }, [activeTab]);

  const handleManualGoogleAuth = () => {
    const target = activeTab === 'admin' ? '/admin' : activeTab === 'faculty' ? '/faculty-dashboard' : '/student';
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      loginWithGoogle({
        email: email,
        role: activeTab
      });
      navigate(target);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'student') {
      await loginAsStudent(email);
      navigate('/student');
    } else if (activeTab === 'faculty') {
      await loginAsFaculty(email);
      navigate('/faculty-dashboard');
    } else {
      await loginAsAdmin();
      navigate('/admin');
    }
  };

  const portalTitles = {
    student: 'Student Authentication Portal',
    faculty: 'Faculty Teaching Portal',
    admin: 'Central Administrator Portal'
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0F172A] text-[#1F2937] dark:text-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] p-8 shadow-sm space-y-6 relative">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#2E7D32] dark:bg-[#4CAF50] flex items-center justify-center text-white mx-auto shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1F2937] dark:text-[#F8FAFC] tracking-tight">
            {portalTitles[activeTab]}
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1]">
            Independent OAuth 2.0 Access Control • Select Intended Portal
          </p>
        </div>

        {/* Portal Selection Selector */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#F4F8F4] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setEmail('astrabyte@gmail.com');
            }}
            className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer border-none ${
              activeTab === 'student' ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold' : 'text-[#6B7280] dark:text-[#CBD5E1]'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Student
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('faculty');
              setEmail('dr.sharma@campuspilot.edu');
            }}
            className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer border-none ${
              activeTab === 'faculty' ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold' : 'text-[#6B7280] dark:text-[#CBD5E1]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Faculty
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setEmail('dean.academic@campuspilot.edu');
            }}
            className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer border-none ${
              activeTab === 'admin' ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold' : 'text-[#6B7280] dark:text-[#CBD5E1]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Admin
          </button>
        </div>

        {/* Dedicated Sign in with Google Button Container for Portal */}
        <div className="space-y-2.5">
          <div id="googleSignInBtn" className="w-full flex justify-center min-h-[44px]"></div>
          
          <button
            type="button"
            onClick={handleManualGoogleAuth}
            className="w-full py-2.5 rounded-xl bg-[#F4F8F4] dark:bg-[#273449] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] font-semibold text-xs flex items-center justify-center gap-2 transition-all hover:border-[#2E7D32] dark:hover:border-[#4CAF50] cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Sign in with Google ({activeTab.toUpperCase()} Portal)
          </button>
        </div>

        <div className="flex items-center gap-3 text-[#6B7280] dark:text-[#CBD5E1] text-xs my-4">
          <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-[#475569]" />
          <span>Or sign in with {activeTab.toUpperCase()} Credentials</span>
          <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-[#475569]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] dark:text-[#F8FAFC] mb-1.5">{activeTab.toUpperCase()} Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#CBD5E1]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F4F8F4] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-xs text-[#1F2937] dark:text-[#F8FAFC] focus:border-[#2E7D32] dark:focus:border-[#4CAF50] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] dark:text-[#F8FAFC] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#CBD5E1]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F4F8F4] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-xs text-[#1F2937] dark:text-[#F8FAFC] focus:border-[#2E7D32] dark:focus:border-[#4CAF50] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors border-none cursor-pointer"
          >
            Sign In to {activeTab === 'student' ? 'Student Portal' : activeTab === 'faculty' ? 'Faculty Portal' : 'Admin Portal'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
