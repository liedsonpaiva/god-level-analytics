import Card from '../ui/Card';

export default function CustomerInsights({ data }) {
  // Resolve: "Quais clientes compraram 3+ vezes mas não voltam há 30 dias?"
  
  if (!data) return null;

  const { 
    loyal_customers = [],
    at_risk_customers = [],
    repeat_rate,
    avg_customer_value 
  } = data;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Insights de Clientes</h3>
        <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">Retenção</span>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{repeat_rate}%</div>
          <div className="text-xs text-green-800">Taxa de Retorno</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            R$ {avg_customer_value?.toLocaleString('pt-BR')}
          </div>
          <div className="text-xs text-blue-800">Valor por Cliente</div>
        </div>
      </div>

      {/* Clientes em Risco */}
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Clientes em Risco ({at_risk_customers.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {at_risk_customers.slice(0, 5).map((customer, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span className="text-sm font-medium">{customer.name}</span>
                <div className="text-right">
                  <div className="text-xs text-red-600">
                    {customer.last_purchase_days} dias sem comprar
                  </div>
                  <div className="text-xs text-gray-500">
                    {customer.total_orders} compras • R$ {customer.total_spent}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {at_risk_customers.length > 5 && (
            <div className="text-xs text-gray-500 mt-1">
              + {at_risk_customers.length - 5} clientes em risco
            </div>
          )}
        </div>

        {/* Clientes Fiéis */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Clientes Fiéis ({loyal_customers.length})
          </h4>
          <div className="space-y-2">
            {loyal_customers.slice(0, 3).map((customer, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm font-medium">{customer.name}</span>
                <div className="text-right">
                  <div className="text-xs text-green-600">
                    {customer.total_orders} compras
                  </div>
                  <div className="text-xs text-gray-500">
                    R$ {customer.total_spent}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        💡 Ação: Entre em contato com clientes em risco para recuperá-los
      </div>
    </Card>
  );
}