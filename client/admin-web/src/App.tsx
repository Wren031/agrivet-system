import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './features/auth/pages/LoginPage'
import DashboardPage from './features/dashboard/pages/DashboardPage'
import InventoryPage from './features/inventory/pages/InventoryPage'
import InventoryDetailPage from './features/inventory/pages/InventoryDetailPage'
import CategoriesPage from './features/categories/pages/CategoriesPage'
import AgentsPage from './features/agents/pages/AgentsPage'
import AgentDetailPage from './features/agents/pages/AgentDetailPage'
import CustomersPage from './features/customers/pages/CustomersPage'
import CustomerDetailPage from './features/customers/pages/CustomerDetailPage'
import OrdersPage from './features/orders/pages/OrdersPage'
import OrderDetailPage from './features/orders/pages/OrderDetailPage'
import SettingsPage from './features/settings/pages/SettingsPage'
import BookingPage from './features/booking/pages/ReceivingOrdersPage'
import BookingDetailPage from './features/booking/pages/BookingDetailPage'
import BranchBookingDetailPage from './features/booking/pages/BranchBookingDetailPage'
import BranchPage from './features/branch/pages/BranchPage'
import BranchDetailPage from './features/branch/pages/BranchDetailPage'
import StaffPage from './features/staff/pages/StaffPage'
import TasksPage from './features/tasks/pages/TasksPage'
import TaskDetailPage from './features/tasks/pages/TaskDetailPage'
import VerificationPage from './features/verification/pages/VerificationPage'

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
            <Route path="inventory/:id" element={<InventoryDetailPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="agents" element={<AgentsPage />} />
            <Route path="agents/:id" element={<AgentDetailPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="bookings" element={<BookingPage />} />
            <Route path="bookings/branch/:id" element={<BranchBookingDetailPage />} />
            <Route path="bookings/:id" element={<BookingDetailPage />} />
            <Route path="branches" element={<BranchPage />} />
            <Route path="branches/:id" element={<BranchDetailPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="tasks/:id" element={<TaskDetailPage />} />
            <Route path="verification" element={<VerificationPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
