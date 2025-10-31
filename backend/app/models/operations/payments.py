from sqlmodel import SQLModel, Field
from typing import Optional
from decimal import Decimal

class PaymentType(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    brand_id: Optional[int] = Field(foreign_key="brand.id")
    description: str = Field(max_length=100)

class Payment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sale_id: int = Field(foreign_key="sale.id")
    payment_type_id: Optional[int] = Field(foreign_key="paymenttype.id")
    value: Decimal = Field(max_digits=10, decimal_places=2)
    is_online: bool = Field(default=False)
    description: Optional[str] = Field(max_length=100, default=None)
    currency: str = Field(default="BRL", max_length=10)