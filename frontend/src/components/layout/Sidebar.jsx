import { useState } from 'react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', active: true },
  { id: 'sales', label: 'Vendas', icon: '💰' },
  { id: 'products', label: 'Produtos', icon: '🍕' },
  { id: 'customers', label: 'Clientes', icon: '👥' },
  { id: 'channels', label: 'Canais', icon: '📱' },
  { id: 'reports', label: 'Relatórios', icon: '📈' },
  { id: 'settings', label: 'Configurações', icon: '⚙️' },
];

export default function Sidebar({ isOpen, onClose }) {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 shadow-xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Food Analytics</h1>
              <p className="text-xs text-gray-500">Business Intelligence</p>
            </div>
          </div>
          
          {/* Botão fechar para mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-gray-500">✕</span>
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left
                  transition-all duration-200 font-medium
                  ${activeItem === item.id 
                    ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {activeItem === item.id && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@foodanalytics.com</p>
            </div>
            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
              <span className="text-gray-500">⚙️</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}