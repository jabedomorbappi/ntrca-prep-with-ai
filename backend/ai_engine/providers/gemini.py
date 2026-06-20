import os
from google import genai
from .base import AIProvider

class GeminiProvider(AIProvider):
    def __init__(self):
        # Always fetch from environment
        self.api_key = os.environ.get("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is missing from environment variables!")
        self.client = genai.Client(api_key=self.api_key)

    def generate(self, prompt: str) -> str:
        # models_to_try = ["gemini-2.5-flash", "gemini-1.5-pro"]
        models_to_try = ["gemini-2.5-flash-lite", "gemini-flash-latest"]
        
        for model_name in models_to_try:
            try:
                response = self.client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )
                return response.text
            except Exception as e:
                # If it's an Auth error, don't bother trying other models; fail immediately
                if "401" in str(e) or "403" in str(e):
                    print(f"🛑 [Gemini Suite] Fatal Auth error: {e}")
                    raise e
                
                print(f"⚠️ [Gemini Suite] Model '{model_name}' failed, trying next... Error: {e}")
                continue 
        
        raise Exception("All Gemini models failed to generate content.")