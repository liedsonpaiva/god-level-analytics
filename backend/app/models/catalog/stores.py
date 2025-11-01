from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, date
from decimal import Decimal

class Store(SQLModel, table=True):
    __tablename__ = "stores"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    brand_id: Optional[int] = Field(foreign_key="brands.id")  # ⬅️ CORRIGIDO
    sub_brand_id: Optional[int] = Field(foreign_key="sub_brands.id")  # ⬅️ CORRIGIDO
    name: str = Field(max_length=255)
    city: Optional[str] = Field(max_length=100, default=None)
    state: Optional[str] = Field(max_length=2, default=None)
    district: Optional[str] = Field(max_length=100, default=None)
    address_street: Optional[str] = Field(max_length=200, default=None)
    address_number: Optional[int] = Field(default=None)
    zipcode: Optional[str] = Field(max_length=10, default=None)
    latitude: Optional[Decimal] = Field(default=None, max_digits=9, decimal_places=6)
    longitude: Optional[Decimal] = Field(default=None, max_digits=9, decimal_places=6)
    is_active: bool = Field(default=True)
    is_own: bool = Field(default=False)
    is_holding: bool = Field(default=False)
    creation_date: Optional[date] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)

class Channel(SQLModel, table=True):
    __tablename__ = "channels"  # ⬅️ ADICIONADO
    
    id: Optional[int] = Field(default=None, primary_key=True)
    brand_id: Optional[int] = Field(foreign_key="brands.id")  # ⬅️ CORRIGIDO
    name: str = Field(max_length=100)
    description: Optional[str] = Field(max_length=255, default=None)
    type: str = Field(max_length=1)
    created_at: datetime = Field(default_factory=datetime.now)