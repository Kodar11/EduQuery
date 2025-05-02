from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow frontend requests

@app.route("/transcription", methods=["GET"])
def get_transcription():
    video_id = request.args.get("video_id")
    language = request.args.get("language", "en")  # Default to English

    if not video_id:
        return jsonify({"error": "Video ID is required"}), 400

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[language])
        text = " ".join([entry["text"] for entry in transcript])

        return jsonify({
            "transcription": text
        })
    except TranscriptsDisabled:
        return jsonify({"error": "Transcription is disabled for this video"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=3001, debug=True)
