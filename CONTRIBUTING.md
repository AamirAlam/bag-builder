# Contributing to BagBuilder

First off, thank you for considering contributing to BagBuilder! It's people like you that make this project better for everyone.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

---

## Code of Conduct

This project and everyone participating in it is governed by basic principles of respect and inclusivity. By participating, you are expected to uphold this code. Please be respectful, constructive, and professional in all interactions.

---

## Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **pnpm** 8.0 or higher (recommended) or npm
- **Git**
- A **Supabase account** (free tier works)

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/bagbuilder.git
   cd bagbuilder
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL from `database-schema.sql` in the SQL Editor
   - Enable Anonymous Authentication in Authentication → Providers

5. **Start the development server**
   ```bash
   pnpm dev
   ```

---

## Project Architecture

### Directory Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI primitives
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   └── ...
│   ├── views/           # Page-level components
│   │   ├── HomeView.jsx
│   │   ├── TradeView.jsx
│   │   └── ...
│   ├── MainApp.jsx      # Main app layout
│   └── OnBoarding.jsx   # User onboarding flow
├── hooks/
│   ├── useAuth.js       # Authentication state & methods
│   └── useTradeData.js  # Data fetching & mutations
├── lib/
│   └── cn.js            # Class name utility
├── App.jsx              # Root component
├── main.jsx             # Entry point
├── supabase.js          # Supabase client
└── index.css            # Global styles
```

### Key Concepts

#### Authentication Flow
- Uses Supabase anonymous authentication
- Session persisted in localStorage
- User ID stored and used for all data operations

#### Data Layer
- `useTradeData` hook manages all data operations
- Row Level Security (RLS) ensures data isolation
- Real-time updates via Supabase subscriptions

#### Component Patterns
- Functional components with hooks
- Props passed explicitly (no context for data)
- Tailwind CSS for all styling

---

## Coding Standards

### JavaScript/React

- Use **functional components** with hooks
- Use **named exports** for components
- Keep components **small and focused** (< 200 lines)
- Use **descriptive variable names**

```jsx
// ✅ Good
export function TradeCard({ trade, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  // ...
}

// ❌ Avoid
export default ({ t, u }) => {
  // ...
}
```

### Styling

- Use **Tailwind CSS** classes
- Follow the existing color scheme:
  - `bg-bg` - Main background
  - `text-tx` - Primary text
  - `text-dim` - Secondary text
  - `text-sub` - Subtle text
  - `border-border` - Border color

```jsx
// ✅ Good
<div className="px-4 py-2 bg-bg text-tx rounded-xl border border-border">

// ❌ Avoid inline styles
<div style={{ padding: '16px', backgroundColor: '#000' }}>
```

### File Naming

- **Components**: PascalCase (e.g., `TradeCard.jsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.js`)
- **Utilities**: camelCase (e.g., `cn.js`)

### Imports Order

```jsx
// 1. React
import { useState, useEffect } from 'react'

// 2. External libraries
import { supabase } from '../supabase'

// 3. Internal components
import { Button } from './ui/Button'

// 4. Utilities and hooks
import { cn } from '../lib/cn'
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons) |
| `refactor` | Code change without fix or feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies |

### Examples

```bash
feat: add trade export to CSV
fix: resolve session persistence issue
docs: update installation instructions
style: format trade card component
refactor: simplify auth hook logic
```

---

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run linting**
   ```bash
   pnpm lint
   ```

3. **Test your changes**
   - Test all affected features
   - Test on mobile viewport
   - Check for console errors

### PR Checklist

- [ ] Code follows the project's coding standards
- [ ] Linting passes without errors
- [ ] Documentation updated if needed
- [ ] Commit messages follow conventional commits
- [ ] PR description clearly explains the changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots
If applicable, add screenshots

## Related Issues
Fixes #(issue number)
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge

---

## Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported
2. Try to reproduce with the latest version
3. Clear browser cache and localStorage

### Bug Report Template

```markdown
**Description**
A clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Screenshots**
If applicable, add screenshots

**Environment**
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- Node version: [e.g., 20.10.0]

**Additional Context**
Any other relevant information
```

---

## Feature Requests

We welcome feature requests! Please include:

1. **Problem statement** - What problem does this solve?
2. **Proposed solution** - How should it work?
3. **Alternatives considered** - Other approaches you've thought of
4. **Additional context** - Mockups, examples from other apps

---

## Getting Help

- **GitHub Issues** - For bugs and feature requests
- **Discussions** - For questions and general discussion
- **Discord** - For real-time chat

---

## Recognition

Contributors will be recognized in:
- The project README
- Release notes for significant contributions

---

Thank you for contributing to BagBuilder! 🚀
