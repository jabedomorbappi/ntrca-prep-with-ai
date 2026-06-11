import os
from .providers.gemini import GeminiProvider
from .providers.groq_provider import GroqProvider
from .providers.deepseek_provider import DeepSeekProvider
from .providers.huggingface_provider import HuggingFaceProvider

class MultiPlatformFallbackRouter:
    def __init__(self):
        self.providers = []
        
        # 🛡️ Safely check environment configurations and initialize layers.
        # This prevents the app from crashing if you are missing one specific platform key!
        if os.environ.get("GEMINI_API_KEY"):
            self.providers.append({"name": "Gemini Suite", "instance": GeminiProvider()})
        else:
            print("⚠️ [AI Router Config] GEMINI_API_KEY missing. Skipping...")

        if os.environ.get("GROQ_API_KEY"):
            self.providers.append({"name": "Groq Cloud (Llama)", "instance": GroqProvider()})
        else:
            print("⚠️ [AI Router Config] GROQ_API_KEY missing. Skipping...")

        if os.environ.get("DEEPSEEK_API_KEY"):
            self.providers.append({"name": "DeepSeek Core", "instance": DeepSeekProvider()})
        else:
            print("⚠️ [AI Router Config] DEEPSEEK_API_KEY missing. Skipping...")

        if os.environ.get("HF_TOKEN"):
            self.providers.append({"name": "Hugging Face Hub (Qwen)", "instance": HuggingFaceProvider()})
        else:
            print("⚠️ [AI Router Config] HF_TOKEN missing. Skipping...")

    def generate(self, prompt: str) -> str:
        if not self.providers:
            raise Exception("Critical: No AI Engine Keys found in environment variables.")

        last_error = None
        for provider in self.providers:
            print("\n-------------------------------------------------------------")
            print(f"🔄 [AI ROUTER] Initializing dispatch to: {provider['name']}")
            print("-------------------------------------------------------------")
            try:
                return provider["instance"].generate(prompt)
            except Exception as e:
                print(f"⚠️ [AI ROUTER] Fallback triggered! {provider['name']} broke. Moving down matrix...")
                last_error = e
                continue 
        
        print("\n💥 [AI ROUTER] CRITICAL: All platforms exhausted completely!")
        raise Exception(f"All integrated backup platforms exhausted. Final error: {str(last_error)}")

def get_provider():
    # Returns our custom cascading fallback wrapper
    return MultiPlatformFallbackRouter()