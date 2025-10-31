from fastapi import FastAPI

app = FastAPI(title="Food Analytics API")

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

