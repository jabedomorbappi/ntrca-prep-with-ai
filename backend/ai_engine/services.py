from question_bank.models import Question, Option
from .ollama_client import generate_mcq
from .json_utils import extract_json
from django.conf import settings
from pathlib import Path


def load_prompt():
    path = Path("backend/ai_engine/prompts/mcq_prompt.txt")
    return path.read_text()


def generate_and_store_questions(topic, subtopic):

    prompt_template = load_prompt()

    raw = generate_mcq(topic.name, subtopic.name if subtopic else "", prompt_template)

    data = extract_json(raw)

    if not data:
        return {
            "status": "error",
            "message": "Invalid JSON from AI",
            "raw_output": raw
        }

    created = 0

    for item in data:

        q = Question.objects.create(
            topic=topic,
            subtopic=subtopic,
            question_text=item["question"],
            explanation=item.get("explanation", "")
        )

        for opt in item["options"]:
            Option.objects.create(
                question=q,
                text=opt,
                is_correct=(opt == item["answer"])
            )

        created += 1

    return {
        "status": "success",
        "created": created
    }