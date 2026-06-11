from .ollama_client import generate_mcq
from .json_utils import extract_json
from pathlib import Path


def load_exam_prompt():
    path = Path(__file__).resolve().parent / "prompts" / "exam_prompt.txt"

    return path.read_text(encoding="utf-8")


def generate_mcqs(topic, subtopic, num_questions, difficulty):

    prompt_template = load_exam_prompt()

    prompt = prompt_template.format(
        topic=topic,
        subtopic=subtopic,
        num_questions=num_questions,
        difficulty=difficulty
    )

    raw = generate_mcq(prompt)

    data = extract_json(raw)

    return data