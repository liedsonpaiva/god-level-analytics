import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';

export default function TimeAnalysis({ data }) {
  // Resolve: "Meu tempo de entrega piorou. Em quais dias/horários?"
  // Resolve: "Qual produto vende mais na quinta à noite no iFood?"

  const getInsight = (data) => {
    if (!data || data.length === 0) return null;
    
    const peakHour = data.reduce((max, item) => 
      item.total_revenue > max.total_revenue ? item : max
    );
    
    const worstDelivery = data.reduce((max, item) => 
      item.avg_delivery_time > max.avg_delivery_time ? item : max
    );

    return {
      peakHour: `⏰ Pico de vendas: ${peakHour.hour}h (R$ ${peakHour.total_revenue?.toLocaleString('pt-BR')})`,
      worstDelivery: `🚨 Maior tempo de entrega: ${worstDelivery.hour}h (${worstDelivery.avg_delivery_time}min)`,
      recommendation: `💡 Recomendação: Aumente equipe às ${worstDelivery.hour}h para melhorar entregas`
    };
  };

  const insight = getInsight(data);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Análise por Horário</h3>
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Insight</span>
      </div>
      
      {insight && (
        <div className="mb-4 space-y-2">
          <p className="text-sm text-green-600 font-medium">{insight.peakHour}</p>
          <p className="text-sm text-red-600 font-medium">{insight.worstDelivery}</p>
          <p className="text-sm text-blue-600">{insight.recommendation}</p>
        </div>
      )}

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="hour" tick={{ fill: '#666' }} />
          <YAxis tick={{ fill: '#666' }} />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'Faturamento') return [`R$ ${value?.toLocaleString('pt-BR')}`, name];
              if (name === 'Tempo Entrega') return [`${value}min`, name];
              return [value, name];
            }}
          />
          <Bar 
            dataKey="total_revenue" 
            fill="#0088FE" 
            name="Faturamento"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="avg_delivery_time" 
            fill="#FF8042" 
            name="Tempo Entrega"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-xs text-gray-500">
        💡 Dica: Compare horários de pico com tempo de entrega para otimizar sua operação
      </div>
    </Card>
  );
}