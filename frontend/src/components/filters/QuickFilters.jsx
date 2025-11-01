import { useState } from 'react';

export default function QuickFilters({ filters, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const dateRanges = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 3 meses' },
    { value: '1y', label: 'Último ano' }
  ];

  const channels = [
    { value: 'all', label: 'Todos os Canais' },
    { value: 'ifood', label: 'iFood' },
    { value: 'rappi', label: 'Rappi' },
    { value: 'balcao', label: 'Balcão' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'app', label: 'App Próprio' }
  ];

  const handleFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Filtro de Data */}
          <select 
            value={filters.dateRange}
            onChange={(e) => handleFilter('dateRange', e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {dateRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          {/* Filtro de Canal */}
          <select 
            value={filters.channel}
            onChange={(e) => handleFilter('channel', e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {channels.map(channel => (
              <option key={channel.value} value={channel.value}>
                {channel.label}
              </option>
            ))}
          </select>

          {/* Botão Filtros Avançados */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
          >
            <span>⚙️ Filtros Avançados</span>
          </button>
        </div>

        {/* Botão Exportar */}
        <button className="bg-green-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-green-600 flex items-center space-x-2">
          <span>📊 Exportar Relatório</span>
        </button>
      </div>

      {/* Filtros Avançados */}
      {isOpen && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loja
              </label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                <option>Todas as Lojas</option>
                <option>Paulista</option>
                <option>Jardins</option>
                <option>Moema</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                <option>Todas Categorias</option>
                <option>Pizzas</option>
                <option>Bebidas</option>
                <option>Sobremesas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Mínimo
              </label>
              <input 
                type="number" 
                placeholder="R$ 0,00"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Método Pagamento
              </label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                <option>Todos</option>
                <option>Cartão</option>
                <option>Dinheiro</option>
                <option>PIX</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}