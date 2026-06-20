# Expense Tracker Dashboard

**Intern ID:** CITS3291
**Developer Name:** Rivera Jovita SW

A complete, fully functional full-stack **Expense Tracker Dashboard** built with the **MERN stack** (MongoDB, Express, React, Node.js). It includes JWT authentication, expense & income management, an analytics dashboard with charts, category filtering, search, date-range filters, and a modern dark-themed responsive UI.

---

##  Project Overview

Expense Tracker Dashboard is a personal finance management web application that allows users to:

- Register and log in securely using JWT authentication
- Track income and expenses across multiple categories
- View a real-time dashboard with totals, balances, and monthly summaries
- Analyze spending patterns through interactive charts (pie, bar, line, area)
- Search, filter (by category and date range), edit, and delete transactions
- Manage their profile and change passwords

The app ships with two pre-seeded **demo accounts** (with sample data) so it can be explored immediately after setup.

---

##  Features

###  User Authentication
- User registration with validation
- User login with JWT token issuance
- Protected routes (frontend & backend)
- Persistent sessions via localStorage
- Logout functionality
- Profile update & password change

###  Dashboard
- Total Income, Total Expenses, Current Balance cards
- Monthly Income / Expenses / Balance summary cards
- Savings rate indicator
- Recent expenses & income transaction lists
- Income vs Expense area chart (last 6 months)
- Category-wise pie chart

###  Expense Management
- Add / Edit / Delete expenses
- View full expense history (paginated)
- Search expenses by title/notes
- Filter by category
- Filter by date range (start/end date)
- Running total of filtered results

###  Income Management
- Add / Edit / Delete income entries
- View full income history (paginated)
- Search, filter by category and date range
- Running total of filtered results

###  Categories
**Expense categories:** Food, Transportation, Shopping, Bills, Entertainment, Education, Health, Other
**Income categories:** Salary, Freelance, Investment, Business, Bonus, Gift, Other

###  Charts & Analytics
- Monthly Expense Bar Chart (last 6 months)
- Category-wise Expense Pie Chart
- Income vs Expense comparison Bar Chart
- Net Savings Trend Line Chart
- Category breakdown table with percentage bars

###  UI / UX
- Modern dark-themed dashboard design (glassmorphism + gradient accents)
- Fully responsive layout (mobile, tablet, desktop)
- Collapsible sidebar navigation
- Loading spinners & skeleton states
- Toast notifications (success/error) via `react-hot-toast`
- Modal-based forms for add/edit
- Confirmation dialogs for delete actions

---

##  Technology Stack

### Frontend
- **React.js** (Vite)
- **React Router v6**
- **Tailwind CSS**
- **Recharts** (data visualization)
- **Axios** (HTTP client)
- **react-hot-toast** (notifications)
- **lucide-react** (icons)
- **date-fns** (date formatting)

### Backend
- **Node.js**
- **Express.js**
- **JWT (jsonwebtoken)** for authentication
- **bcryptjs** for password hashing
- **CORS**, **dotenv**

### Database
- **MongoDB**
- **Mongoose** (ODM)

---

## Project Structure

```
expense-tracker-dashboard/
│
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seed.js             # Demo account & sample data seeder
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── expenseController.js
│   │   ├── incomeController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   └── auth.js             # JWT protect & admin middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Expense.js
│   │   └── Income.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── incomeRoutes.js
│   │   └── dashboardRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Layout.jsx
│   │   │   └── ui/
│   │   │       └── index.jsx   # Modal, StatCard, Spinner, Badge, etc.
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Income.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   └── api.js           # Axios instance + API calls
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── package.json                 # Root scripts (concurrently)
├── .gitignore
└── README.md
```

---

##  Environment Variables

