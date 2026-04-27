from fastapi import FastAPI, Request
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app_main import app_function

origins = [
    "https://digital-sanctuary-kappa.vercel.app",  # Common for React/Vue
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Or ["*"] for public APIs         # Support cookies and auth headers
    allow_methods=["*"],              # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],              # Allow all headers
)

@app.post("/")
def read_root():
    test = app_function("test")
    return {"Response": test}

@app.post("/talk")
async def read_message(request: Request, message: str):
    request_body = await request.json()
    
    if (request_body):
        pass
