from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Brand(SQLModel, table=True):
    __tablename__ = "brands"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.now)

class SubBrand(SQLModel, table=True):
    __tablename__ = "sub_brands"  # ⬅️ CORRIGIDO: estava vazio
    
    id: Optional[int] = Field(default=None, primary_key=True)
    brand_id: int = Field(foreign_key="brands.id")  # ⬅️ CORRIGIDO: brands.id
    name: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.now)