Create a `.env` file inside the **backend** folder (copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
NODE_ENV=development
```

| Variable     | Description                                  | Default                                      |
|--------------|-----------------------------------------------|-----------------------------------------------|
| `PORT`       | Port the Express server runs on               | `5000`                                       |
| `MONGO_URI`  | MongoDB connection string                     | `mongodb://localhost:27017/expense-tracker` |
| `JWT_SECRET` | Secret key used to sign JWT tokens            | *(must set your own)*                       |
| `JWT_EXPIRE` | JWT token expiry duration                     | `30d`                                        |
| `NODE_ENV`   | Environment mode                              | `development`                                |

The frontend requires no `.env` — Vite is pre-configured to proxy `/api` requests to `http://localhost:5000`.

---

##  Installation Steps

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ installed
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (or a MongoDB Atlas connection string)

### 1. Clone / Extract the project
```bash
cd expense-tracker-dashboard
```

### 2. Configure environment variables
```bash
cd backend
cp .env.example .env
# edit .env if needed (especially MONGO_URI and JWT_SECRET)
cd ..
```

### 3. Install dependencies

**Option A — install everything at once (from root):**
```bash
npm install
npm run install-all
```

**Option B — install manually:**
```bash
cd backend
npm install
cd ../frontend
npm install
cd ..
```

---

##  How to Run

### Make sure MongoDB is running
```bash
# Example for local MongoDB (Linux/macOS)
mongod
```

### Run both frontend & backend together (from root)
```bash
npm run dev
```
This starts:
- Backend API on **http://localhost:5000**
- Frontend (Vite) on **http://localhost:5173**

### Or run them separately

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend (in a new terminal):**
```bash
cd frontend
npm run dev
```

Then open your browser at **http://localhost:5173**.

>  On first run, the backend automatically connects to MongoDB and seeds the two demo accounts (with 6 months of sample income/expense data) if they don't already exist.

---

##  Demo Credentials

| Role  | Email                | Password   |
|-------|----------------------|------------|
| Admin | `admin@expense.com`  | `admin123` |
| User  | `user@expense.com`   | `user123`  |

Both accounts are pre-loaded with 6 months of sample income and expense data so you can immediately explore the dashboard, charts, and analytics. You can also click the demo account buttons on the login page to auto-fill credentials.

---

##  API Endpoints Reference

### Auth
| Method | Endpoint              | Description              | Protected |
|--------|-----------------------|---------------------------|-----------|
| POST   | `/api/auth/register`  | Register a new user       | No        |
| POST   | `/api/auth/login`      | Login user                | No        |
| GET    | `/api/auth/me`         | Get current user          | Yes       |
| PUT    | `/api/auth/profile`    | Update profile            | Yes       |
| PUT    | `/api/auth/password`   | Change password           | Yes       |

### Expenses
| Method | Endpoint              | Description                     | Protected |
|--------|-----------------------|----------------------------------|-----------|
| GET    | `/api/expenses`        | Get all expenses (with filters) | Yes       |
| GET    | `/api/expenses/stats`  | Get expense statistics          | Yes       |
| GET    | `/api/expenses/:id`    | Get single expense               | Yes       |
| POST   | `/api/expenses`        | Create expense                  | Yes       |
| PUT    | `/api/expenses/:id`    | Update expense                  | Yes       |
| DELETE | `/api/expenses/:id`    | Delete expense                  | Yes       |

### Income
| Method | Endpoint              | Description                  | Protected |
|--------|-----------------------|--------------------------------|-----------|
| GET    | `/api/income`          | Get all income (with filters) | Yes       |
| GET    | `/api/income/stats`    | Get income statistics          | Yes       |
| GET    | `/api/income/:id`      | Get single income               | Yes       |
| POST   | `/api/income`          | Create income                  | Yes       |
| PUT    | `/api/income/:id`      | Update income                  | Yes       |
| DELETE | `/api/income/:id`      | Delete income                  | Yes       |

### Dashboard
| Method | Endpoint                | Description                                 | Protected |
|--------|--------------------------|-----------------------------------------------|-----------|
| GET    | `/api/dashboard/summary`| Get totals, monthly stats, charts, recents     | Yes       |

Query params supported on `GET /api/expenses` and `GET /api/income`:
`category`, `startDate`, `endDate`, `search`, `page`, `limit`

---

##  Quick Test Checklist

1. Visit `http://localhost:5173` → redirected to `/login`
2. Click a demo account button → click **Sign In**
3. Land on `/dashboard` → see stat cards & charts populated with seeded data
4. Go to **Expenses** → add, edit, delete, search, and filter expenses
5. Go to **Income** → add, edit, delete income entries
6. Go to **Analytics** → view all charts (bar, pie, line)
7. Go to **Profile** → update name/email, change password
8. Click **Logout** → redirected back to `/login`

---

## License

This project was created for educational/internship purposes (Intern ID: CITS3291).
