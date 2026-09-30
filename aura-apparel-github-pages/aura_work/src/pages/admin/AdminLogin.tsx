import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateToStore }) => {
  const { login } = useAdmin();
  const [email, setEmail] = useState('admin@auraapparel.pk');
  const [password, setPassword] = useState('auraadmin2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@auraapparel.pk');
    setPassword('auraadmin2026');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#FAF9F5]">
      <div className="w-full max-w-md bg-white p-8 rounded border border-neutral-200 shadow-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900 uppercase">
            Aura Admin Portal
          </h1>
          <p className="text-xs text-neutral-500">
            Store Owner & Retail Management Dashboard (I-8 Markaz)
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Admin Email
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@auraapparel.pk"
                className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Master Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {loading ? <span>Verifying...</span> : <span>Sign In to Dashboard</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Quick-Fill helper */}
        <div className="pt-4 border-t border-neutral-100 bg-neutral-50 p-4 rounded text-xs text-neutral-600 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-900">Demo Store Owner Access:</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-bold text-neutral-900 underline hover:text-black cursor-pointer"
            >
              Fill Credentials
            </button>
          </div>
          <p className="font-mono text-[11px]">Email: admin@auraapparel.pk</p>
          <p className="font-mono text-[11px]">Password: auraadmin2026</p>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onNavigateToStore}
            className="text-xs text-neutral-500 hover:text-black underline font-medium"
          >
            ← Return to Public Storefront
          </button>
        </div>

      </div>
    </div>
  );
};
