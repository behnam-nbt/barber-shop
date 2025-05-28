# 💈 Barbershop Reservation & E-Commerce Platform

A modern full-stack web application built with **Next.js**, **Tailwind CSS**, **MongoDB**, and **React Query**, providing a seamless experience for booking barbershop appointments and shopping for grooming products. The application includes an OTP login system, shopping cart, admin dashboard, and more. Deployed on [Liara](https://liara.ir).

---

## 🚀 Live Demo

👉 [Live Website](https://barber-shop.liara.run)

---

## 📌 Features

### 🧑‍💼 User Side
- 🔐 **OTP Login** via Phone Number
- 🍪 **Access & Refresh Token** stored in cookies
- 📅 **Appointment Booking**
  - Select **Category**, **Barber**, **Date**, and **Time Slots**
- 🛒 **Product Shop**
  - Browse and filter products
  - Add to **Cart** and **Favorites**
  - Automatically sync cart & favorites from **LocalStorage** after login
  - **Increment/Decrement** product quantity in detail page
- 📦 **Cart Persistence**
  - Works for guests (via localStorage)
  - Syncs with database after login

### 🛠️ Admin Panel
- ✍️ Manage **Products**, **Categories**, **Blogs**, **Time Slots**, and more
- 📈 Admin dashboard overview

---

## 🛠 Tech Stack

### Frontend
- **Next.js** (App Router)
- **Tailwind CSS**
- **React Query**
- **Zod** + **React Hook Form**
- **Context API**

### Backend
- **MongoDB** with Mongoose
- **Next.js API Routes**
- **JWT Authentication (Access & Refresh Tokens)**
- **OTP Login** system via phone



---

## 🧪 Installation & Local Development

### 1. Clone the repo
```bash
git clone https://github.com/behnam-nbt/barber-shop.git
cd barber-shop-main
```

### 2. Install dependencies
```bash
npm install
# or
yarn
```
### 3. Environment Variables
Create a .env.local file and fill in:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
MONGO_URI
```

### 4. Run the development server
```bash
npm run dev
# or
yarn dev
```
## 🙏 Acknowledgments
- **Next.js** (App Router)
- **Tailwind CSS**
- **React Query**
- **Zod**
- **React Hook Form**
- **Context API**
- **MongoDB**
- **Liara**

## 📬 Contact
- ** 📧behnamnabati0@gmail.com
