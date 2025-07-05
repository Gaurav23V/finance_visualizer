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
- 🚀 **REST API** - Complete CRUD operations for transactions
- ✅ **Comprehensive Testing** - API testing utilities included

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
- MongoDB instance (local or MongoDB Atlas)

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
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance_visualizer
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Documentation

The application includes a complete REST API for transaction management. See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint documentation.

### Quick API Test

Test the API endpoints with the included test script:

```bash
# Make sure the development server is running
npm run dev

# In another terminal, run the API test
node test-api.js
```

### API Endpoints

- `GET /api/health` - System health check
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get all transactions (with filtering)
- `GET /api/transactions/[id]` - Get single transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── health/        # Health check endpoint
│   │   └── transactions/  # Transaction CRUD endpoints
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── charts/       # Chart components
│   │   ├── forms/        # Form components
│   │   └── layout/       # Layout components
│   └── lib/              # Utility functions
│       ├── api/          # API utilities
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
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | - |
| `NEXTAUTH_SECRET` | Secret for authentication | - |
| `NEXTAUTH_URL` | Base URL for the application | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | `development` |

## Database Schema

### Transactions Collection

```typescript
interface Transaction {
  _id: string;           // MongoDB ObjectId
  amount: number;        // Positive for income, negative for expenses
  date: Date;           // Transaction date
  description: string;   // Transaction description (1-500 characters)
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Last update timestamp
}
```

### Indexes

The following indexes are automatically created for optimal performance:

- `date: -1` - Sort by date (descending)
- `amount: 1` - Filter by amount
- `createdAt: -1` - Sort by creation date
- `description: text` - Text search on description

## API Features

### Validation
- Comprehensive input validation with detailed error messages
- Type safety with TypeScript interfaces
- MongoDB ObjectId format validation

### Error Handling
- Consistent error response format
- Proper HTTP status codes
- Detailed validation error reporting
- Database connection error handling

### Filtering & Pagination
- Date range filtering
- Amount range filtering
- Sorting by multiple fields
- Pagination with skip/limit
- Total count for pagination

### Performance
- MongoDB connection pooling
- Singleton pattern for database connections
- Optimized queries with indexes
- Efficient data serialization

## Testing

### API Testing
```bash
# Run the comprehensive API test suite
node test-api.js
```

### Manual Testing
```bash
# Health check
curl http://localhost:3000/api/health

# Create transaction
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "date": "2024-01-01", "description": "Test"}'

# Get transactions
curl http://localhost:3000/api/transactions
```

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

- [x] ✅ **Database Schema & API** - Complete CRUD operations
- [x] ✅ **Transaction Management** - Create, read, update, delete
- [x] ✅ **Data Validation** - Comprehensive input validation
- [x] ✅ **Error Handling** - Robust error management
- [ ] 🚧 **User Authentication** - Secure user accounts
- [ ] 🚧 **Categories Management** - Transaction categorization
- [ ] 🚧 **Data Visualization** - Charts and analytics
- [ ] 🚧 **Budget Tracking** - Budget management features
- [ ] 🚧 **Data Import/Export** - CSV/JSON import/export
- [ ] 🚧 **Recurring Transactions** - Automated recurring entries
- [ ] 🚧 **Financial Goals** - Goal setting and tracking
- [ ] 🚧 **Mobile App** - React Native application
- [ ] 🚧 **Advanced Analytics** - Machine learning insights
- [ ] 🚧 **Bank Integration** - Connect to bank accounts

## Support

If you encounter any issues or have questions:

1. Check the [API Documentation](./API_DOCUMENTATION.md)
2. Run the test script: `node test-api.js`
3. Check the console for error messages
4. Open an issue on GitHub with detailed information

## Recent Updates

### v1.1.0 - Database & API Implementation
- ✅ Complete MongoDB integration with connection pooling
- ✅ Full CRUD API for transactions with TypeScript
- ✅ Comprehensive input validation and error handling
- ✅ Advanced filtering, sorting, and pagination
- ✅ Database health monitoring and testing utilities
- ✅ Complete API documentation and testing suite
