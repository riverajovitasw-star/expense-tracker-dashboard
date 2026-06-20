import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatCard, CategoryBadge, Spinner } from '../components/ui/index.jsx';
import {
  TrendingUp, TrendingDown, Wallet, ArrowUpRight,
  DollarSign, ShoppingCart, PiggyBank
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

const PIE_COLORS = ['#7c3aed','#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#ec4899','#8b5cf6'];

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-200 border border-gray-700/50 rounded-xl p-3 shadow-xl text-xs">
      <p className="text-gray-400 font-medium mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getSummary()
      .then(({ data: res }) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );

  const savingsRate = data?.monthlyIncome
    ? Math.round(((data.monthlyIncome - data.monthlyExpenses) / data.monthlyIncome) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-white text-2xl">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span className="text-accent-violet">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">Here's your financial overview for today</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs">{format(new Date(), 'EEEE, MMMM d yyyy')}</p>
          <span className="badge bg-accent-violet/10 text-accent-violet border border-accent-violet/20 mt-1">
            {user?.role === 'admin' ? '⭐ Admin' : '👤 User'}
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Balance" value={fmt(data?.balance)} subtitle="All time net"
          icon={Wallet} color="violet" />
        <StatCard title="Total Income" value={fmt(data?.totalIncome)} subtitle="All time earnings"
          icon={TrendingUp} color="green" />
        <StatCard title="Total Expenses" value={fmt(data?.totalExpenses)} subtitle="All time spending"
          icon={TrendingDown} color="red" />
        <StatCard title="Savings Rate" value={`${savingsRate}%`} subtitle="This month"
          icon={PiggyBank} color={savingsRate >= 0 ? 'green' : 'red'} />
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Monthly Income', val: data?.monthlyIncome, color: 'from-green-500/20 to-emerald-600/5', border: 'border-green-500/20', text: 'text-green-400', icon: TrendingUp },
          { label: 'Monthly Expenses', val: data?.monthlyExpenses, color: 'from-red-500/20 to-rose-600/5', border: 'border-red-500/20', text: 'text-red-400', icon: TrendingDown },
          { label: 'Monthly Balance', val: data?.monthlyBalance, color: 'from-violet-500/20 to-purple-600/5', border: 'border-violet-500/20', text: 'text-accent-violet', icon: DollarSign },
        ].map(({ label, val, color, border, text, icon: Icon }) => (
          <div key={label} className={`glass-card p-5 bg-gradient-to-br ${color} border ${border}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{label}</p>
              <Icon size={16} className={text} />
            </div>
            <p className={`font-display font-bold text-2xl ${text}`}>{fmt(val)}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Income vs Expense Area Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-white text-base">Income vs Expenses</h3>
              <p className="text-gray-500 text-xs mt-0.5">Last 6 months overview</p>
            </div>
            <Link to="/analytics" className="text-xs text-accent-violet hover:text-accent-indigo flex items-center gap-1 transition-colors">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data?.chartData || []} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} fill="url(#incGrad)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#7c3aed" strokeWidth={2} fill="url(#expGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-5">
          <h3 className="font-display font-bold text-white text-base mb-1">By Category</h3>
          <p className="text-gray-500 text-xs mb-4">Expense breakdown</p>
          {data?.categoryStats?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={data.categoryStats} dataKey="total" nameKey="_id"
                    cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2}>
                    {data.categoryStats.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1a1d2e', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {data.categoryStats.slice(0, 4).map((cat, i) => (
                  <div key={cat._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-gray-400 text-xs">{cat._id}</span>
                    </div>
                    <span className="text-gray-300 text-xs font-semibold">{fmt(cat.total)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-600 text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Expenses */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-white text-base">Recent Expenses</h3>
            <Link to="/expenses" className="text-xs text-accent-violet hover:text-accent-indigo flex items-center gap-1 transition-colors">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          {data?.recentExpenses?.length > 0 ? (
            <div className="space-y-3">
              {data.recentExpenses.map((exp) => (
                <div key={exp._id} className="flex items-center justify-between p-3 rounded-xl bg-dark-400/40 hover:bg-dark-400/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <ShoppingCart size={14} className="text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200 truncate max-w-[140px]">{exp.title}</p>
                      <CategoryBadge category={exp.category} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 font-semibold text-sm">-{fmt(exp.amount)}</p>
                    <p className="text-gray-500 text-xs">{format(new Date(exp.date), 'MMM d')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm text-center py-8">No expenses yet</p>
          )}
        </div>

        {/* Recent Income */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-white text-base">Recent Income</h3>
            <Link to="/income" className="text-xs text-accent-violet hover:text-accent-indigo flex items-center gap-1 transition-colors">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          {data?.recentIncome?.length > 0 ? (
            <div className="space-y-3">
              {data.recentIncome.map((inc) => (
                <div key={inc._id} className="flex items-center justify-between p-3 rounded-xl bg-dark-400/40 hover:bg-dark-400/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp size={14} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200 truncate max-w-[140px]">{inc.title}</p>
                      <CategoryBadge category={inc.category} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold text-sm">+{fmt(inc.amount)}</p>
                    <p className="text-gray-500 text-xs">{format(new Date(inc.date), 'MMM d')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm text-center py-8">No income yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
