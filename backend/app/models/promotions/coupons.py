from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal

class Coupon(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    brand_id: Optional[int] = Field(foreign_key="brand.id")
    code: str = Field(max_length=50)
    discount_type: Optional[str] = Field(max_length=1, default=None)  # 'p' percentage, 'f' fixed
    discount_value: Optional[Decimal] = Field(max_digits=10, decimal_places=2, default=None)
    is_active: bool = Field(default=True)
    valid_from: Optional[datetime] = Field(default=None)
    valid_until: Optional[datetime] = Field(default=None)

class CouponSale(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sale_id: Optional[int] = Field(foreign_key="sale.id")
    coupon_id: Optional[int] = Field(foreign_key="coupon.id")
    value: Optional[float] = Field(default=None)
    target: Optional[str] = Field(max_length=100, default=None)
    sponsorship: Optional[str] = Field(max_length=100, default=None)