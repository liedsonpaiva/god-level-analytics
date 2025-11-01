export default function ErrorState({ error, onRetry }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Erro ao Carregar</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="text-sm text-gray-500 mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium mb-2">Para resolver:</p>
          <code className="block bg-gray-100 p-3 rounded text-xs font-mono">
            cd backend && uvicorn app.main:app --reload --port 8000
          </code>
        </div>
        <button 
          onClick={onRetry}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
        >
          ↻ Tentar Novamente
        </button>
      </div>
    </div>
  );
}