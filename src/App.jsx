import React, { Suspense } from "react";
import "./App.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./router/AppRouter";
import BottomNav from "./components/BottomNav";

// 🌸 Loading fallback during lazy-loaded route transitions
const Loading = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 text-pink-600 font-semibold text-lg">
    <span className="animate-pulse">✨ Loading Lovely Boutique...</span>
  </div>
);

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        {/* 🩰 Suspense ensures lazy-loaded pages show loading animation */}
        <Suspense fallback={<Loading />}>
          <div id="root-app" className="min-h-screen bg-gray-50">
            <AuthProvider>
              <AppRouter />
              <BottomNav />
            </AuthProvider>
          </div>
        </Suspense>
      </WishlistProvider>
    </CartProvider>
  );
}
