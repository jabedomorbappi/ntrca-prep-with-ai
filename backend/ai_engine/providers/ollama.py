import ollama


class OllamaProvider:

    def generate(self, prompt):

        response = ollama.chat(
            model="llama3",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return response["message"]["content"]