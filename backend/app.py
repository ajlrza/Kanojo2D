from openai import OpenAI
from groq import Groq
import os


client = Groq(
    api_key=os.environ.get("GF_KEY"),
    base_url="https://api.groq.com/openai/v1",
)

user_input = ""

response = client.responses.create(
    input=user_input,
    model="openai/gpt-oss-20b"
)

response_output = response.output_text