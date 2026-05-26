from fastapi import FastAPI, Request
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import app_main
import json

origins = [
    "https://digital-sanctuary-kappa.vercel.app", 
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            
    allow_methods=["*"],             
    allow_headers=["*"],             
)

@app.post("/chatKurisu")
async def read_request(request: Request):

    body = await request.json()
    
    User = body.get("User")
    Message = body.get("Message")

    api_response = app_main.appProxy(User, Message)
    return api_response['Response']

@app.post("/saveMessage")
async def read_request(request: Request):
    
    body = await request.json()

    UserID = body.get("userID")
    Message = body.get("message")
    Date = body.get("messageDate")

    with open("python_javascript_bridge.json", "w") as File:
        json.dump(Message, File)

@app.post("/loadMessage")
async def read_request(request: Request):

    body = await request.json()

    UserID = body.get("userID")

    with open("python_javascript_bridge.json", "w") as File:
        json.dump(UserID, File)

@app.post("/loadConversationHistory")
async def read_request(request: Request):

    body = await request.json()

    UserID = body.get("userID")

    with open("python_javascript_bridge.json", "w") as File:
        json.dump(UserID)

@app.post("/testChat")
async def read_request(request: Request):

    body = await request.json()

    requestReq = body.get("Test")
    return requestReq
