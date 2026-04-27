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

def app_function(user):

    app_session = classes.appManager(user, True)

    while (app_session.monitorApp("User") == user and app_session.monitorApp("State") == True):
        tokens_used = 0

    user_input = input("Enter your message...\n")

    if (user_input == "Quit"):
        app_session.stopApp()

    if (user_input != "Quit"):
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

        tokens_used += client_usage_monitor["Tokens Used"]

        if (tokens_used > 3000 and tokens_used < 6000 ):
            print(f"Your tokens is about to exceed: 6000 tokens per minute")
            print(tokens_used)

        print(chat_completion.choices[0].message.content)
        
