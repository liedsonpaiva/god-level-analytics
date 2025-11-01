from fastapi import APIRouter
from app.api.analytics.overview_routes import router as overview_router
from app.api.analytics.sales_routes import router as sales_router
from app.api.analytics.channels_routes import router as channels_router
from app.api.analytics.products_routes import router as products_router
from app.api.analytics.stores_routes import router as stores_router
from app.api.analytics.customers_routes import router as customers_router
from app.api.analytics.payments_routes import router as payments_router
from app.api.analytics.deliveries_routes import router as deliveries_router
from app.api.analytics.categories_routes import router as categories_router

router = APIRouter()

router.include_router(overview_router)
router.include_router(sales_router)
router.include_router(channels_router)
router.include_router(products_router)
router.include_router(stores_router)
router.include_router(customers_router)
router.include_router(payments_router)
router.include_router(deliveries_router)
router.include_router(categories_router)

