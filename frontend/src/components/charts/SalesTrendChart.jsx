import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';

export default function SalesTrendChart({ data }) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Tendência de Vendas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
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
                return [`R$ ${value.toLocaleString('pt-BR')}`, name];
              }
              return [value, name];
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="daily_revenue" 
            stroke="#0088FE" 
            name="Faturamento (R$)" 
            strokeWidth={3}
            dot={{ fill: '#0088FE', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#0088FE' }}
          />
          <Line 
            type="monotone" 
            dataKey="sales_count" 
            stroke="#00C49F" 
            name="Vendas" 
            strokeWidth={3}
            dot={{ fill: '#00C49F', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#00C49F' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}