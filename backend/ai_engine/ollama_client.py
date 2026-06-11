import ollama


def generate_mcq(topic, subtopic, prompt_template):


    print("STEP 3: Sending prompt to Ollama")

    try:
        prompt = str(prompt_template)

        response = ollama.chat(
            model="llama3",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        content = response["message"]["content"]

        # 🔥 HARD CLEAN (THIS FIXES 0x8d ERROR)
        if isinstance(content, bytes):
            content = content.decode("utf-8", errors="ignore")

        content = content.encode("utf-8", errors="ignore").decode("utf-8")
        print("STEP 3.1: Ollama replied")
        return content

    except Exception as e:
        print("❌ OLLAMA ERROR:", repr(e))
        return None