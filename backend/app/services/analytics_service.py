# backend/app/services/analytics_service.py
from app.repositories.analytics_repository import (
    get_overview, get_sales_trend, get_channels_performance, get_products_insights
)

def overview(session):
    data = get_overview(session)
    return {
        "total_sales": data[0] or 0,
        "total_revenue": float(data[1] or 0),
        "avg_ticket": float(data[2] or 0),
        "unique_customers": data[3] or 0
    }

def sales_trend(session):
    rows = get_sales_trend(session)
    return [{"date": r[0].strftime("%Y-%m-%d"), "sales_count": r[1], "daily_revenue": float(r[2] or 0)} for r in rows]

def channels_performance(session):
    rows = get_channels_performance(session)
    return [{
        "name": r[0],
        "type": r[1],
        "sales_count": r[2],
        "total_revenue": float(r[3] or 0),
        "avg_ticket": float(r[4] or 0)
    } for r in rows]

def products_insights(session):
    rows = get_products_insights(session)
    return [{
        "name": r[0],
        "times_sold": r[1],
        "total_quantity": r[2],
        "total_revenue": float(r[3] or 0),
        "customization_rate": f"{(r[4]/r[1]*100 if r[1] > 0 else 0):.1f}%"
    } for r in rows]
