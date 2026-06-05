from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def generate(signs, context_phrases):
    context = '\n'.join(context_phrases)
    prompt = f'''You convert sign-language input into natural English.

A deaf user signed this sequence of recognized signs. It mixes whole phrases with individual fingerspelled letters, and may contain repeats or noise:
{signs}

Reference phrases the user commonly uses:
{context}

Reconstruct the most likely intended message as natural, grammatically correct English.
Combine fingerspelled letters into words where it makes sense.
Use the reference phrases only when they clearly match the input, otherwise ignore them.
Do not add information the user did not express.
Reply with only the final message and nothing else.'''

    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[{'role': 'user', 'content': prompt}],
        temperature=0.3,
        max_tokens=120
    )
    return response.choices[0].message.content.strip()
