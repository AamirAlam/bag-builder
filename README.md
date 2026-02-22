# BagBuilder

<div align="center">
  <img src="public/vite.svg" alt="BagBuilder Logo" width="120" height="120">
  
  <h3>A disciplined trading companion on Solana</h3>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
  [![Made with React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)
</div>

---

## 📖 Overview

BagBuilder is an open-source crypto trading journal and portfolio tracker designed to help traders build disciplined habits. Track every trade, follow proven profit-taking rules, and build long term wealth not gambling habits.

### ✨ Key Features

- 🔐 **Anonymous Authentication** - No email required, just start trading
- 📊 **Trade Logging** - Track spot and futures positions with detailed notes
- 📈 **Portfolio Analytics** - Visualize your holdings and alert porfit taking on time.
- 📝 **Trading Journal** - Document your thoughts and learn from past decisions
- ⚖️ **Personalized Rules** - Get risk management rules based on your profile
- 💰 **Stablecoin Tracking** - Monitor your reserves and suggest best yield and airdrop farming without risking your stables.
- 🎯 **Profit-Taking System** - Built-in TP1/TP2 tracking for disciplined exits

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bagbuilder.git
   cd bagbuilder
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   
   Run the following SQL in your Supabase SQL Editor:
   ```bash
   # Copy the contents of database-schema.sql and run it in Supabase
   ```

5. **Enable Anonymous Authentication**
   
   In Supabase Dashboard:
   - Go to **Authentication** → **Providers**
   - Find **Anonymous** and enable it
   - Click **Save**

6. **Start the development server**
   ```bash
   pnpm dev
   ```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, Vite 8 |
| Styling | Tailwind CSS 4 |
| Backend | Supabase (PostgreSQL, Auth) |
| State | React Hooks, TanStack Query |
| Web3 | Wagmi, Viem, RainbowKit |

---

## 📁 Project Structure

```
bagbuilder/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   └── views/        # Page-level view components
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.js    # Authentication logic
│   │   └── useTradeData.js # Data fetching & mutations
│   ├── lib/              # Utility functions
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
├── database-schema.sql   # Supabase database schema
├── fix-rls-policy.sql    # RLS policy fixes
└── package.json
```

---

## 🗄️ Database Schema

The application uses the following tables:

| Table | Description |
|-------|-------------|
| `users` | User profiles and risk settings |
| `trades` | Trade entries with PnL tracking |
| `stables` | Stablecoin holdings |
| `contributions` | External fund additions |
| `journal` | Trading journal entries |

All tables use Row Level Security (RLS) to ensure users can only access their own data.

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Report bugs** by opening an issue
- 💡 **Suggest features** or improvements
- 📝 **Improve documentation**
- 🔧 **Submit pull requests**

### Development Workflow

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/bagbuilder.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation

4. **Run linting**
   ```bash
   pnpm lint
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
   
   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

6. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- Use functional components with hooks
- Follow the existing file structure
- Use Tailwind CSS for styling
- Keep components small and focused
- Add comments for complex logic

### Pull Request Process

1. Ensure your PR passes all linting checks
2. Update the README if you change functionality
3. Link any related issues in your PR description
4. Wait for review from maintainers

---

## 🐛 Bug Reports

Found a bug? Please open an issue with:

- **Description** of the bug
- **Steps to reproduce**
- **Expected behavior**
- **Screenshots** (if applicable)
- **Browser/OS** information

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Backend by [Supabase](https://supabase.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Icons and design inspiration from the crypto community

---

## 📞 Community

- **Discord**: [Join our community](#)
- **Twitter**: [@BagBuilder]()

---

<div align="center">
  <p>Made with ❤️ by traders, for traders</p>
  <p>
    <a href="#-quick-start">Get Started</a> •
    <a href="#-contributing">Contribute</a> •
    <a href="https://github.com/AamirAlam/bag-builder/issues">Report Bug</a>
  </p>
</div>
