# Finance Visualizer

A comprehensive personal finance tracking and visualization application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 📊 **Interactive Charts** - Visualize your financial data with Recharts
- 💰 **Transaction Tracking** - Record and categorize income and expenses
- 📈 **Budget Management** - Set and track budgets by category
- 🌙 **Dark/Light Mode** - Theme switching with system preference detection
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Built with shadcn/ui components
- 🔒 **Type Safety** - Full TypeScript support
- 🗄️ **MongoDB Integration** - Persistent data storage

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Charts**: Recharts
- **Database**: MongoDB
- **Theme**: next-themes
- **Icons**: Lucide React
- **Linting**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finance_visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/finance_visualizer
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── transactions/  # Transaction endpoints
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── charts/       # Chart components
│   │   ├── forms/        # Form components
│   │   └── layout/       # Layout components
│   └── lib/              # Utility functions
│       ├── db/           # Database utilities
│       └── utils/        # General utilities
├── types/                 # TypeScript type definitions
└── styles/               # Additional styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | - |
| `NEXTAUTH_SECRET` | Secret for authentication | - |
| `NEXTAUTH_URL` | Base URL for the application | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | `development` |

## Database Schema

### Transactions
- `id`: Unique identifier
- `amount`: Transaction amount
- `description`: Transaction description
- `category`: Category name
- `type`: 'income' or 'expense'
- `date`: Transaction date
- `account`: Account name (optional)
- `tags`: Array of tags (optional)

### Categories
- `id`: Unique identifier
- `name`: Category name
- `color`: Display color
- `type`: 'income' or 'expense'
- `budget`: Budget amount (optional)

### Accounts
- `id`: Unique identifier
- `name`: Account name
- `type`: Account type
- `balance`: Current balance
- `currency`: Currency code

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Code Style

This project uses ESLint and Prettier for code formatting. Run `npm run lint` and `npm run format` before committing.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Roadmap

- [ ] User authentication
- [ ] Data import/export
- [ ] Recurring transactions
- [ ] Financial goals tracking
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Bank account integration

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
