import React, { useEffect, useState, useCallback } from 'react';
import { incomeAPI } from '../services/api';
import { Modal, CategoryBadge, EmptyState, ConfirmDialog, PageHeader, Spinner } from '../components/ui/index.jsx';
import { Plus, Search, Edit2, Trash2, TrendingUp, X } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Business', 'Bonus', 'Gift', 'Other'];
const emptyForm = { title: '', amount: '', category: 'Salary', date: format(new Date(), 'yyyy-MM-dd'), notes: '' };

function IncomeForm({ initial, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(initial || emptyForm);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Title *</label>
          <input name="title" value={form.title} onChange={handle} placeholder="e.g. Monthly Salary"
            className="input-field" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Amount (₹) *</label>
          <input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handle}
            placeholder="0.00" className="input-field" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category *</label>
          <select name="category" value={form.category} onChange={handle} className="input-field">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Date *</label>
          <input name="date" type="date" value={form.date} onChange={handle} className="input-field" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</label>
          <input name="notes" value={form.notes} onChange={handle} placeholder="Optional note" className="input-field" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary flex-1"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
          {loading
            ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Saving...</span>
            : (initial ? 'Update Income' : 'Add Income')}
        </button>
      </div>
    </form>
  );
}

export default function Income() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const { data } = await incomeAPI.getAll(params);
      setIncomes(data.data);
      setTotal(data.total);
    } catch (e) { toast.error('Failed to load income'); }
    finally { setLoading(false); }
  }, [search, category, startDate, endDate]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (form) => {
    setFormLoading(true);
    try {
      await incomeAPI.create(form);
      toast.success('Income added!');
      setShowModal(false);
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to add income'); }
    finally { setFormLoading(false); }
  };

  const handleEdit = async (form) => {
    setFormLoading(true);
    try {
      await incomeAPI.update(editItem._id, form);
      toast.success('Income updated!');
      setEditItem(null);
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to update income'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await incomeAPI.delete(deleteId);
      toast.success('Income deleted');
      setDeleteId(null);
      load();
    } catch (e) { toast.error('Failed to delete'); }
    finally { setDeleteLoading(false); }
  };

  const clearFilters = () => { setSearch(''); setCategory('All'); setStartDate(''); setEndDate(''); };
  const hasFilters = search || category !== 'All' || startDate || endDate;
  const totalAmount = incomes.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Income"
        subtitle={`${total} total records`}
        action={
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <Plus size={16} /> Add Income
          </button>
        }
      />

      {/* Summary */}
      <div className="glass-card p-4 border border-green-500/15">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Showing Total</p>
            <p className="font-display font-bold text-green-400 text-2xl mt-1">
              ₹{totalAmount.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
            <TrendingUp size={22} className="text-green-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[180px] relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search income..." className="input-field pl-9 py-2.5 text-sm" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="input-field w-auto text-sm py-2.5 min-w-[130px]">
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
            className="input-field w-auto text-sm py-2.5" />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
            className="input-field w-auto text-sm py-2.5" />
          {hasFilters && (
            <button onClick={clearFilters} className="btn-secondary flex items-center gap-1.5 text-sm py-2.5">
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner /></div>
        ) : incomes.length === 0 ? (
          <EmptyState icon={TrendingUp} title="No income found"
            description="Add your first income record or adjust your filters"
            action={<button onClick={() => setShowModal(true)} className="btn-primary text-sm flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}><Plus size={14} /> Add Income</button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((inc, i) => (
                  <tr key={inc._id}
                    className={`border-b border-gray-800/30 hover:bg-dark-400/30 transition-colors ${i % 2 === 0 ? '' : 'bg-dark-400/10'}`}>
                    <td className="px-5 py-3.5">
                      <p className="text-gray-200 text-sm font-medium">{inc.title}</p>
                      {inc.notes && <p className="text-gray-500 text-xs mt-0.5 truncate max-w-[200px]">{inc.notes}</p>}
                    </td>
                    <td className="px-5 py-3.5"><CategoryBadge category={inc.category} /></td>
                    <td className="px-5 py-3.5 text-gray-400 text-sm">{format(new Date(inc.date), 'MMM d, yyyy')}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-green-400 font-semibold text-sm">+₹{inc.amount.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditItem({ ...inc, date: format(new Date(inc.date), 'yyyy-MM-dd') })}
                          className="w-7 h-7 rounded-lg bg-accent-violet/10 hover:bg-accent-violet/20 flex items-center justify-center text-accent-violet transition-all duration-200">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => setDeleteId(inc._id)}
                          className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-all duration-200">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Income">
        <IncomeForm onSubmit={handleAdd} onClose={() => setShowModal(false)} loading={formLoading} />
      </Modal>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Income">
        <IncomeForm initial={editItem} onSubmit={handleEdit} onClose={() => setEditItem(null)} loading={formLoading} />
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        loading={deleteLoading} title="Delete Income"
        message="Are you sure you want to delete this income record? This action cannot be undone." />
    </div>
  );
}
