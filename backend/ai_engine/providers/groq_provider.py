import os
from groq import Groq
from .base import AIProvider

class GroqProvider(AIProvider):
    def __init__(self):
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY is missing from environment variables!")
        self.client = Groq(api_key=api_key)

    def generate(self, prompt: str) -> str:
        model_name = "grok-2" # or grok-beta / grok-4.3
        try:
            print(f"📡 [xAI Grok] Attempting connection via model: {model_name}...")
            completion = self.client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": prompt}]
            )
            print(f"✅ [xAI Grok] Success using model: {model_name}!")
            return completion.choices[0].message.content
        except Exception as e:
            print(f"❌ [xAI Grok] FAILURE on model '{model_name}': {str(e)}")
            raise e