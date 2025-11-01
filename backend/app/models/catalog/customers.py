from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, date

class Customer(SQLModel, table=True):
    __tablename__ = "customers"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_name: Optional[str] = Field(max_length=100, default=None)
    email: Optional[str] = Field(max_length=100, default=None)
    phone_number: Optional[str] = Field(max_length=50, default=None)
    cpf: Optional[str] = Field(max_length=100, default=None)
    birth_date: Optional[date] = Field(default=None)
    gender: Optional[str] = Field(max_length=10, default=None)
    store_id: Optional[int] = Field(foreign_key="stores.id")  # ⬅️ CORRIGIDO
    sub_brand_id: Optional[int] = Field(foreign_key="sub_brands.id")  # ⬅️ CORRIGIDO
    registration_origin: Optional[str] = Field(max_length=20, default=None)
    agree_terms: bool = Field(default=False)
    receive_promotions_email: bool = Field(default=False)
    receive_promotions_sms: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)