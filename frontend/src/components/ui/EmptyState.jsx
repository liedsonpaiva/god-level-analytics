export function EmptyState({ 
  title = "Nenhum dado disponível", 
  message = "Não existem registros para o período selecionado",
  action = null 
}) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-6xl mb-4">📊</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  )
}