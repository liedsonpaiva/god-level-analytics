from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal

class Sale(SQLModel, table=True):
    __tablename__ = "sales"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    store_id: int = Field(foreign_key="stores.id")  # ⬅️ CORRIGIDO
    sub_brand_id: Optional[int] = Field(foreign_key="sub_brands.id")  # ⬅️ CORRIGIDO
    customer_id: Optional[int] = Field(foreign_key="customers.id")  # ⬅️ CORRIGIDO
    channel_id: int = Field(foreign_key="channels.id")  # ⬅️ CORRIGIDO
    
    cod_sale1: Optional[str] = Field(max_length=100, default=None)
    cod_sale2: Optional[str] = Field(max_length=100, default=None)
    created_at: datetime
    customer_name: Optional[str] = Field(max_length=100, default=None)
    sale_status_desc: str = Field(max_length=100)
    
    total_amount_items: Decimal = Field(max_digits=10, decimal_places=2)
    total_discount: Decimal = Field(default=0, max_digits=10, decimal_places=2)
    total_increase: Decimal = Field(default=0, max_digits=10, decimal_places=2)
    delivery_fee: Decimal = Field(default=0, max_digits=10, decimal_places=2)
    service_tax_fee: Decimal = Field(default=0, max_digits=10, decimal_places=2)
    total_amount: Decimal = Field(max_digits=10, decimal_places=2)
    value_paid: Decimal = Field(default=0, max_digits=10, decimal_places=2)
    
    production_seconds: Optional[int] = Field(default=None)
    delivery_seconds: Optional[int] = Field(default=None)
    people_quantity: Optional[int] = Field(default=None)
    
    discount_reason: Optional[str] = Field(max_length=300, default=None)
    increase_reason: Optional[str] = Field(max_length=300, default=None)
    origin: str = Field(default="POS", max_length=100)

class ProductSale(SQLModel, table=True):
    __tablename__ = "product_sales"  # ⬅️ ADICIONADO
    
    id: Optional[int] = Field(default=None, primary_key=True)
    sale_id: int = Field(foreign_key="sales.id")  # ⬅️ CORRIGIDO
    product_id: int = Field(foreign_key="products.id")  # ⬅️ CORRIGIDO
    quantity: float
    base_price: float
    total_price: float
    observations: Optional[str] = Field(max_length=300, default=None)

class ItemProductSale(SQLModel, table=True):
    __tablename__ = "item_product_sales"  # ⬅️ ADICIONADO
    
    id: Optional[int] = Field(default=None, primary_key=True)
    product_sale_id: int = Field(foreign_key="product_sales.id")  # ⬅️ CORRIGIDO
    item_id: int = Field(foreign_key="items.id")  # ⬅️ CORRIGIDO
    option_group_id: Optional[int] = Field(foreign_key="option_groups.id")  # ⬅️ CORRIGIDO
    quantity: float
    additional_price: float
    price: float
    amount: float = Field(default=1)
    observations: Optional[str] = Field(max_length=300, default=None)

class ItemItemProductSale(SQLModel, table=True):
    __tablename__ = "item_item_product_sales"  # ⬅️ ADICIONADO
    
    id: Optional[int] = Field(default=None, primary_key=True)
    item_product_sale_id: int = Field(foreign_key="item_product_sales.id")  # ⬅️ CORRIGIDO
    item_id: int = Field(foreign_key="items.id")  # ⬅️ CORRIGIDO
    option_group_id: Optional[int] = Field(foreign_key="option_groups.id")  # ⬅️ CORRIGIDO
    quantity: float
    additional_price: float
    price: float
    amount: float = Field(default=1)