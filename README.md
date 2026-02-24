# 🚗 ParkSpace - Parking Space Rental Platform

A full-stack parking space rental application built with modern technologies. Owners can list parking spaces, and renters can search, book, and pay for spots with real-time availability updates.

![ParkSpace](https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800)

## ✨ Features

### For Renters
- 🗺️ **Interactive Map Search** - Find parking spots on a Mapbox-powered map
- 🔍 **Advanced Filtering** - Filter by price, location, and availability
- 📅 **Easy Booking** - Book spots with just a few clicks
- 💳 **Secure Payments** - Pay via Stripe (or simulated for demo)
- 📱 **Real-time Updates** - See live availability changes

### For Owners
- ➕ **List Spaces** - Add your parking spots with images and pricing
- 📊 **Dashboard** - Track earnings and active bookings
- 🔔 **Notifications** - Get notified when someone books your space

### Technical
- 🔐 **JWT Authentication** - Secure login and registration
- ⚡ **Real-time Sync** - Socket.io for live updates
- 🔒 **SQL Transactions** - Prevent double-booking with atomic operations
- 📱 **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **react-map-gl** (Mapbox) for maps
- **Zustand** for state management

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma** ORM with SQLite (dev) / PostgreSQL (prod)
- **Socket.io** for real-time features
- **JWT** for authentication
- **Stripe** for payments

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Setup Database

```bash
cd server

# Generate Prisma client
npm run db:generate

# Push schema to database (creates SQLite file)
npm run db:push
```

### 3. Start Development Servers

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend  
cd client
npm run dev
```

### 4. Open the App

Visit `http://localhost:5173` in your browser.

## 🔧 Configuration

### Environment Variables

#### Server (`server/.env`)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
STRIPE_SECRET_KEY="sk_test_..."  # Optional
PORT=3001
FRONTEND_URL="http://localhost:5173"
```

#### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:3001
VITE_MAPBOX_TOKEN=pk.your_token  # Get from mapbox.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Optional
```

### Getting API Keys

1. **Mapbox** (for maps): Sign up at [mapbox.com](https://mapbox.com) and get a free access token
2. **Stripe** (for payments): Sign up at [stripe.com](https://stripe.com) for test API keys

> 💡 The app works without these keys! Maps will show a placeholder, and payments will be simulated.

## 📁 Project Structure

```
parking-space/
├── server/                 # Backend API
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── src/
│       ├── index.ts        # Express app entry
│       ├── routes/         # API endpoints
│       ├── middleware/     # Auth, error handling
│       └── lib/            # Utilities
│
├── client/                 # Frontend React app
│   └── src/
│       ├── pages/          # Route pages
│       ├── components/     # Reusable components
│       ├── stores/         # Zustand stores
│       └── lib/            # API client, socket
│
└── README.md
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user

### Spaces
- `GET /api/spaces` - List all spaces (with filters)
- `GET /api/spaces/:id` - Get space details
- `POST /api/spaces` - Create space (Owner)
- `PUT /api/spaces/:id` - Update space (Owner)
- `DELETE /api/spaces/:id` - Delete space (Owner)

### Bookings
- `GET /api/bookings/my-bookings` - User's bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking

### Payments
- `POST /api/payments/create-intent` - Create payment

## 🧪 Testing the App

1. **Register** as an Owner at `/register`
2. **Create a space** at `/create-space`
3. **Register** a second account as a Renter
4. **Search** for the space at `/search`
5. **Book** the space and complete payment

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Railway/Render)
```bash
cd server
npm run build
# Deploy to Railway with PostgreSQL addon
```

### Database (Neon/Supabase)
Update `DATABASE_URL` in production to use PostgreSQL.

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

---

Built with ❤️ using React, Node.js, and modern web technologies.
