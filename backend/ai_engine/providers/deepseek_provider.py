import os
import traceback
from openai import OpenAI
from .base import AIProvider

class DeepSeekProvider(AIProvider):
    def __init__(self):
        api_key = os.environ.get("DEEPSEEK_API_KEY")
        if not api_key:
            raise ValueError("DEEPSEEK_API_KEY is missing from environment variables!")
            
        # ✅ FIX: Update base_url to exclude '/v1' to prevent path duplication errors
        self.client = OpenAI(
            api_key=api_key, 
            base_url="https://api.deepseek.com"
        )

    def generate(self, prompt: str) -> str:
        # ✅ FIX: Use the faster, updated, and highly optimized flash model
        model_name = "deepseek-v4-flash"
        
        try:
            print(f"📡 [DeepSeek API] Attempting connection via model: {model_name}...")
            completion = self.client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": prompt}]
            )
            print(f"✅ [DeepSeek API] Success using model: {model_name}!")
            return completion.choices[0].message.content
            
        except Exception as e:
            # ✅ FIX: Catch and print the exact error string and traceback so it's not silent!
            print(f"❌ [DeepSeek API] CRITICAL ERROR on model '{model_name}': {str(e)}")
            print("--- DEEPSEEK EXCEPTION TRACEBACK ---")
            traceback.print_exc()
            print("-------------------------------------")
            raise e