import nltk
import string
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

from sklearn.metrics.pairwise import cosine_similarity

nltk.download("stopwords")
from nltk.corpus import stopwords

import spacy
nlp = spacy.load("en_core_web_md")

# Step 2: Load data from your transcription text file
with open("file.txt", "r", encoding="utf-8") as file:
    text_data = file.read()

# Optional: Split text into chunks (e.g., by paragraph or sentence)
# Here we're splitting by line or period for simplicity
documents = [line.strip() for line in text_data.split('.') if line.strip()]

# Step 3: Preprocessing function
def preprocess(text):
    tokens = text.lower().translate(str.maketrans("", "", string.punctuation)).split()
    return " ".join([word for word in tokens if word not in stopwords.words("english")])

# Preprocess all documents
processed_docs = [preprocess(doc) for doc in documents]

# Step 4: Vectorize with TF-IDF
vectorizer = TfidfVectorizer(max_df=0.9, min_df=2, stop_words="english")
X = vectorizer.fit_transform(processed_docs)

# Step 5: Train KMeans model
num_topics = 5  # Change this based on how many topics you want
kmeans = KMeans(n_clusters=num_topics, random_state=42)
labels = kmeans.fit_predict(X)

# Step 6: Extract keywords per topic
# def get_top_keywords(data, labels, vectorizer, top_n=10):
#     terms = vectorizer.get_feature_names_out()
#     result = {}

#     for i in range(num_topics):
#         cluster_indices = np.where(labels == i)
#         if len(cluster_indices[0]) == 0:
#             continue
#         cluster_mean = np.mean(data[cluster_indices], axis=0)
#         sorted_indices = np.argsort(cluster_mean).flatten()[::-1][:top_n]
#         top_terms = [str(terms[index]) for index in sorted_indices]
#         result[f"Topic {i}"] = top_terms

#     return result



def get_top_keywords(data, labels, vectorizer, top_n=10, similarity_threshold=0.75):
    terms = vectorizer.get_feature_names_out()
    result = {}

    for i in range(num_topics):
        cluster_indices = np.where(labels == i)
        if len(cluster_indices[0]) == 0:
            continue

        cluster_mean = np.mean(data[cluster_indices], axis=0)
        sorted_indices = np.argsort(cluster_mean).flatten()[::-1]

        # Collect top keywords without high similarity
        selected_terms = []
        for index in sorted_indices:
            term = str(terms[index])
            term_vector = nlp(term).vector
            is_similar = False

            for existing_term in selected_terms:
                sim = nlp(existing_term).similarity(nlp(term))
                if sim >= similarity_threshold:
                    is_similar = True
                    break

            if not is_similar:
                selected_terms.append(term)

            if len(selected_terms) == top_n:
                break

        result[f"Topic {i}"] = selected_terms

    return result



topics = get_top_keywords(X, labels, vectorizer)



# Step 8: Define a function to get the most relevant topic for a query
def find_relevant_topics(query, vectorizer, kmeans, top_n=3):
    # Preprocess query
    query_processed = preprocess(query)
    query_vector = vectorizer.transform([query_processed])

    # Compute similarity between query and each cluster center
    similarities = cosine_similarity(query_vector, kmeans.cluster_centers_).flatten()
    top_indices = similarities.argsort()[::-1][:top_n]

    results = []
    for index in top_indices:
        topic_label = f"Topic {index}"
        similarity_score = similarities[index]
        results.append((topic_label, topics[topic_label], round(similarity_score, 3)))

    return results

# Example usage
query = input("Enter your query: ")
relevant_topics = find_relevant_topics(query, vectorizer, kmeans)

print("\n🔍 Top matching topics for your query:\n")
for label, words, score in relevant_topics:
    print(f"{label} (Score: {score}): {', '.join(words)}")


# Step 7: Save to file
with open("trained_topics3.txt", "w", encoding="utf-8") as f:
    for topic, words in topics.items():
        f.write(f"{topic}:\n")
        for idx, word in enumerate(words, start=1):
            f.write(f"   {idx}. {word}\n")
        f.write("\n")
