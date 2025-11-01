import Card from '../ui/Card';

export default function ProductPerformance({ products, filters }) {
  // Resolve: "Quais produtos têm menor margem e devo repensar o preço?"
  // Resolve: "Qual produto vende mais em cada canal?"

  const getProductInsights = (products) => {
    if (!products || products.length === 0) return null;

    const topProduct = products[0];
    const worstMarginProduct = products.reduce((min, product) => 
      product.profit_margin < min.profit_margin ? product : min
    );

    return {
      topProduct: `🏆 Top venda: ${topProduct.name} (${topProduct.times_sold} unidades)`,
      marginAlert: `⚠️ Atenção: ${worstMarginProduct.name} tem margem de ${worstMarginProduct.profit_margin}%`,
      recommendation: `💰 Sugestão: Reveja preço de ${worstMarginProduct.name} para melhorar margem`
    };
  };

  const insights = getProductInsights(products);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Performance de Produtos
          {filters.channel !== 'all' && ` - ${filters.channel}`}
        </h3>
        <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">Margem</span>
      </div>

      {insights && (
        <div className="mb-4 space-y-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm font-medium text-green-600">{insights.topProduct}</p>
          <p className="text-sm font-medium text-red-600">{insights.marginAlert}</p>
          <p className="text-sm text-blue-600">{insights.recommendation}</p>
        </div>
      )}

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {products.map((product, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${index === 0 ? 'bg-yellow-500 text-white' : 
                  index === 1 ? 'bg-gray-400 text-white' : 
                  index === 2 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'}`}
              >
                {index + 1}
              </span>
              <div>
                <div className="font-medium text-gray-800">{product.name}</div>
                <div className="text-xs text-gray-500">
                  {product.category} • {product.times_sold} vendas
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                R$ {product.total_revenue?.toLocaleString('pt-BR')}
              </div>
              <div className={`text-xs font-medium ${
                product.profit_margin > 20 ? 'text-green-600' : 
                product.profit_margin > 10 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                Margem: {product.profit_margin}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        💡 Foco: Produtos com margem abaixo de 15% precisam de atenção
      </div>
    </Card>
  );
}