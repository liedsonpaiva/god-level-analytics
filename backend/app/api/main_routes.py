from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def root():
    return {"message": "🚀 API Online! OdLevel Analytics está rodando."}
