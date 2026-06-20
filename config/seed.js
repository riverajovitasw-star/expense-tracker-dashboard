const User = require('../models/User');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

const seedDemoAccounts = async () => {
  try {
    const demoAccounts = [
      { name: 'Admin User', email: 'admin@expense.com', password: 'admin123', role: 'admin' },
      { name: 'Demo User', email: 'user@expense.com', password: 'user123', role: 'user' }
    ];

    for (const acc of demoAccounts) {
      // select('+password') because password field has `select: false` in the schema
      let user = await User.findOne({ email: acc.email }).select('+password');

      if (!user) {
        // Create new account. Plain text password is hashed ONCE by the
        // pre('save') hook in User.js.
        user = await User.create({
          name: acc.name,
          email: acc.email,
          password: acc.password,
          role: acc.role
        });
        await seedSampleData(user._id);
        console.log(`Demo account created: ${acc.email} / ${acc.password}`);
      } else {
        // Account already exists (possibly from a previous broken seed that
        // double-hashed the password). Verify the known demo password
        // actually works, and reset it if it doesn't, so login always works.
        const isValid = await user.comparePassword(acc.password);
        if (!isValid) {
          user.password = acc.password; // triggers pre('save') hook -> single hash
          await user.save();
          console.log(`Demo account password reset: ${acc.email} / ${acc.password}`);
        }
      }
    }
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};


const seedSampleData = async (userId) => {
  const now = new Date();
  const months = [-5, -4, -3, -2, -1, 0];

  const expensesByMonth = [
    [
      { title: 'Grocery Shopping', amount: 4200, category: 'Food', date: new Date(now.getFullYear(), now.getMonth() - 5, 5) },
      { title: 'Netflix Subscription', amount: 649, category: 'Entertainment', date: new Date(now.getFullYear(), now.getMonth() - 5, 10) },
      { title: 'Bus Pass', amount: 1200, category: 'Transportation', date: new Date(now.getFullYear(), now.getMonth() - 5, 15) },
      { title: 'Electricity Bill', amount: 2800, category: 'Bills', date: new Date(now.getFullYear(), now.getMonth() - 5, 20) },
    ],
    [
      { title: 'Restaurant Dinner', amount: 1800, category: 'Food', date: new Date(now.getFullYear(), now.getMonth() - 4, 3) },
      { title: 'Online Course', amount: 2999, category: 'Education', date: new Date(now.getFullYear(), now.getMonth() - 4, 8) },
      { title: 'Uber Rides', amount: 1500, category: 'Transportation', date: new Date(now.getFullYear(), now.getMonth() - 4, 12) },
      { title: 'New Shoes', amount: 3500, category: 'Shopping', date: new Date(now.getFullYear(), now.getMonth() - 4, 18) },
      { title: 'Doctor Visit', amount: 800, category: 'Health', date: new Date(now.getFullYear(), now.getMonth() - 4, 25) },
    ],
    [
      { title: 'Groceries', amount: 3800, category: 'Food', date: new Date(now.getFullYear(), now.getMonth() - 3, 2) },
      { title: 'Amazon Shopping', amount: 4200, category: 'Shopping', date: new Date(now.getFullYear(), now.getMonth() - 3, 9) },
      { title: 'Internet Bill', amount: 999, category: 'Bills', date: new Date(now.getFullYear(), now.getMonth() - 3, 14) },
      { title: 'Movie Tickets', amount: 600, category: 'Entertainment', date: new Date(now.getFullYear(), now.getMonth() - 3, 20) },
    ],
    [
      { title: 'Weekly Groceries', amount: 5000, category: 'Food', date: new Date(now.getFullYear(), now.getMonth() - 2, 4) },
      { title: 'Gym Membership', amount: 1500, category: 'Health', date: new Date(now.getFullYear(), now.getMonth() - 2, 10) },
      { title: 'Phone Bill', amount: 799, category: 'Bills', date: new Date(now.getFullYear(), now.getMonth() - 2, 15) },
      { title: 'Petrol', amount: 2200, category: 'Transportation', date: new Date(now.getFullYear(), now.getMonth() - 2, 22) },
      { title: 'Books', amount: 1200, category: 'Education', date: new Date(now.getFullYear(), now.getMonth() - 2, 28) },
    ],
    [
      { title: 'Swiggy Orders', amount: 2400, category: 'Food', date: new Date(now.getFullYear(), now.getMonth() - 1, 5) },
      { title: 'Clothes Shopping', amount: 6000, category: 'Shopping', date: new Date(now.getFullYear(), now.getMonth() - 1, 11) },
      { title: 'Water Bill', amount: 450, category: 'Bills', date: new Date(now.getFullYear(), now.getMonth() - 1, 16) },
      { title: 'Spotify Premium', amount: 119, category: 'Entertainment', date: new Date(now.getFullYear(), now.getMonth() - 1, 20) },
    ],
    [
      { title: 'Grocery Store', amount: 4500, category: 'Food', date: new Date(now.getFullYear(), now.getMonth(), 3) },
      { title: 'Cab to Airport', amount: 1800, category: 'Transportation', date: new Date(now.getFullYear(), now.getMonth(), 8) },
      { title: 'Electricity Bill', amount: 3200, category: 'Bills', date: new Date(now.getFullYear(), now.getMonth(), 12) },
      { title: 'Gaming Purchase', amount: 1999, category: 'Entertainment', date: new Date(now.getFullYear(), now.getMonth(), 16) },
    ],
  ];

  const incomeByMonth = [
    [
      { title: 'Monthly Salary', amount: 55000, category: 'Salary', date: new Date(now.getFullYear(), now.getMonth() - 5, 1) },
      { title: 'Freelance Project', amount: 12000, category: 'Freelance', date: new Date(now.getFullYear(), now.getMonth() - 5, 20) },
    ],
    [
      { title: 'Monthly Salary', amount: 55000, category: 'Salary', date: new Date(now.getFullYear(), now.getMonth() - 4, 1) },
    ],
    [
      { title: 'Monthly Salary', amount: 55000, category: 'Salary', date: new Date(now.getFullYear(), now.getMonth() - 3, 1) },
      { title: 'Bonus', amount: 10000, category: 'Bonus', date: new Date(now.getFullYear(), now.getMonth() - 3, 15) },
    ],
    [
      { title: 'Monthly Salary', amount: 55000, category: 'Salary', date: new Date(now.getFullYear(), now.getMonth() - 2, 1) },
      { title: 'Freelance Work', amount: 8000, category: 'Freelance', date: new Date(now.getFullYear(), now.getMonth() - 2, 22) },
    ],
    [
      { title: 'Monthly Salary', amount: 55000, category: 'Salary', date: new Date(now.getFullYear(), now.getMonth() - 1, 1) },
    ],
    [
      { title: 'Monthly Salary', amount: 60000, category: 'Salary', date: new Date(now.getFullYear(), now.getMonth(), 1) },
      { title: 'Investment Returns', amount: 5000, category: 'Investment', date: new Date(now.getFullYear(), now.getMonth(), 10) },
    ],
  ];

  for (let i = 0; i < months.length; i++) {
    for (const expense of expensesByMonth[i]) {
      await Expense.create({ ...expense, user: userId, notes: '' });
    }
    for (const income of incomeByMonth[i]) {
      await Income.create({ ...income, user: userId, notes: '' });
    }
  }
};

module.exports = { seedDemoAccounts };
