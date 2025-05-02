from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = Flask(__name__)

# Similarity threshold for grouping similar topics
SIMILARITY_THRESHOLD = 0.8

def cluster_similar_topics(all_topics):
    """
    Flatten and cluster similar topics across all videos using TF-IDF + Cosine Similarity.
    Returns a list of representative (grouped) topic names.
    """
    flat_topics = list(set([topic for sublist in all_topics for topic in sublist]))
    vectorizer = TfidfVectorizer().fit_transform(flat_topics)
    similarity_matrix = cosine_similarity(vectorizer)

    clustered = []
    visited = set()

    for i in range(len(flat_topics)):
        if i in visited:
            continue
        group = [flat_topics[i]]
        visited.add(i)
        for j in range(i + 1, len(flat_topics)):
            if j not in visited and similarity_matrix[i][j] >= SIMILARITY_THRESHOLD:
                group.append(flat_topics[j])
                visited.add(j)
        clustered.append(group)

    # Use the first topic in each group as the representative topic
    return clustered

def map_to_cluster(topic, clusters):
    for cluster in clusters:
        if topic in cluster:
            return cluster[0]  # return representative topic
    return topic  # fallback

@app.route("/analyze-topics", methods=["POST"])
def analyze_topics():
    data = request.get_json()
    topics_per_video = data.get("topicsPerVideo", [])

    if not topics_per_video:
        return jsonify({"error": "No topics received"}), 400

    # Step 1: Cluster all topics across videos
    clusters = cluster_similar_topics(topics_per_video)

    # Step 2: Convert all topics to their representative forms
    mapped_topics = []
    for video_topics in topics_per_video:
        mapped = list(set([map_to_cluster(t, clusters) for t in video_topics]))
        mapped_topics.append(mapped)

    # Step 3: Count topic frequency across videos
    all_mapped = [t for sub in mapped_topics for t in sub]
    topic_counts = {t: all_mapped.count(t) for t in set(all_mapped)}

    total_videos = len(topics_per_video)
    common_topics = [t for t, c in topic_counts.items() if c == total_videos]

    # Step 4: Compute rare topics for each video
    rare_topics_per_video = []
    for mapped in mapped_topics:
        rare = [t for t in mapped if t not in common_topics]
        rare_topics_per_video.append(rare)

    return jsonify({
        "commonTopics": common_topics,
        "rareTopicsPerVideo": rare_topics_per_video
    })

if __name__ == "__main__":
    app.run(port=5001)
