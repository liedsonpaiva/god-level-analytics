import Card from '../ui/Card';

export default function TopProductsList({ products }) {
  const getRankColor = (index) => {
    const colors = [
      'bg-yellow-500', // 1st
      'bg-gray-400',   // 2nd
      'bg-orange-600', // 3rd
      'bg-blue-500',   // 4th
      'bg-green-500'   // 5th
    ];
    return colors[index] || 'bg-gray-300';
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Top Produtos</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {products.map((product, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 group border border-transparent hover:border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <span className={`w-8 h-8 ${getRankColor(index)} text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm`}>
                {index + 1}
              </span>
              <div>
                <span className="font-medium text-gray-800 group-hover:text-gray-900">
                  {product.name}
                </span>
                <div className="text-sm text-gray-500 mt-1">
                  {product.times_sold} vendas • {product.customization_rate || '0%'} customizações
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-gray-900">
                R$ {product.total_revenue?.toLocaleString('pt-BR')}
              </div>
              <div className="text-sm text-green-600 font-medium">
                +{(product.times_sold / 10).toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}