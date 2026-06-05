import json
import os

HISTORY_FILE = 'history.json'


def load_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, 'r') as file:
            return json.load(file)
    except (json.JSONDecodeError, ValueError):
        return []


def save_history(history):
    with open(HISTORY_FILE, 'w') as file:
        json.dump(history, file)


def add_sign(sign):
    history = load_history()
    history.append(sign)
    save_history(history)
    return history


def clear_history():
    save_history([])
    return []
