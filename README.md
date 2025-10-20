A comprehensive web application for managing sports team expenses, player payments, and financial tracking. Built with modern technologies to help team organizers efficiently manage their team finances.

🏸 Overview
TeamBudget simplifies the financial management of sports teams by providing:

Multi-team support for different sports and seasons

Player management with contact information and payment tracking

Expense tracking for court rentals, equipment, and other costs

Payment recording with multiple payment methods and status tracking

Real-time synchronization across all devices

Financial dashboards with visual insights

✨ Features
🎯 Core Features
Team Management: Create and manage multiple teams for different sports

Player Roster: Maintain player profiles with contact information

Expense Tracking: Record monthly expenses with categorization

Payment Management: Track player payments with status monitoring

Real-time Dashboard: View financial overview and key metrics

Multi-currency Support: Support for USD, CAD, EUR, GBP, and more

📊 Financial Features
Automatic per-player cost calculation

Payment status tracking (Paid, Pending, Partial)

Outstanding balance monitoring

Collection rate analytics

Monthly financial summaries

🔐 Security & Data
Firebase Authentication with email/password

Real-time database with user-specific data isolation

Secure environment variable configuration

Data persistence and backup

🛠 Technology Stack
Frontend
React 18 - Modern React with hooks and functional components

React Router DOM - Client-side routing

Tailwind CSS - Utility-first CSS framework

Lucide React - Beautiful icons

Vite - Fast build tool and development server

Backend & Database
Firebase Authentication - User management and security

Firebase Realtime Database - Real-time data synchronization

Firebase Security Rules - Data access control

Development Tools
PostCSS - CSS processing

Environment Variables - Secure configuration management

🚀 Quick Start
Prerequisites
Node.js 16+ installed

npm or yarn package manager

Firebase account

Installation
Clone the repository

bash
git clone <repository-url>
cd team-budget
Install dependencies

bash
npm install
Environment Configuration
Create a .env file in the root directory:

env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
Start development server

bash
npm run dev
Open your browser
Navigate to http://localhost:3000

🔥 Firebase Setup
1. Create Firebase Project
Go to Firebase Console

Click "Add project" and name it "teambudget"

Disable Google Analytics (not required)

Click "Create project"

2. Enable Authentication
In Firebase Console, go to Authentication

Click "Get started"

Go to Sign-in method tab

Enable Email/Password provider

Click "Save"

3. Create Realtime Database
Go to Realtime Database

Click "Create Database"

Choose Start in test mode

Select your preferred region

Click "Create"

4. Configure Security Rules
Update database rules in Realtime Database > Rules:

json
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
5. Get Configuration
Go to Project settings

Scroll to Your apps

Click Web icon (</>)

Register app name: "teambudget-web"

Copy the configuration object to your .env file

📁 Project Structure
text
teambudget/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── common/        # Reusable components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── expenses/      # Expense management
│   │   ├── players/       # Player management
│   │   ├── payments/      # Payment tracking
│   │   └── teams/         # Team management
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.jsx
│   │   └── DataContext.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useData.js
│   │   └── useFirebase.js
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Teams.jsx
│   │   ├── Players.jsx
│   │   ├── Expenses.jsx
│   │   ├── Payments.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Settings.jsx
│   ├── services/          # Firebase services
│   │   ├── firebase.js
│   │   └── database.js
│   ├── utils/             # Utility functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   └── styles/            # Global styles
│       └── index.css
├── .env                   # Environment variables
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
🎮 Usage Guide
Getting Started
Register/Login: Create an account or sign in

Create Your First Team:

Click "Create Your First Team" on dashboard

Enter team name, sport type, and currency

Add location and schedule information

Add Players:

Navigate to Players page

Click "Add Player"

Enter player details and contact information

Record Expenses:

Go to Expenses page

Click "Add Expense"

Enter monthly expenses (court fees, equipment, etc.)

Set number of players for cost splitting

Track Payments:

Navigate to Payments page

Click "Record Payment"

Select player, amount, and payment status

Choose payment method

Supported Sports
Badminton

Basketball

Soccer

Volleyball

Tennis

Hockey

Baseball

Football

Cricket

Rugby

Other sports

Payment Methods
Zelle

Venmo

PayPal

Cash

Bank Transfer

Other methods

📊 Dashboard Features
Financial Overview
Total collected amount

Total expenses

Outstanding balances

Collection rate percentage

Active players count

Team Management
Quick team switching

Team-specific financial data

Player attendance tracking

Expense categorization

🔧 Available Scripts
bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Start development server (alternative)
npm start
⚙️ Configuration
Environment Variables
Variable	Description	Required
VITE_FIREBASE_API_KEY	Firebase API key	Yes
VITE_FIREBASE_AUTH_DOMAIN	Firebase auth domain	Yes
VITE_FIREBASE_DATABASE_URL	Realtime Database URL	Yes
VITE_FIREBASE_PROJECT_ID	Firebase project ID	Yes
VITE_FIREBASE_STORAGE_BUCKET	Storage bucket URL	No
VITE_FIREBASE_MESSAGING_SENDER_ID	Messaging sender ID	No
VITE_FIREBASE_APP_ID	Firebase app ID	Yes
Tailwind CSS Configuration
The project uses a custom Tailwind configuration with:

Primary, success, warning, and danger color schemes

Custom animations (fade-in, slide-up)

Component classes for buttons, cards, and inputs

🐛 Troubleshooting
Common Issues
Firebase Configuration Error

Ensure all environment variables are set

Verify database URL includes project ID

Check Firebase project settings

Environment Variables Not Loading

Restart development server after changing .env

Ensure variable names start with VITE_

Check file location (root directory)

Database Permission Errors

Verify Realtime Database rules

Check user authentication status

Ensure proper security rules configuration

Development Tips
Use browser developer tools to monitor network requests

Check Firebase console for database changes in real-time

Use the debug components to verify environment variables

Monitor browser console for error messages

🤝 Contributing
We welcome contributions! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

Development Guidelines
Follow React best practices with hooks

Use Tailwind CSS for styling

Maintain consistent component structure

Add proper error handling

Include comments for complex logic

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Firebase for backend services and real-time database

React Team for the amazing framework

Tailwind CSS for the utility-first CSS framework

Lucide for the beautiful icons

Vite for the fast build tool

📞 Support
If you encounter any issues or have questions:

Check the troubleshooting section above

Review Firebase documentation

Create an issue in the repository

Contact the development team

🚀 Deployment
Build for Production
bash
npm run build
The dist folder will contain the production-ready files that can be deployed to any static hosting service.

Recommended Hosting
Firebase Hosting: Ideal for Firebase projects



TeamBudget - Making sports team finance management simple and efficient! 🏆