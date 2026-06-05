from rag.retriever import retrieve
from rag.llm import generate
import json
import os

HISTORY_FILE = 'history.json'

def load_signs():
    if not os.path.exists(HISTORY_FILE):
        return []
    with open(HISTORY_FILE, 'r') as f:
        return json.load(f)

def group_signs(signs):
    words = []
    current = ''
    for sign in signs:
        if sign == ' ':
            if current:
                words.append(current)
                current = ''
        elif len(sign) == 1:
            current += sign
        else:
            if current:
                words.append(current)
                current = ''
            words.append(sign)
    if current:
        words.append(current)
    return words

def run_pipeline():
    signs = load_signs()
    if not signs:
        return 'No signs detected yet'
    query = ' '.join(group_signs(signs))
    context = retrieve(query)
    sentence = generate(query, context)
    return sentence

def save_to_knowledge(sentence):
    with open('knowledge/phrases.txt', 'a') as f:
        f.write('\n' + sentence)
    import subprocess
    subprocess.run(['python', 'rag/build_index.py'])
