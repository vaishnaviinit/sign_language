from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle

INDEX_FILE = 'rag/index.faiss'
PHRASES_PICKLE = 'rag/phrases.pkl'

model = SentenceTransformer('all-MiniLM-L6-v2')
index = faiss.read_index(INDEX_FILE)
with open(PHRASES_PICKLE, 'rb') as f:
    phrases = pickle.load(f)

def retrieve(query, k=3):
    emb = model.encode([query], convert_to_numpy=True)
    emb = emb / np.linalg.norm(emb, axis=1, keepdims=True)
    _, indices = index.search(emb, k)
    return [phrases[i] for i in indices[0]]
