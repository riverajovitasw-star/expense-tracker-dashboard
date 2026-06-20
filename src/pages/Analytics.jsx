import React, { useEffect, useState } from 'react';
import { dashboardAPI, expenseAPI, incomeAPI } from '../services/api';
import { PageHeader, Spinner } from '../components/ui/index.jsx';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, PieChart as PieIcon, BarChart3 } from 'lucide-react';

const PIE_COLORS = ['#7c3aed','#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#ec4899','#8b5cf6'];
const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-200 border border-gray-700/50 rounded-xl p-3 shadow-xl text-xs">
      <p className="text-gray-400 font-medium mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }} className="font-semibold">
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [expenseStats, setExpenseStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardAPI.getSummary(), expenseAPI.getStats()])
      .then(([s, e]) => {
        setSummary(s.data.data);
        setExpenseStats(e.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  const categoryData = summary?.categoryStats?.map(c => ({ name: c._id, value: c.total, count: c.count })) || [];
  const chartData = summary?.chartData || [];

  // Net savings trend
  const savingsTrend = chartData.map(d => ({ month: d.month, savings: d.income - d.expenses }));

  // Spending trend (cumulative average line)
  const avgExpense = chartData.length
    ? chartData.reduce((s, d) => s + d.expenses, 0) / chartData.length
    : 0;

  const totalExpense = categoryData.reduce((s, c) => s + c.value, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Analytics" subtitle="Deep dive into your financial patterns" />

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Monthly Spend', val: fmt(Math.round(avgExpense)), icon: BarChart3, color: 'text-accent-violet', bg: 'bg-accent-violet/10' },
          { label: 'Categories Used', val: categoryData.length, icon: PieIcon, color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
          { label: 'Top Category', val: categoryData[0]?.name || '—', icon: TrendingUp, color: 'text-accent-green', bg: 'bg-accent-green/10' },
          { label: 'Net (6 months)', val: fmt(savingsTrend.reduce((s,d) => s+d.savings, 0)), icon: TrendingDown, color: 'text-accent-yellow', bg: 'bg-accent-yellow/10' },
        ].map(({ label, val, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
            <p className={`font-display font-bold text-xl ${color}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Monthly Expense Chart */}
      <div className="glass-card p-5">
        <h3 className="font-display font-bold text-white text-base mb-1">Monthly Expense Trend</h3>
        <p className="text-gray-500 text-xs mb-4">Spending pattern over the last 6 months</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.05)' }} />
            <Bar dataKey="expenses" name="Expenses" fill="#7c3aed" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Pie */}
        <div className="glass-card p-5">
          <h3 className="font-display font-bold text-white text-base mb-1">Category-wise Expenses</h3>
          <p className="text-gray-500 text-xs mb-4">Distribution of spending by category</p>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    innerRadius={60} outerRadius={95} paddingAngle={2}
                    label={({ name, percent }) => `${(percent*100).toFixed(0)}%`}
                    labelLine={false}>
                    {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1a1d2e', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                </PieChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div className="flex items-center justify-center h-60 text-gray-600 text-sm">No expense data yet</div>
          )}
        </div>

        {/* Income vs Expense Comparison */}
        <div className="glass-card p-5">
          <h3 className="font-display font-bold text-white text-base mb-1">Income vs Expense</h3>
          <p className="text-gray-500 text-xs mb-4">Side-by-side monthly comparison</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.05)' }} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spending Trends Line Chart */}
      <div className="glass-card p-5">
        <h3 className="font-display font-bold text-white text-base mb-1">Net Savings Trend</h3>
        <p className="text-gray-500 text-xs mb-4">Income minus expenses over time</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={savingsTrend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="savings" name="Net Savings" stroke="#8b5cf6" strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 pb-0">
          <h3 className="font-display font-bold text-white text-base mb-1">Category Breakdown</h3>
          <p className="text-gray-500 text-xs mb-4">Detailed spending by category</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transactions</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">% of Total</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((cat, i) => (
                <tr key={cat.name} className="border-b border-gray-800/30 hover:bg-dark-400/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-gray-200 text-sm font-medium">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-sm">{cat.count}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-dark-400 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${totalExpense ? (cat.value/totalExpense*100) : 0}%`,
                          background: PIE_COLORS[i % PIE_COLORS.length]
                        }} />
                      </div>
                      <span className="text-gray-400 text-xs">{totalExpense ? ((cat.value/totalExpense)*100).toFixed(1) : 0}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right text-gray-200 font-semibold text-sm">{fmt(cat.value)}</td>
                </tr>
              ))}
              {categoryData.length === 0 && (
                <tr><td colSpan={4} className="text-center py-10 text-gray-600 text-sm">No data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
