import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export default function RevenuePieChart({ data }) {
  const totalRevenue = data.reduce((sum, item) => sum + (item.total_revenue || 0), 0);

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Faturamento por Canal</h3>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-gray-900">
          R$ {totalRevenue?.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
        </div>
        <div className="text-sm text-gray-500">Total</div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="total_revenue"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`R$ ${value?.toLocaleString('pt-BR')}`, 'Faturamento']}
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legenda detalhada */}
      <div className="mt-6 space-y-3">
        {data.map((channel, index) => {
          const percentage = totalRevenue > 0 ? (channel.total_revenue / totalRevenue * 100) : 0;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm font-medium text-gray-700">{channel.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  R$ {channel.total_revenue?.toLocaleString('pt-BR')}
                </div>
                <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}