import nltk
import string
import numpy as np
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords
from wordcloud import WordCloud

import spacy
nltk.download("stopwords")
nlp = spacy.load("en_core_web_md")

# Step 2: Load data
with open("file.txt", "r", encoding="utf-8") as file:
    text_data = file.read()

documents = [line.strip() for line in text_data.split('.') if line.strip()]

# ✅ Improved Preprocessing
def preprocess(text):
    doc = nlp(text.lower())
    tokens = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct and token.is_alpha]
    return " ".join(tokens)

processed_docs = [preprocess(doc) for doc in documents]

# Step 4: Vectorize
vectorizer = TfidfVectorizer(max_df=0.9, min_df=2, stop_words="english")
X = vectorizer.fit_transform(processed_docs)

# Step 5: KMeans
num_topics = 5
kmeans = KMeans(n_clusters=num_topics, random_state=42)
labels = kmeans.fit_predict(X)

# Step 6: Keywords with Similarity Filtering
def get_top_keywords(data, labels, vectorizer, top_n=10, similarity_threshold=0.75):
    terms = vectorizer.get_feature_names_out()
    result = {}

    for i in range(num_topics):
        cluster_indices = np.where(labels == i)
        if len(cluster_indices[0]) == 0:
            continue

        cluster_mean = np.mean(data[cluster_indices], axis=0)
        sorted_indices = np.argsort(cluster_mean).flatten()[::-1]

        selected_terms = []
        for index in sorted_indices:
            term = str(terms[index])
            if nlp(term).has_vector:
                is_similar = any(nlp(term).similarity(nlp(existing)) >= similarity_threshold for existing in selected_terms)
                if not is_similar:
                    selected_terms.append(term)
            if len(selected_terms) == top_n:
                break

        result[f"Topic List {i}"] = selected_terms
    return result

topics = get_top_keywords(X, labels, vectorizer)

# ✅ Step 6.1: Generate Word Clouds
def generate_wordclouds(topics):
    for topic, words in topics.items():
        wc = WordCloud(background_color="white", width=800, height=400)
        wc.generate(" ".join(words))
        plt.figure(figsize=(6, 3))
        plt.imshow(wc, interpolation="bilinear")
        plt.axis("off")
        plt.title(topic)
        plt.tight_layout()
        plt.show()

generate_wordclouds(topics)

# ✅ Step 6.2: LDA Alternative for Comparison
lda = LatentDirichletAllocation(n_components=num_topics, random_state=42)
lda.fit(X)

def print_lda_topics(model, vectorizer, top_n=10):
    terms = vectorizer.get_feature_names_out()
    print("\n📌 LDA Topics:\n")
    for idx, topic in enumerate(model.components_):
        top_features = [terms[i] for i in topic.argsort()[:-top_n - 1:-1]]
        print(f"Topic List {idx}: {', '.join(top_features)}")

print_lda_topics(lda, vectorizer)
