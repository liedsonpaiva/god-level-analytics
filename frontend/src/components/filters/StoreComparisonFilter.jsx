import React, { useState } from 'react'
import { useStore } from '../../contexts/StoreContext.jsx'

export function StoreComparisonFilter() {
  const {
    selectedStores,
    allStores,
    toggleStoreSelection,
    clearSelectedStores,
    selectStoresByRegion,
    loading,
    error
  } = useStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [groupBy, setGroupBy] = useState('all')

  const groupedStores = allStores.reduce((acc, store) => {
    const key = groupBy === 'city' ? store.city : 
                groupBy === 'state' ? store.state : 'all'
    
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(store)
    return acc
  }, {})

  const filteredStores = allStores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.state.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded mb-3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Comparar Lojas
          </h3>
          <p className="text-sm text-gray-600">
            {selectedStores.length} de 5 lojas selecionadas
          </p>
        </div>
        
        {selectedStores.length > 0 && (
          <button
            onClick={clearSelectedStores}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Limpar seleção
          </button>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Buscar loja, cidade ou estado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <div className="flex space-x-2">
          <button
            onClick={() => setGroupBy('all')}
            className={`px-3 py-1 text-sm rounded ${
              groupBy === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setGroupBy('city')}
            className={`px-3 py-1 text-sm rounded ${
              groupBy === 'city' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Por Cidade
          </button>
          <button
            onClick={() => setGroupBy('state')}
            className={`px-3 py-1 text-sm rounded ${
              groupBy === 'state' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Por Estado
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto space-y-2">
        {groupBy === 'all' ? (
          filteredStores.map(store => (
            <StoreCheckbox
              key={store.id}
              store={store}
              isSelected={selectedStores.includes(store.id)}
              onToggle={() => toggleStoreSelection(store.id)}
            />
          ))
        ) : (
          Object.entries(groupedStores).map(([group, stores]) => (
            <div key={group} className="border rounded-lg">
              <div className="bg-gray-50 px-3 py-2 border-b">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm text-gray-700">
                    {group === 'all' ? 'Todas as Lojas' : group}
                  </span>
                  <button
                    onClick={() => groupBy === 'city' && selectStoresByRegion(group)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Selecionar todas
                  </button>
                </div>
              </div>
              <div className="p-2 space-y-1">
                {stores.map(store => (
                  <StoreCheckbox
                    key={store.id}
                    store={store}
                    isSelected={selectedStores.includes(store.id)}
                    onToggle={() => toggleStoreSelection(store.id)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {filteredStores.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          Nenhuma loja encontrada
        </div>
      )}
    </div>
  )
}

function StoreCheckbox({ store, isSelected, onToggle }) {
  return (
    <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium text-gray-900 truncate">
            {store.name}
          </span>
          {isSelected && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              Selecionada
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {store.city} - {store.state}
          {store.sub_brand && ` • ${store.sub_brand}`}
        </div>
      </div>
    </label>
  )
}