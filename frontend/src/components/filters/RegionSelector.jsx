import React from 'react'
import { useStore } from '../../contexts/StoreContext.jsx'

export function RegionSelector() {
  const { allStores, selectStoresByRegion, selectedStores } = useStore()

  const cities = [...new Set(allStores.map(store => store.city))].sort()
  
  const states = [...new Set(allStores.map(store => store.state))].sort()

  const storesByCity = allStores.reduce((acc, store) => {
    acc[store.city] = (acc[store.city] || 0) + 1
    return acc
  }, {})

  const storesByState = allStores.reduce((acc, store) => {
    acc[store.state] = (acc[store.state] || 0) + 1
    return acc
  }, {})

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Seleção por Região
      </h3>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Cidades</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => selectStoresByRegion(city)}
              className="flex justify-between items-center p-3 text-left border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">{city}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {storesByCity[city]} lojas
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Estados</h4>
        <div className="flex flex-wrap gap-2">
          {states.map(state => (
            <button
              key={state}
              onClick={() => {
                const stateStores = allStores
                  .filter(store => store.state === state)
                  .map(store => store.id)
              }}
              className="flex items-center space-x-2 px-3 py-2 border rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">{state}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {storesByState[state]} lojas
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedStores.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-700">
            <strong>{selectedStores.length} lojas</strong> selecionadas para comparação
          </div>
        </div>
      )}
    </div>
  )
}