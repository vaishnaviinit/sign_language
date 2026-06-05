from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()
client = Groq(api_key=os.getenv('GROQ_API_KEY'))

def generate(signs, context_phrases):
    context = '\n'.join(context_phrases)
    prompt = f'''You are helping a deaf person communicate.
They signed these letters/words: {signs}

Similar phrases for context:
{context}

Generate one natural, grammatically correct sentence they likely intended.
Reply with only the sentence, nothing else.'''

    response = client.chat.completions.create(
        model='llama-3.3-70b-versatile',
        messages=[{'role': 'user', 'content': prompt}],
        max_tokens=100
    )
    return response.choices[0].message.content.strip()
