from .router import get_provider


# ----------------------------
# MAIN GENERATOR ENTRY
# ----------------------------
def generate_mcqs(topic, subtopic, num_questions, difficulty):

    provider = get_provider()

    prompt = build_prompt(topic, subtopic, num_questions, difficulty)

    return provider.generate(prompt)


# ----------------------------
# PROMPT BUILDER
# ----------------------------
def build_prompt(topic, subtopic, num_questions, difficulty):

    return f"""
You are an expert ICT teacher.

Generate MCQs based on:

Topic: {topic}
Subtopic: {subtopic}
Difficulty: {difficulty}
Number of Questions: {num_questions}

IMPORTANT RULES:
- Return ONLY valid JSON array
- No markdown
- No explanation text
- No extra words
- Questions must be English + Bangla mixed

FORMAT:

[
  {{
    "question": "What is DBMS (ডেটাবেজ ম্যানেজমেন্ট সিস্টেম কী?)",
    "options": [
      "Option A (বাংলা + English)",
      "Option B (বাংলা + English)",
      "Option C (বাংলা + English)",
      "Option D (বাংলা + English)"
    ],
    "answer": "Option A (বাংলা + English)",
    "explanation": "Short explanation in Bangla + English"
  }}
]

If you cannot comply, return [].
"""