# backend/app/api/routes/overview.py - ATUALIZADO

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
from ...core.database import get_db
from ...services.analytics_service import AnalyticsService

router = APIRouter()

# ❌ REMOVER/COMENTAR esta rota - já existe em analytics.py
# @router.get("/overview")
# async def get_overview_kpis(
#     days: int = Query(30, ge=1, le=365),
#     db: Session = Depends(get_db)
# ):
#     """
#     Retorna KPIs gerais para o dashboard
#     """
#     try:
#         end_date = datetime.now()
#         start_date = end_date - timedelta(days=days)
        
#         service = AnalyticsService(db)
#         kpis = service.get_overview_kpis(start_date, end_date)
        
#         return kpis
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Erro ao carregar KPIs: {str(e)}")

@router.get("/top-channels")
async def get_top_channels(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    """
    Retorna performance por canal de venda
    """
    try:
        start_dt = datetime.fromisoformat(start_date)
        end_dt = datetime.fromisoformat(end_date)
        
        service = AnalyticsService(db)
        channels_data = service.get_channel_performance(start_dt, end_dt)
        insights = service.generate_channel_insights(channels_data)
        
        return {
            "data": channels_data,
            "insights": insights
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao carregar canais: {str(e)}")

@router.get("/total-sales")
async def get_total_sales(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    """
    Retorna totais de vendas para o período
    """
    try:
        start_dt = datetime.fromisoformat(start_date)
        end_dt = datetime.fromisoformat(end_date)
        
        service = AnalyticsService(db)
        sales_data = service.get_sales_totals(start_dt, end_dt)
        
        return {
            "data": sales_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao carregar vendas: {str(e)}")