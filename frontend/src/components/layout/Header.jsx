export default function Header({ overview }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
            Food Analytics
          </h1>
          <p className="text-gray-600 mt-2">Insights em tempo real do seu negócio</p>
        </div>
        <div className="hidden lg:flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">Online</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 flex-wrap">
        <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Dados sincronizados
        </span>
        <span className="text-sm text-gray-500">
          {overview?.total_sales?.toLocaleString()} vendas analisadas
        </span>
        <span className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleTimeString('pt-BR')}
        </span>
      </div>
    </div>
  );
}