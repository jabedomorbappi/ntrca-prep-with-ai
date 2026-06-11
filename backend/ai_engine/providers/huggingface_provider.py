import os
from huggingface_hub import InferenceClient
from .base import AIProvider

class HuggingFaceProvider(AIProvider):
    def __init__(self):
        token = os.environ.get("HF_TOKEN")
        if not token:
            raise ValueError("HF_TOKEN is missing from environment variables!")
        self.client = InferenceClient(api_key=token)

    def generate(self, prompt: str) -> str:
        # ⚡ Adding ':fastest' lets Hugging Face auto-route to the best free serverless hardware block
        response = self.client.chat.completions.create(
            model="Qwen/Qwen2.5-72B-Instruct:fastest",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2048
        )
        return response.choices[0].message.content