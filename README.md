# 🏆 TeamBudget

A comprehensive web application for managing **sports team expenses**, **player payments**, and **financial tracking**. Built with modern technologies to help team organizers efficiently manage their team finances.

---

## 🏸 Overview

**TeamBudget** simplifies the financial management of sports teams by providing:

* 💼 **Multi-team support** for different sports and seasons
* 👥 **Player management** with contact information and payment tracking
* 💰 **Expense tracking** for court rentals, equipment, and other costs
* 🧾 **Payment recording** with multiple payment methods and status tracking
* 🔄 **Real-time synchronization** across all devices
* 📊 **Financial dashboards** with visual insights

---

## ✨ Features

### 🎯 Core Features

* **Team Management:** Create and manage multiple teams for different sports
* **Player Roster:** Maintain player profiles with contact information
* **Expense Tracking:** Record monthly expenses with categorization
* **Payment Management:** Track player payments with status monitoring
* **Real-time Dashboard:** View financial overview and key metrics
* **Multi-currency Support:** USD, CAD, EUR, GBP, and more

### 📊 Financial Features

* Automatic per-player cost calculation
* Payment status tracking (Paid, Pending, Partial)
* Outstanding balance monitoring
* Collection rate analytics
* Monthly financial summaries

---

## 🔐 Security & Data

* Firebase Authentication with email/password
* Real-time database with user-specific data isolation
* Secure environment variable configuration
* Data persistence and backup

---

## 🛠 Technology Stack

### Frontend

* **React 18** – Modern React with hooks and functional components
* **React Router DOM** – Client-side routing
* **Tailwind CSS** – Utility-first CSS framework
* **Lucide React** – Beautiful icons
* **Vite** – Fast build tool and dev server

### Backend & Database

* **Firebase Authentication** – Secure user management
* **Firebase Realtime Database** – Real-time synchronization
* **Firebase Security Rules** – Access control

### Development Tools

* **PostCSS** – CSS processing
* **Environment Variables** – Secure configuration management

---

## 🚀 Quick Start

### Prerequisites

* Node.js 16+
* npm or yarn
* Firebase account

### Installation

```bash
git clone <repository-url>
cd team-budget
npm install
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Start Development Server

```bash
npm run dev
```

Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project** → Name it `teambudget`
3. Disable Google Analytics → Click **Create project**

### 2. Enable Authentication

* Go to **Authentication → Get Started**
* Under **Sign-in Method**, enable **Email/Password**

### 3. Create Realtime Database

* Navigate to **Realtime Database → Create Database**
* Choose **Start in test mode** and select region

### 4. Configure Security Rules

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```

### 5. Get Configuration

* Go to **Project Settings → Your Apps → Web (</>)**
* Register app name: `teambudget-web`
* Copy config to `.env` file

---

## 📁 Project Structure

```
teambudget/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── expenses/
│   │   ├── players/
│   │   ├── payments/
│   │   └── teams/
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── DataContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useData.js
│   │   └── useFirebase.js
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Teams.jsx
│   │   ├── Players.jsx
│   │   ├── Expenses.jsx
│   │   ├── Payments.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   ├── firebase.js
│   │   └── database.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   └── styles/
│       └── index.css
├── .env
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🎮 Usage Guide

### Getting Started

1. **Register/Login** – Create an account
2. **Create Team** – Add name, sport, and currency
3. **Add Players** – Input player details and contact info
4. **Record Expenses** – Add monthly expenses with categories
5. **Track Payments** – Log payments by player and method

### Supported Sports

Badminton • Basketball • Soccer • Volleyball • Tennis • Hockey • Baseball • Football • Cricket • Rugby • Other

### Payment Methods

Zelle • Venmo • PayPal • Cash • Bank Transfer • Others

---

## 📊 Dashboard Features

### Financial Overview

* Total collected amount
* Total expenses
* Outstanding balances
* Collection rate percentage
* Active player count

### Team Management

* Quick team switching
* Team-specific data
* Player attendance tracking
* Expense categorization

---

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Alternative start
npm start
```

---

## ⚙️ Configuration

### Environment Variables

| Variable                          | Description          | Required |
| --------------------------------- | -------------------- | -------- |
| VITE_FIREBASE_API_KEY             | Firebase API key     | ✅        |
| VITE_FIREBASE_AUTH_DOMAIN         | Firebase auth domain | ✅        |
| VITE_FIREBASE_DATABASE_URL        | Realtime DB URL      | ✅        |
| VITE_FIREBASE_PROJECT_ID          | Firebase project ID  | ✅        |
| VITE_FIREBASE_STORAGE_BUCKET      | Storage bucket URL   | ❌        |
| VITE_FIREBASE_MESSAGING_SENDER_ID | Messaging sender ID  | ❌        |
| VITE_FIREBASE_APP_ID              | Firebase app ID      | ✅        |

### Tailwind CSS Configuration

* Custom color palette (primary, success, warning, danger)
* Custom animations (fade-in, slide-up)
* Component classes for buttons, cards, and inputs

---

## 🐛 Troubleshooting

### Common Issues

#### Firebase Configuration Error

* Check `.env` variables
* Verify project ID in URL
* Confirm Firebase setup

#### Environment Variables Not Loading

* Restart dev server
* Ensure variables start with `VITE_`
* Confirm `.env` is in root

#### Database Permission Errors

* Verify Firebase rules
* Ensure user is authenticated

### Development Tips

* Use browser dev tools
* Check Firebase Console for real-time data
* Monitor console for errors

---

## 🤝 Contributing

### Steps

1. Fork the repository
2. Create a feature branch:

   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit changes:

   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push branch:

   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Guidelines

* Follow React best practices
* Use Tailwind for styling
* Add error handling and comments

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

* **Firebase** for backend and real-time database
* **React Team** for the framework
* **Tailwind CSS** for the design system
* **Lucide Icons** for beautiful iconography
* **Vite** for blazing-fast builds

---

## 📞 Support

If you encounter issues:

* Review the **Troubleshooting** section
* Check **Firebase Documentation**
* Open a GitHub **Issue**
* Contact the **Development Team**

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The `dist/` folder will contain production-ready files that can be deployed to any static hosting service.

### Recommended Hosting

* **Firebase Hosting** – Perfect for Firebase-based projects.

---

> **TeamBudget** – Making sports team finance management simple and efficient! 🏆
