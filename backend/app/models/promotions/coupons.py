from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal

class Coupon(SQLModel, table=True):
    __tablename__ = "coupons"  # ⬅️ CORRIGIDO: estava "cupons"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    brand_id: Optional[int] = Field(foreign_key="brands.id")  # ⬅️ CORRIGIDO: brands.id
    code: str = Field(max_length=50)
    discount_type: Optional[str] = Field(max_length=1, default=None)
    discount_value: Optional[Decimal] = Field(max_digits=10, decimal_places=2, default=None)
    is_active: bool = Field(default=True)
    valid_from: Optional[datetime] = Field(default=None)
    valid_until: Optional[datetime] = Field(default=None)

class CouponSale(SQLModel, table=True):
    __tablename__ = "coupon_sales"  # ⬅️ ADICIONADO
    
    id: Optional[int] = Field(default=None, primary_key=True)
    sale_id: Optional[int] = Field(foreign_key="sales.id")  # ⬅️ CORRIGIDO: sales.id
    coupon_id: Optional[int] = Field(foreign_key="coupons.id")  # ⬅️ CORRIGIDO: coupons.id
    value: Optional[float] = Field(default=None)
    target: Optional[str] = Field(max_length=100, default=None)
    sponsorship: Optional[str] = Field(max_length=100, default=None)