from fastapi import FastAPI, Request
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "https://digital-sanctuary-kappa.vercel.app/",  # Common for React/Vue
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Or ["*"] for public APIs
    allow_credentials=True,           # Support cookies and auth headers
    allow_methods=["*"],              # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],              # Allow all headers
)


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/talk")
async def read_message(request: Request, message: str):
    request_body = await request.json()
    
    if (request_body):
        pass
