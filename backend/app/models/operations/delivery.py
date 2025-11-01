from sqlmodel import SQLModel, Field
from typing import Optional

class DeliverySale(SQLModel, table=True):
    __tablename__ = "delivery_sales"  # ⬅️ CORRIGIDO: estava "deleviry_sales"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    sale_id: int = Field(foreign_key="sales.id")  # ⬅️ CORRIGIDO: sales.id
    courier_id: Optional[str] = Field(max_length=100, default=None)
    courier_name: Optional[str] = Field(max_length=100, default=None)
    courier_phone: Optional[str] = Field(max_length=100, default=None)
    courier_type: Optional[str] = Field(max_length=100, default=None)
    delivered_by: Optional[str] = Field(max_length=100, default=None)
    delivery_type: Optional[str] = Field(max_length=100, default=None)
    status: Optional[str] = Field(max_length=100, default=None)
    delivery_fee: Optional[float] = Field(default=None)
    courier_fee: Optional[float] = Field(default=None)
    timing: Optional[str] = Field(max_length=100, default=None)
    mode: Optional[str] = Field(max_length=100, default=None)

class DeliveryAddress(SQLModel, table=True):
    __tablename__ = "delivery_addresses"  # ⬅️ ADICIONADO
    
    id: Optional[int] = Field(default=None, primary_key=True)
    sale_id: int = Field(foreign_key="sales.id")  # ⬅️ CORRIGIDO: sales.id
    delivery_sale_id: Optional[int] = Field(foreign_key="delivery_sales.id")  # ⬅️ CORRIGIDO
    street: Optional[str] = Field(max_length=200, default=None)
    number: Optional[str] = Field(max_length=20, default=None)
    complement: Optional[str] = Field(max_length=200, default=None)
    formatted_address: Optional[str] = Field(max_length=500, default=None)
    neighborhood: Optional[str] = Field(max_length=100, default=None)
    city: Optional[str] = Field(max_length=100, default=None)
    state: Optional[str] = Field(max_length=50, default=None)
    country: Optional[str] = Field(max_length=100, default=None)
    postal_code: Optional[str] = Field(max_length=20, default=None)
    reference: Optional[str] = Field(max_length=300, default=None)
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)