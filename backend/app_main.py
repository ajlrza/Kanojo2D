from openai import OpenAI
from groq import Groq
import os
import os
from . import sys_prompt
from . import classes
from dotenv import load_dotenv

load_dotenv() 

client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)

def appProxy(user: str, message: str):
    groq_app = classes.appManager(user)
    talk_to_groq = groq_app.chatGroq(client, user, sys_prompt.kurisu_personality_prompt("Lore"), sys_prompt.kurisu_personality_prompt("Personality"), message)
    return talk_to_groq

        
