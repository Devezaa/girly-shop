import { BrowserRouter, Routes, Route, useLocation, useNavigationType, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense, useEffect } from "react";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

// 📦 Lazy Load Pages
const Welcome = lazy(() => import("../pages/Welcome"));
const CategorySelection = lazy(() => import("../pages/CategorySelection"));
const HomeRedesign = lazy(() => import("../pages/HomeRedesign"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Vouchers = lazy(() => import("../pages/Vouchers"));
const OrderDetails = lazy(() => import("../pages/OrderDetails"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Settings = lazy(() => import("../pages/Settings"));
const Profile = lazy(() => import("../pages/Profile"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const Notifications = lazy(() => import("../pages/Notifications"));
const AdminProducts = lazy(() => import("../pages/AdminProducts"));
const AdminBanners = lazy(() => import("../pages/AdminBanners"));
const AdminVouchers = lazy(() => import("../pages/AdminVouchers"));
const AdminChat = lazy(() => import("../pages/AdminChat"));
const Terms = lazy(() => import("../pages/Terms"));
const VoucherGuide = lazy(() => import("../pages/VoucherGuide"));
const Shop = lazy(() => import("../pages/Shop"));

// 🌼 Loading Screen
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      className="text-pink-500 text-2xl font-semibold"
    >
      ✨ Loading Lovely Boutique...
    </motion.div>
  </div>
);

// 🌷 Scroll to top on route change (except when going back)
function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType !== "POP") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, navType]);

  return null;
}

// 🩰 Animated Route Transitions
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Routes location={location} key={location.pathname}>
          {/* 🏠 Main Pages */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/category-selection" element={<CategorySelection />} />
          <Route path="/categories" element={<CategorySelection />} />

          {/* 👑 Admin Route */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/banners" element={<AdminBanners />} />
            <Route path="/admin/vouchers" element={<AdminVouchers />} />
            <Route path="/admin/chat" element={<AdminChat />} />
          </Route>

          {/* 🎨 Main App Layout */}
          <Route element={<Layout />}>
            <Route path="/home" element={<HomeRedesign />} />
            <Route path="/cart" element={<OrderDetails />} />
            <Route path="/order-details" element={<OrderDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* ℹ️ Informational Pages */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/voucher-guide" element={<VoucherGuide />} />
            <Route path="/product" element={<Navigate to="/shop" replace />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/vouchers" element={<Vouchers />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

// 🌸 Main App Router
export default function AppRouter() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Suspense fallback={<LoadingScreen />}>
        <AnimatedRoutes />
      </Suspense>
    </BrowserRouter>
  );
}
