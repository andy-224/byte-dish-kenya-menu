
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";

// Page imports
import MenuPageWrapper from "./components/MenuPageWrapper";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import HomePage from "./pages/HomePage";
import QRScanPage from "./pages/QRScanPage";
import NotFound from "./pages/NotFound";

// Admin page imports
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OperatorDashboard from "./pages/admin/OperatorDashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import TableManagement from "./pages/admin/TableManagement";
import SettingsPage from "./pages/admin/SettingsPage";
import TableStatusDashboard from "./pages/admin/TableStatusDashboard";
import FeedbackPage from "./pages/admin/FeedbackPage";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/qr-scan" element={<QRScanPage />} />
              
              <Route element={<MenuPageWrapper />}>
                <Route path="/menu" element={<MenuPage />} />
              </Route>
              
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order/:orderId" element={<OrderStatusPage />} />
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={["admin", "operator"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/menu" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <MenuManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute allowedRoles={["admin", "operator"]}>
                  <OrderManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/tables" element={
                <ProtectedRoute allowedRoles={["admin", "operator"]}>
                  <TableManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/table-status" element={
                <ProtectedRoute allowedRoles={["admin", "operator"]}>
                  <TableStatusDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/feedback" element={
                <ProtectedRoute allowedRoles={["admin", "operator"]}>
                  <FeedbackPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="/operator" element={
                <ProtectedRoute allowedRoles={["operator"]}>
                  <OperatorDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
