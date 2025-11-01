from fastapi import APIRouter
from .overview_routes import router as overview_router
from .sales_routes import router as sales_router
from .channels_routes import router as channels_router
from .products_routes import router as products_router
from .stores_routes import router as stores_router
from .customers_routes import router as customers_router
from .payments_routes import router as payments_router
from .deliveries_routes import router as deliveries_router

router = APIRouter()

router.include_router(overview_router)
router.include_router(sales_router)
router.include_router(channels_router)
router.include_router(products_router)
router.include_router(stores_router)
router.include_router(customers_router)
router.include_router(payments_router)
router.include_router(deliveries_router)
