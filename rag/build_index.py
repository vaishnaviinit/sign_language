from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle
import os

PHRASES_FILE = 'knowledge/phrases.txt'
INDEX_FILE = 'rag/index.faiss'
PHRASES_PICKLE = 'rag/phrases.pkl'

model = SentenceTransformer('all-MiniLM-L6-v2')

with open(PHRASES_FILE, 'r') as f:
    phrases = [line.strip() for line in f if line.strip()]

embeddings = model.encode(phrases, convert_to_numpy=True)
embeddings = embeddings / np.linalg.norm(embeddings, axis=1, keepdims=True)

index = faiss.IndexFlatIP(embeddings.shape[1])
index.add(embeddings)

os.makedirs('rag', exist_ok=True)
faiss.write_index(index, INDEX_FILE)
with open(PHRASES_PICKLE, 'wb') as f:
    pickle.dump(phrases, f)

print('Index built with', len(phrases), 'phrases')
