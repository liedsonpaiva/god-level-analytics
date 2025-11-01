from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.core.connect import get_db_connection_string
from sqlmodel import create_engine

router = APIRouter(tags=["Health Check"])

connection_string = get_db_connection_string()
engine = create_engine(connection_string)

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/health")
def health_check(session: Session = Depends(get_session)):
    try:
        result = session.exec("SELECT 1").first()
        return {"status": "healthy", "database": "connected", "result": result}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}
