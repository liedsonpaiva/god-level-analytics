import Card from '../ui/Card';

const kpiConfig = {
  total_sales: {
    title: "Total de Vendas",
    border: "border-l-blue-500",
    gradient: "from-blue-500 to-blue-600",
    icon: "📊"
  },
  total_revenue: {
    title: "Faturamento Total",
    border: "border-l-green-500",
    gradient: "from-green-500 to-green-600",
    icon: "💰"
  },
  avg_ticket: {
    title: "Ticket Médio",
    border: "border-l-purple-500",
    gradient: "from-purple-500 to-purple-600",
    icon: "🎫"
  },
  unique_customers: {
    title: "Clientes Únicos",
    border: "border-l-orange-500",
    gradient: "from-orange-500 to-orange-600",
    icon: "👥"
  }
};

export default function KpiCards({ overview }) {
  const kpis = [
    { key: 'total_sales', value: overview?.total_sales, format: (v) => v?.toLocaleString() },
    { key: 'total_revenue', value: overview?.total_revenue, format: (v) => `R$ ${v?.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}` },
    { key: 'avg_ticket', value: overview?.avg_ticket, format: (v) => `R$ ${v?.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}` },
    { key: 'unique_customers', value: overview?.unique_customers, format: (v) => v?.toLocaleString() }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map(({ key, value, format }) => (
        <Card key={key} className={`p-6 border-l-4 ${kpiConfig[key].border} hover:scale-105 transition-transform duration-200`}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-700">{kpiConfig[key].title}</h3>
            <span className="text-2xl">{kpiConfig[key].icon}</span>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent bg-gradient-to-r text-gray-900 mb-2">
            {format(value)}
          </p>
          <p className="text-sm text-gray-500">últimos 30 dias</p>
        </Card>
      ))}
    </div>
  );
}