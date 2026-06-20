const Income = require('../models/Income');

// @desc    Get all income
// @route   GET /api/income
exports.getIncomes = async (req, res) => {
  try {
    const { category, startDate, endDate, search, page = 1, limit = 50 } = req.query;
    const query = { user: req.user._id };

    if (category && category !== 'All') query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate + 'T23:59:59');
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Income.countDocuments(query);
    const incomes = await Income.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, data: incomes, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single income
// @route   GET /api/income/:id
exports.getIncome = async (req, res) => {
  try {
    const income = await Income.findOne({ _id: req.params.id, user: req.user._id });
    if (!income) return res.status(404).json({ success: false, message: 'Income not found' });
    res.json({ success: true, data: income });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create income
// @route   POST /api/income
exports.createIncome = async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;
    const income = await Income.create({
      user: req.user._id,
      title,
      amount,
      category: category || 'Salary',
      date: date || new Date(),
      notes
    });
    res.status(201).json({ success: true, data: income });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update income
// @route   PUT /api/income/:id
exports.updateIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!income) return res.status(404).json({ success: false, message: 'Income not found' });
    res.json({ success: true, data: income });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete income
// @route   DELETE /api/income/:id
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!income) return res.status(404).json({ success: false, message: 'Income not found' });
    res.json({ success: true, message: 'Income deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get income stats
// @route   GET /api/income/stats
exports.getIncomeStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalIncome = await Income.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyIncome = await Income.aggregate([
      { $match: { user: req.user._id, date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const last6Months = await Income.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) }
        }
      },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalIncome[0]?.total || 0,
        monthly: monthlyIncome[0]?.total || 0,
        last6Months
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
