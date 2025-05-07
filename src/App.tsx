
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import NotFound from "./pages/NotFound";
import QRScanPage from "./pages/QRScanPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import TableManagement from "./pages/admin/TableManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import SettingsPage from "./pages/admin/SettingsPage";
import OperatorDashboard from "./pages/admin/OperatorDashboard";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import { CartProvider } from "./contexts/CartContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Customer-facing routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<QRScanPage />} />
            <Route path="/menu/:tableId" element={<MenuPage />} />
            <Route path="/menu" element={<Navigate to="/scan" replace />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order-status/:orderId" element={<OrderStatusPage />} />
            
            {/* Admin/Operator routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/menu" element={<ProtectedRoute><MenuManagement /></ProtectedRoute>} />
            <Route path="/admin/tables" element={<ProtectedRoute requireAdmin={true}><TableManagement /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute><OrderManagement /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requireAdmin={true}><SettingsPage /></ProtectedRoute>} />
            <Route path="/admin/operator" element={<ProtectedRoute><OperatorDashboard /></ProtectedRoute>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
