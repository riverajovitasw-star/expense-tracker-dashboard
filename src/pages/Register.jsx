import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in all fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome aboard!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-500 flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 40% 30%, rgba(99,102,241,0.08) 0%, transparent 60%), #0a0d18' }}>

      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-accent-indigo/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-indigo to-accent-violet mb-4 shadow-xl shadow-accent-indigo/30">
            <Wallet size={26} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-white">Create account</h1>
          <p className="text-gray-400 text-sm mt-2">Start tracking your finances today</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <input
                name="name" type="text" value={form.name} onChange={handle}
                placeholder="John Doe" className="input-field" autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <input
                name="email" type="email" value={form.email} onChange={handle}
                placeholder="you@example.com" className="input-field" autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handle}
                  placeholder="Min. 6 characters" className="input-field pr-11"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Confirm Password</label>
              <input
                name="confirm" type="password" value={form.confirm} onChange={handle}
                placeholder="Repeat password" className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading
                ? <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                : <><UserPlus size={18} /> Create Account</>
              }
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-violet hover:text-accent-indigo font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
