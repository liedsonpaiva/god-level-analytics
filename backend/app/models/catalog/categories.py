from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    brand_id: Optional[int] = Field(foreign_key="brand.id")
    sub_brand_id: Optional[int] = Field(foreign_key="subbrand.id")
    name: str = Field(max_length=200)
    type: str = Field(max_length=1, default="P")  # P=Produto, I=Item
    pos_uuid: Optional[str] = Field(max_length=100, default=None)
    deleted_at: Optional[datetime] = Field(default=None)

class OptionGroup(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    brand_id: Optional[int] = Field(foreign_key="brand.id")
    sub_brand_id: Optional[int] = Field(foreign_key="subbrand.id")
    category_id: Optional[int] = Field(foreign_key="category.id")
    name: str = Field(max_length=500)
    pos_uuid: Optional[str] = Field(max_length=100, default=None)
    deleted_at: Optional[datetime] = Field(default=None)