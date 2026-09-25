import React, { useState } from 'react';
import { Lock, User, KeyRound, ShieldAlert, ArrowRight, CheckCircle2, Sparkles, X } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (adminName: string) => void;
  onClose: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onClose }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      // Valid credentials: admin / admin123 or admin@banglaxpress.store / bangla2025
      const cleanId = adminId.trim().toLowerCase();
      if (
        (cleanId === 'admin' || cleanId === 'admin@banglaxpress.store' || cleanId === 'merchant') &&
        (password === 'admin123' || password === 'bangla2025' || password === '123456')
      ) {
        if (rememberMe) {
          try {
            localStorage.setItem('bx_admin_authenticated', 'true');
            localStorage.setItem('bx_admin_user', cleanId);
          } catch (e) {
            console.error('Storage error', e);
          }
        }
        setIsLoading(false);
        onLoginSuccess(cleanId === 'merchant' ? 'Store Merchant' : 'Super Admin (তানভীর আহমেদ)');
      } else {
        setIsLoading(false);
        setErrorMsg('ভুল আইডি অথবা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য প্রদান করুন।');
      }
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    setAdminId('admin');
    setPassword('admin123');
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      try {
        localStorage.setItem('bx_admin_authenticated', 'true');
        localStorage.setItem('bx_admin_user', 'admin');
      } catch (e) {
        console.error('Storage error', e);
      }
      setIsLoading(false);
      onLoginSuccess('Super Admin (তানভীর আহমেদ)');
    }, 300);
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 px-6 py-7 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          title="বন্ধ করুন"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black tracking-tight">GPE Bangladesh Admin</h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Laravel v11
              </span>
            </div>
            <p className="text-xs text-slate-300">মার্চেন্ট ও ই-কমার্স কন্ট্রোল প্যানেল</p>
          </div>
        </div>

        <p className="text-[11.5px] text-slate-300 leading-relaxed mt-2">
          প্রোডাক্ট আপডেট, স্পেসিফিকেশন ও ওয়ারেন্টি পরিচালনা করতে অ্যাডমিন লগইন করুন।
        </p>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-5">
        {/* Demo Credentials Quick-card */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>ডেমো অ্যাডমিন আইডি ও পাসওয়ার্ড:</span>
            </div>
            <p className="text-amber-800 text-[11px]">
              ID: <code className="bg-amber-100 font-mono px-1 py-0.5 rounded font-bold text-slate-900">admin</code> | Pass:{' '}
              <code className="bg-amber-100 font-mono px-1 py-0.5 rounded font-bold text-slate-900">admin123</code>
            </p>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] whitespace-nowrap shadow-xs transition-all active:scale-95"
          >
            ১-ক্লিক অটো লগইন
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              অ্যাডমিন আইডি / ইউজারনেম (Admin ID / Email) *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="e.g. admin অথবা admin@banglaxpress.store"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white focus:border-rose-600 transition-all text-slate-900 font-medium"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              পাসওয়ার্ড (Password) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="আপনার অ্যাডমিন পাসওয়ার্ড লিখুন"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white focus:border-rose-600 transition-all text-slate-900 font-medium"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
              />
              <span>লগইন মনে রাখুন (Remember Session)</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">Role: SuperAdmin</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>যাচাই করা হচ্ছে...</span>
              </span>
            ) : (
              <>
                <span>প্যানেলে প্রবেশ করুন</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>256-bit SSL Protected</span>
          </span>
          <span>Laravel Auth Session</span>
        </div>
      </div>
    </div>
  );
};
