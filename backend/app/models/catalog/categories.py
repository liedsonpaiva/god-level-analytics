from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Category(SQLModel, table=True):
    __tablename__ = "categories"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    brand_id: Optional[int] = Field(foreign_key="brands.id")  # ⬅️ CORRIGIDO
    sub_brand_id: Optional[int] = Field(foreign_key="sub_brands.id")  # ⬅️ CORRIGIDO
    name: str = Field(max_length=200)
    type: str = Field(max_length=1, default="P")
    pos_uuid: Optional[str] = Field(max_length=100, default=None)
    deleted_at: Optional[datetime] = Field(default=None)

class OptionGroup(SQLModel, table=True):
    __tablename__ = "option_groups"  # ⬅️ ADICIONADO
    
    id: Optional[int] = Field(default=None, primary_key=True)
    brand_id: Optional[int] = Field(foreign_key="brands.id")  # ⬅️ CORRIGIDO
    sub_brand_id: Optional[int] = Field(foreign_key="sub_brands.id")  # ⬅️ CORRIGIDO
    category_id: Optional[int] = Field(foreign_key="categories.id")  # ⬅️ CORRIGIDO
    name: str = Field(max_length=500)
    pos_uuid: Optional[str] = Field(max_length=100, default=None)
    deleted_at: Optional[datetime] = Field(default=None)