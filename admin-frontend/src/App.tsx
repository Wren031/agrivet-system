import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './features/auth/pages/LoginPage'
import DashboardPage from './features/dashboard/pages/DashboardPage'
import InventoryPage from './features/inventory/pages/InventoryPage'
import CategoriesPage from './features/categories/pages/CategoriesPage'
import AgentsPage from './features/agents/pages/AgentsPage'
import CustomersPage from './features/customers/pages/CustomersPage'
import OrdersPage from './features/orders/pages/OrdersPage'
import OrderDetailPage from './features/orders/pages/OrderDetailPage'
import SettingsPage from './features/settings/pages/SettingsPage'
import BookingPage from './features/booking/pages/BookingPage'
import BookingDetailPage from './features/booking/pages/BookingDetailPage'
import BranchPage from './features/branch/pages/BranchPage'
import StaffPage from './features/staff/pages/StaffPage'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="agents" element={<AgentsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="bookings" element={<BookingPage />} />
            <Route path="bookings/:id" element={<BookingDetailPage />} />
            <Route path="branches" element={<BranchPage />} />
            <Route path="staff" element={<StaffPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
