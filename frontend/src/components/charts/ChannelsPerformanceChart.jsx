import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';

export default function ChannelsPerformanceChart({ data }) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Performance por Canal</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#666' }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            tick={{ fill: '#666' }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={(value, name) => {
              if (name === 'Faturamento (R$)') {
                return [`R$ ${value?.toLocaleString('pt-BR')}`, name];
              }
              return [value, name];
            }}
          />
          <Legend />
          <Bar 
            dataKey="total_revenue" 
            fill="#0088FE" 
            name="Faturamento (R$)" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="sales_count" 
            fill="#00C49F" 
            name="Nº de Vendas" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legenda adicional */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
        {data.map((channel, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="font-medium text-gray-700">{channel.name}</span>
            <div className="text-right">
              <div className="text-green-600 font-semibold">
                R$ {channel.total_revenue?.toLocaleString('pt-BR')}
              </div>
              <div className="text-gray-500">{channel.sales_count} vendas</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}