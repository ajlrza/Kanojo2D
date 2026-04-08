from fastapi import FastAPI, Request
import app_main

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/talk")
async def read_message(request: Request, message: str):
    request_body = await request.json()
    
    if (request_body):
        return app_main.app_function("User")