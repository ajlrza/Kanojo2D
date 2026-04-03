from openai import OpenAI
from groq import Groq
import os


client = Groq(
    api_key=os.environ.get("GF_KEY")
)


