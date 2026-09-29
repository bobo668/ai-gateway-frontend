import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import MainLayout from './components/Layout/MainLayout'
import LoginPage from './features/auth/pages/LoginPage'
import DashboardPage from './features/dashboard/pages/DashboardPage'
import ProviderListPage from './features/providers/pages/ProviderListPage'
import ConsumerListPage from './features/consumers/pages/ConsumerListPage'
import ApiKeyManagement from './features/api-keys/pages/ApiKeyManagement'
import PolicyListPage from './features/policies/pages/PolicyListPage'
import RateLimitListPage from './features/ratelimits/pages/RateLimitListPage'
import CallRecordListPage from './features/call-records/pages/CallRecordListPage'
import McpServerListPage from './features/mcp/pages/McpServerListPage'
import CostReportPage from './features/reports/pages/CostReportPage'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="providers" element={<ProviderListPage />} />
          <Route path="consumers" element={<ConsumerListPage />} />
          <Route path="consumers/:consumerId/api-keys" element={<ApiKeyManagement />} />
          <Route path="policies" element={<PolicyListPage />} />
          <Route path="ratelimits" element={<RateLimitListPage />} />
          <Route path="call-records" element={<CallRecordListPage />} />
          <Route path="mcp" element={<McpServerListPage />} />
          <Route path="reports" element={<CostReportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
