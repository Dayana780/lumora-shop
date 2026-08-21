# Lumora — Cosmetics E-Commerce

Lumora is a modern cosmetics e-commerce web application built with React and Supabase.

The project was developed as a portfolio project to practice building a complete React application with authentication, product management, shopping cart functionality, orders, payments, wishlist, and an admin dashboard.

## ✨ Features

### Customer

- User registration and login
- Authentication with Supabase
- Product browsing and categories
- Product details
- Shopping cart
- Wishlist
- User profile
- Address management
- Checkout flow
- Mock payment flow
- Order history
- Order details

### Admin

- Admin authentication and authorization
- Dashboard with store statistics
- Product management
- Product creation and editing
- Product image management
- Product activation/deactivation
- Order management
- Order status management
- Payment status management
- User management
- User details

## 🛠️ Tech Stack

- React
- Vite
- React Router
- TanStack Query
- Context API
- Tailwind CSS
- Supabase
- JavaScript
- ESLint

## 🏗️ Architecture

The project uses a feature-oriented structure while keeping the architecture intentionally simple and understandable.

Main concepts used in the project include:

- React Context for client-side state
- TanStack Query for server state and data fetching
- React Router for application routing
- Supabase for authentication, database, and storage
- Protected routes for authenticated and admin-only pages
- Reusable React components
- Responsive UI with Tailwind CSS

The architecture was designed to remain appropriate for a Junior React developer portfolio project without unnecessary over-engineering.

## 🔐 Authentication & Authorization

Authentication is handled using Supabase Auth.

The application includes:

- Login
- Registration
- Logout
- Protected routes
- Guest routes
- Admin routes
- Role-based access control

Admin functionality is restricted to users with the appropriate role.

## 🗄️ Backend

Lumora uses Supabase for backend functionality, including:

- PostgreSQL database
- Authentication
- Storage
- Row Level Security (RLS)
- Database queries
- RPC functions where appropriate

## 🛍️ E-Commerce Flow

The main customer flow is:

**Browse Products → Product Details → Add to Cart → Checkout → Payment → Order**

Users can also manage their wishlist, profile, addresses, and previous orders.

## 📊 Admin Flow

Administrators can manage the main parts of the store through the admin dashboard:

**Dashboard → Products → Orders → Users**

The dashboard provides an overview of store activity, while dedicated sections allow administrators to manage products, orders, and users.

## 🎨 UI/UX

Lumora uses a modern beauty-focused visual style designed specifically for a cosmetics e-commerce experience.

The interface focuses on:

- Clean layouts
- Soft and elegant colors
- Consistent spacing
- Responsive design
- Clear visual hierarchy
- Reusable UI patterns
- Responsive product grids
- User-friendly forms and interactions
- Loading, error, and empty states

The design is intended to feel modern, feminine, elegant, and premium while remaining practical and easy to use.

## 📱 Responsive Design

The application is designed to work across:

- Desktop
- Tablet
- Mobile

Layouts, navigation, product grids, forms, and admin pages adapt to different screen sizes.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Navigate to the project

```bash
cd lumora
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Start the development server

```bash
npm run dev
```

The application will be available at the local development URL shown in your terminal.

## 📦 Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```text
src/
├── components/
├── config/
├── context/
├── features/
├── lib/
├── pages/
└── App.jsx
```

The project is organized around reusable components, application features, shared contexts, and pages.

## 🎯 Project Goals

This project was built to strengthen practical React development skills, including:

- Building reusable components
- Managing application state
- Working with server-side data
- Authentication and authorization
- Working with a real backend service
- Building e-commerce functionality
- Handling asynchronous operations
- Creating responsive interfaces
- Structuring a medium-sized React application

## 🔮 Future Improvements

Possible future improvements include:

- Real payment gateway integration
- More advanced product filtering and search
- Automated testing
- Improved analytics
- Performance optimization
- Further accessibility improvements
- TypeScript migration

## 👩‍💻 Author

**Dayana**

Frontend Developer focused on React and modern web development.

---

⭐ If you find this project interesting, feel free to explore the repository.
