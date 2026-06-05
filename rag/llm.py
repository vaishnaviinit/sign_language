from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def generate(signs, context_phrases):
    context = '\n'.join(context_phrases)
    prompt = f'''You are a faithful sign-language interpreter. Turn the recognized signs into one natural English sentence.

Recognized signs, in order (whole phrases plus fingerspelled letters, may contain repeats):
{signs}

Strict rules:
- Use ONLY the words and meaning present in the recognized signs.
- Do NOT add new words, names, places, or ideas that are not in the signs.
- Do NOT drop meaningful signs.
- Combine consecutive fingerspelled letters into a single word.
- Only fix grammar, word order, capitalization and punctuation.

The reference phrases below show the user's writing style only. Do NOT copy their words into your answer:
{context}

Reply with only the final sentence.'''

    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[{'role': 'user', 'content': prompt}],
        temperature=0,
        max_tokens=120
    )
    return response.choices[0].message.content.strip()
