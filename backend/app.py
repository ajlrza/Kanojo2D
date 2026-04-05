from openai import OpenAI
from groq import Groq
import os
import os
import sys_prompt
import classes
from dotenv import load_dotenv


load_dotenv() 

client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)

client_limits = {
    "RPM": 30,
    "RPD": 14400,
    "TPM": 6000
}

user = input("Enter your username")

app_session = classes.appManager(user, True)

while (app_session.monitorApp("User") == user and app_session.monitorApp("State") == True):

    user_input = input("Enter your message...\n")

    if (user_input == "Quit"):
        app_session.stopApp()

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": user_input,
                "role": "system",
                "content": sys_prompt.kurisu_personality_prompt("Lore"),
                "role": "system",
                "content": sys_prompt.kurisu_personality_prompt("Personality")
            }
        ],
        model="llama-3.3-70b-versatile",
    )

    client_usage_monitor = {
        "Completion Time": chat_completion.usage.completion_time,
        "Tokens Used": chat_completion.usage.completion_tokens,
        "Completion Details": chat_completion.usage.completion_tokens_details
    }

    if (client_usage_monitor["Tokens Used"] <= 12000):
        print(f"Your tokens is about to exceed: {client_limits["TPM"]} tokens per minute")

    print(chat_completion.choices[0].message.content)
