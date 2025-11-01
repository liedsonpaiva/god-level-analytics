from sqlmodel import SQLModel, Field
from typing import Optional
from decimal import Decimal

class PaymentType(SQLModel, table=True):
    __tablename__ = "payment_types"  # ⬅️ CORRIGIDO: estava "payments"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    brand_id: Optional[int] = Field(foreign_key="brands.id")  # ⬅️ CORRIGIDO: brands.id
    description: str = Field(max_length=100)

class Payment(SQLModel, table=True):
    __tablename__ = "payments"  # ⬅️ ADICIONADO
    
    id: Optional[int] = Field(default=None, primary_key=True)
    sale_id: int = Field(foreign_key="sales.id")  # ⬅️ CORRIGIDO: sales.id
    payment_type_id: Optional[int] = Field(foreign_key="payment_types.id")  # ⬅️ CORRIGIDO
    value: Decimal = Field(max_digits=10, decimal_places=2)
    is_online: bool = Field(default=False)
    description: Optional[str] = Field(max_length=100, default=None)
    currency: str = Field(default="BRL", max_length=10)