import json
import re

def clean_text(text):
    return text.encode("utf-8", errors="ignore").decode("utf-8")

def safe_text(text):
    return str(text).encode("utf-8", errors="ignore").decode("utf-8")
import json
import re

def extract_json(text):
    try:
        return json.loads(text)
    except:
        pass

    # fallback: extract JSON array manually
    match = re.search(r"\[.*\]", text, re.DOTALL)

    if match:
        try:
            return json.loads(match.group())
        except:
            return None

    return None