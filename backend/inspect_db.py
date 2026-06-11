import os
import django
import sys

# Add the project root directory (D:\jabed\django\NTRCA\ntrca-prep) to the python path
# We go up two levels from 'backend/' to reach the project root
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

# Set the environment variable to point to your settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

# Import the correct model from question_bank.models
from question_bank.models import QuestionBank, QuestionBankOption

def inspect_db():
    print("--- 🔍 Database Inspector ---")
    
    # 1. Check total questions using the correct model class
    total = QuestionBank.objects.count()
    print(f"Total questions in table: {total}")
    
    # 2. Group by subtopic
    questions = QuestionBank.objects.all()
    
    if total == 0:
        print("❌ Database appears empty or model name mismatch.")
    else:
        print("\nDistribution of questions by SubTopic:")
        for q in questions:
            # Based on models.py: subtopic is a ForeignKey
            sub_id = q.subtopic.id if q.subtopic else "None"
            print(f"- Question ID: {q.id} | SubTopic ID: {sub_id} | Text: {q.question_text[:50]}...")

    print("--- End of Report ---")

if __name__ == "__main__":
    inspect_db()