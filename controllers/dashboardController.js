const Expense = require('../models/Expense');
const Income = require('../models/Income');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
exports.getSummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOf6Months = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const userId = req.user._id;

    // Totals
    const [totalExpAgg, totalIncAgg, monthExpAgg, monthIncAgg] = await Promise.all([
      Expense.aggregate([{ $match: { user: userId } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Income.aggregate([{ $match: { user: userId } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Expense.aggregate([{ $match: { user: userId, date: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Income.aggregate([{ $match: { user: userId, date: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$amount' } } }])
    ]);

    const totalExpenses = totalExpAgg[0]?.total || 0;
    const totalIncome = totalIncAgg[0]?.total || 0;
    const monthlyExpenses = monthExpAgg[0]?.total || 0;
    const monthlyIncome = monthIncAgg[0]?.total || 0;

    // Category breakdown
    const categoryStats = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    // Last 6 months expense + income
    const [expMonthly, incMonthly] = await Promise.all([
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOf6Months } } },
        { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' } }, total: { $sum: '$amount' } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      Income.aggregate([
        { $match: { user: userId, date: { $gte: startOf6Months } } },
        { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' } }, total: { $sum: '$amount' } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    // Build 6-month chart data
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yr = d.getFullYear();
      const mo = d.getMonth() + 1;
      const expEntry = expMonthly.find(e => e._id.year === yr && e._id.month === mo);
      const incEntry = incMonthly.find(e => e._id.year === yr && e._id.month === mo);
      chartData.push({
        month: monthNames[d.getMonth()],
        expenses: expEntry?.total || 0,
        income: incEntry?.total || 0
      });
    }

    // Recent transactions (last 5 expenses)
    const recentExpenses = await Expense.find({ user: userId }).sort({ date: -1 }).limit(5);
    const recentIncome = await Income.find({ user: userId }).sort({ date: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        monthlyIncome,
        monthlyExpenses,
        monthlyBalance: monthlyIncome - monthlyExpenses,
        categoryStats,
        chartData,
        recentExpenses,
        recentIncome
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
