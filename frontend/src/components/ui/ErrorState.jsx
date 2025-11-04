export function ErrorState({ message, onRetry = null }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Erro ao Carregar Dados</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          >
            Tentar Novamente
          </button>
        )}
        <div className="mt-4 text-sm text-gray-500">
          O banco possui dados de aproximadamente 6 meses
        </div>
      </div>
    </div>
  )
}