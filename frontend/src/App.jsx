// frontend/src/App.jsx - ATUALIZAR
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard.jsx'
import { SalesPage } from './pages/SalesPage.jsx'
import { ProductsPage } from './pages/ProductsPage.jsx'
import { CustomersPage } from './pages/CustomersPage.jsx'
import { ReportsPage } from './pages/ReportsPage.jsx'
import { ComparisonDashboard } from './pages/ComparisonDashboard.jsx' // ✅ NOVO
import { DateProvider } from './contexts/DateContext.jsx'
import { StoreProvider } from './contexts/StoreContext.jsx' // ✅ NOVO

// Componente de Layout com Navegação
const Layout = ({ children }) => {
  const navItems = [
    { path: '/', label: 'Dashboard', emoji: '📊' },
    { path: '/comparacao', label: 'Comparação', emoji: '🏪' }, // ✅ NOVO
    { path: '/vendas', label: 'Vendas', emoji: '💰' },
    { path: '/produtos', label: 'Produtos', emoji: '🍔' },
    { path: '/clientes', label: 'Clientes', emoji: '👥' },
    { path: '/relatorios', label: 'Relatórios', emoji: '📋' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com Navegação */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">🍔 GodLevelAnalytics</h1>
            </div>
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      
      {children}
    </div>
  )
}

function App() {
  return (
    <DateProvider>
      <StoreProvider> {/* ✅ NOVO */}
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/comparacao" element={<ComparisonDashboard />} /> {/* ✅ NOVO */}
              <Route path="/vendas" element={<SalesPage />} />
              <Route path="/produtos" element={<ProductsPage />} />
              <Route path="/clientes" element={<CustomersPage />} />
              <Route path="/relatorios" element={<ReportsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </StoreProvider> {/* ✅ NOVO */}
    </DateProvider>
  )
}

export default App