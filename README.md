# Finance Visualizer

A modern personal finance tracking and visualization application built with **Next.js 15**, **React 19**, and **TypeScript**. Track income & expenses, set budgets, and gain insights into your spending patterns through interactive charts.

---

## Features

### Stage 1 – Basic Transaction Tracking

- ✅ Add, edit, and delete financial transactions
- ✅ Transaction list with sorting and filtering
- ✅ Monthly expenses visualization (bar charts)
- ✅ Robust form validation & error handling

### Stage 2 – Categories & Analytics

- ✅ Pre-defined expense categories
- ✅ Category-wise expense breakdown (pie charts)
- ✅ Comprehensive dashboard with summary cards
- ✅ Recent transactions overview

### Stage 3 – Budgeting

- ✅ Set monthly budgets per category
- ✅ Budget vs Actual comparison (bar charts)
- ✅ Spending insights & smart recommendations
- ✅ Visual budget utilisation indicators

---

## Tech Stack

| Layer      | Technology                                                              |
| ---------- | ----------------------------------------------------------------------- |
| Front-end  | Next.js 15 (App Router), React 19, TypeScript                           |
| UI Library | [shadcn/ui](https://ui.shadcn.com/) built on Radix UI & Tailwind CSS v4 |
| Charts     | [Recharts](https://recharts.org/)                                       |
| Styling    | Tailwind CSS with CSS Variables + dark mode                             |
| Database   | MongoDB Atlas (using the official Node driver)                          |
| Deployment | Vercel (zero-config for Next.js)                                        |

---

## Prerequisites

- **Node.js ≥ 18**
- **Git**
- **MongoDB Atlas** account (or other MongoDB connection string)

---

## Quick Start

```bash
# 1. Clone the repository
$ git clone https://github.com/your-username/finance-visualizer.git
$ cd finance-visualizer

# 2. Install dependencies
$ npm install        # or pnpm install / yarn

# 3. Set environment variables
$ cp .env.example .env.local
# → edit .env.local and paste your Mongo URI

# 4. Run the dev server
$ npm run dev        # http://localhost:3000
```

---

## Environment Variables

Create a `.env.local` (dev) or `.env.production` (prod) file with:

```env
# MongoDB connection string (required)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/finance_visualizer?retryWrites=true&w=majority
```

> The connection pool is automatically managed by the MongoDB Node driver (see `src/lib/db/mongodb.ts`).

---

## API Reference

Base URL (dev): `http://localhost:3000/api`

### Transactions

| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| GET    | `/transactions`     | List all transactions |
| POST   | `/transactions`     | Create a transaction  |
| PUT    | `/transactions/:id` | Update a transaction  |
| DELETE | `/transactions/:id` | Delete a transaction  |

#### Create Transaction

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Groceries",
    "amount": -54.23,
    "date": "2024-07-01",
    "category": "Groceries/Food"
}'
```

Response (201):

```json
{
  "data": {
    "transaction": {
      /* TransactionDocument */
    }
  },
  "message": "Transaction created successfully"
}
```

Error (400):

```json
{ "error": "Validation failed", "fields": { "amount": "Must be a number" } }
```

### Budgets

| Method | Endpoint   | Description                                  |
| ------ | ---------- | -------------------------------------------- |
| GET    | `/budgets` | Get budgets by `month` & `year` query params |
| POST   | `/budgets` | Create or update (upsert) a budget           |

### Analytics / Dashboard

| Method | Endpoint     | Description                   |
| ------ | ------------ | ----------------------------- |
| GET    | `/analytics` | Aggregated data for dashboard |

> Detailed request/response payloads are available in [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md).

---

## Development Scripts

| Command              | Purpose                              |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Start dev server with Turbopack      |
| `npm run lint`       | Run ESLint                           |
| `npm run type-check` | Run TypeScript type-checking         |
| `npm run build`      | Create production build              |
| `npm run start`      | Start production server locally      |
| `npm run clean`      | Remove `.next` & other build outputs |

---

## Production Build

1. **Compile**
   ```bash
   npm run build
   ```
2. **Run locally**
   ```bash
   npm run start -p 3000
   ```
3. Visit http://localhost:3000 — all pages & API routes should work.

### Common Build Issues

| Symptom                            | Fix                                             |
| ---------------------------------- | ----------------------------------------------- |
| "Can't find module ... types"      | `npm install @types/...` or correct import path |
| ESLint blocking build              | Run `npm run lint:fix`                          |
| Uncontrolled/controlled input warn | Ensure form `defaultValues` are defined (fixed) |

---

## Deployment (Vercel)

1. Push to a GitHub/GitLab repo.
2. Import the repo into Vercel.
3. In **Project Settings → Environment Variables** add:
   - `MONGODB_URI` (same value as `.env.local`)
4. Click **Deploy** — Vercel detects Next.js & runs `npm run build`.

### `vercel.json` (not required currently)

The default Vercel-Next.js config is sufficient. Add a custom `vercel.json` only if you need rewrites/headers.

---

## .env Example

See `.env.example` for a starter file.

---

## Final Checklist

- [x] `npm run build` completes with **no** errors/warnings
- [x] `npm run start` serves production build correctly
- [x] All API routes functional in production mode
- [x] No sensitive information committed
- [x] Error handling shows friendly messages + logs internally
- [x] MongoDB connection pooled & stable (maxPoolSize = 10)

Enjoy visualising your finances! 🎉
