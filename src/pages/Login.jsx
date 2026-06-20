import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useThemeColor } from '../context/ThemeColorContext';
import { HeroGeometric } from '../components/ui/shape-landing-hero';
import RoleToggle from '../components/ui/RoleToggle';
import ThemeSelector from '../components/ui/ThemeSelector';
import { Wallet, Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const { theme } = useThemeColor();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [role, setRole] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setRole(null); // manual edit clears the highlighted toggle state
  };

  const handleRoleChange = (key, acc) => {
    setRole(key);
    setForm({ email: acc.email, password: acc.password });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const accent500 = theme['500'];
  const accent600 = theme['600'];
  const ring = theme.ring;

  return (
    <div className="min-h-screen w-full flex bg-[#030303] overflow-hidden">
      {/* LEFT: HeroGeometric animated background */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <HeroGeometric
          badge="Expense Tracker Dashboard"
          title1="Manage Your"
          title2="Financial Future"
        />
      </div>

      {/* RIGHT: Login card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 relative bg-[#030303]">
        {/* subtle ambient glow matching theme color, behind the card */}
        <div
          className="absolute w-[480px] h-[480px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: accent500 }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile-only badge (since HeroGeometric is hidden on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-xl"
              style={{ background: `linear-gradient(135deg, ${accent500}, ${accent600})`, boxShadow: `0 10px 40px -10px ${ring}` }}
            >
              <Wallet size={26} className="text-white" />
            </motion.div>
            <h1 className="font-display font-bold text-2xl text-white">Manage Your Financial Future</h1>
          </div>

          {/* Glassmorphism card */}
          <div
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl p-8 shadow-2xl"
            style={{ boxShadow: '0 25px 60px -15px rgba(0,0,0,0.6)' }}
          >
            <div className="text-center mb-7 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
                style={{ background: `linear-gradient(135deg, ${accent500}, ${accent600})`, boxShadow: `0 10px 30px -8px ${ring}` }}
              >
                <Wallet size={22} className="text-white" />
              </motion.div>
              <h1 className="font-display font-bold text-2xl text-white">Welcome back</h1>
              <p className="text-white/40 text-sm mt-1.5">Sign in to your expense tracker</p>
            </div>

            {/* Theme Color Selector */}
            <ThemeSelector />

            {/* Role Toggle (demo accounts) */}
            <RoleToggle role={role} onChange={handleRoleChange} />

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Email</label>
                <input
                  name="email" type="email" value={form.email} onChange={handle}
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white
                             placeholder-white/30 focus:outline-none transition-all duration-200 text-sm"
                  onFocus={(e) => { e.target.style.borderColor = accent500; e.target.style.boxShadow = `0 0 0 3px ${ring}`; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <input
                    name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handle}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 pr-11 text-white
                               placeholder-white/30 focus:outline-none transition-all duration-200 text-sm"
                    onFocus={(e) => { e.target.style.borderColor = accent500; e.target.style.boxShadow = `0 0 0 3px ${ring}`; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <RippleButton
                type="submit"
                disabled={loading}
                gradient={`linear-gradient(135deg, ${accent500}, ${accent600})`}
                glow={ring}
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <><LogIn size={18} /> Sign In</>
                )}
              </RippleButton>
            </form>

            <p className="text-center text-white/40 text-sm mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold transition-colors" style={{ color: accent500 }}>
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Button with ripple effect + hover/scale animation, themed via inline gradient
function RippleButton({ children, gradient, glow, ...props }) {
  const [ripples, setRipples] = useState([]);

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y, size }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 650);
  };

  return (
    <motion.button
      {...props}
      onClick={(e) => { addRipple(e); props.onClick?.(e); }}
      whileHover={{ scale: props.disabled ? 1 : 1.015 }}
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      className="relative w-full overflow-hidden flex items-center justify-center gap-2 text-white font-semibold
                 px-6 py-3 rounded-xl mt-2 transition-shadow duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ background: gradient, boxShadow: `0 8px 30px -8px ${glow}` }}
    >
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ opacity: 0.35, scale: 0 }}
            animate={{ opacity: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          />
        ))}
      </AnimatePresence>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
