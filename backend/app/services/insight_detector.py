# app/services/insight_detector.py
from typing import Dict, List, Any
from datetime import datetime, timedelta

class InsightDetector:
    
    @staticmethod
    def detect_sales_insights(sales_data: List[Dict]) -> List[Dict]:
        """Detecta insights sobre vendas"""
        insights = []
        
        if not sales_data:
            return insights
        
        data = sales_data[0]
        
        # Insight sobre ticket médio
        if data.get('avg_ticket', 0) < 30:
            insights.append({
                'type': 'warning',
                'title': 'Ticket Médio Baixo',
                'message': f'Ticket médio de R$ {data["avg_ticket"]:.2f} está abaixo do ideal',
                'metric': 'avg_ticket',
                'value': data['avg_ticket']
            })
        
        return insights
    
    @staticmethod
    def detect_channel_insights(channel_data: List[Dict]) -> List[Dict]:
        """Detecta insights sobre canais de venda"""
        insights = []
        
        if len(channel_data) < 2:
            return insights
        
        # Encontra canal dominante
        top_channel = channel_data[0]
        if top_channel.get('percentage', 0) > 60:
            insights.append({
                'type': 'info',
                'title': 'Canal Dominante',
                'message': f'{top_channel["channel"]} representa {top_channel["percentage"]:.1f}% das vendas',
                'channel': top_channel['channel'],
                'percentage': top_channel['percentage']
            })
        
        return insights
    
    @staticmethod
    def detect_product_insights(product_data: List[Dict]) -> List[Dict]:
        """Detecta insights sobre produtos"""
        insights = []
        
        if not product_data:
            return insights
        
        # Produto mais vendido
        top_product = product_data[0]
        insights.append({
            'type': 'success',
            'title': 'Produto Mais Vendido',
            'message': f'{top_product.get("name", "Produto")}: {top_product.get("total_quantity", 0)} unidades',
            'product': top_product.get('name'),
            'quantity': top_product.get('total_quantity')
        })
        
        return insights
    
    @staticmethod
    def detect_delivery_insights(delivery_data: List[Dict]) -> List[Dict]:
        """Detecta insights sobre entregas"""
        insights = []
        
        if not delivery_data:
            return insights
        
        # Entrega mais lenta
        slowest_delivery = max(delivery_data, key=lambda x: x.get('avg_delivery_time_seconds', 0))
        if slowest_delivery.get('avg_delivery_time_seconds', 0) > 2700:  # 45 minutos
            insights.append({
                'type': 'warning',
                'title': 'Tempo de Entrega Alto',
                'message': f'{slowest_delivery["channel"]}: {slowest_delivery["avg_delivery_time_seconds"]/60:.0f}min em média',
                'channel': slowest_delivery['channel'],
                'delivery_time_minutes': slowest_delivery['avg_delivery_time_seconds'] / 60
            })
        
        return insights
    
    @staticmethod
    def detect_payment_insights(payment_data: List[Dict]) -> List[Dict]:
        """Detecta insights sobre pagamentos"""
        insights = []
        
        if not payment_data:
            return insights
        
        # Método de pagamento dominante
        top_method = payment_data[0]
        if top_method.get('percentage', 0) > 50:
            insights.append({
                'type': 'info',
                'title': 'Método de Pagamento Preferido',
                'message': f'{top_method["payment_method"]} é usado em {top_method["percentage"]:.1f}% dos pedidos',
                'payment_method': top_method['payment_method'],
                'percentage': top_method['percentage']
            })
        
        return insights