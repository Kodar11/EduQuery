import React, { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

function ToggleSection({ title, topics, color }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!topics || topics.length === 0) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-sm text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600`}
      >
        {isOpen ? `Hide ${title}` : `${title}`}
      </button>

      {isOpen && (
        <>
          <h4 className={`text-lg font-bold ${color} mb-2 border-b-2 pb-1`}>
            {title}
          </h4>
          <ul className="list-disc list-inside space-y-2">
            {topics.map((topic, idx) => (
              <li
                key={idx}
                className="flex items-center bg-gray-100 p-3 rounded-md shadow-md transition-transform transform hover:scale-105"
              >
                <span className="text-gray-800 text-md">{topic}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default function Dashboard() {
  const location = useLocation();
  const { videos = [], selectedVideos = {}, summaries = [], query = "" } = location.state || {};

  const totalVideos = videos.length;
  const selectedCount = Object.values(selectedVideos).filter(Boolean).length;

  const navigate = useNavigate();

  const saveAllSummaries = async () => {
    try {
      const analysis = summaries.map((data) => {
        const matchedVideo = videos.find((v) => v.videoId === data.videoId);
        const videoName = matchedVideo?.title || "Unknown Title";
        const videoLink = `https://www.youtube.com/watch?v=${data.videoId}`;

        return {
          videoName,
          videoLink,
          summary: data.summary,
          commonTopics: data.topics || [],
          rareTopics: data.rareTopics || [],
        };
      });

      const response = await axios.post(
        "http://localhost:8000/api/v1/analyze/save-summaries",
        { videos: analysis, query },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("✅ All summaries saved successfully!");
        // console.log("📄 Server response:", response.data);
        navigate("/history");
      } else {
        throw new Error("Server responded with an error");
      }
    } catch (err) {
      console.error("❌ Failed to save all summaries:", err);
      alert("❌ Failed to save one or more summaries.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800">

        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-600">Video Analysis</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-tr from-blue-100 to-blue-200 rounded-xl shadow-lg p-6 border border-blue-300">
              <p className="text-gray-700 text-sm mb-2">Total Videos Fetched</p>
              <p className="text-5xl font-extrabold text-blue-700">{totalVideos}</p>
            </div>
            <div className="bg-gradient-to-tr from-green-100 to-green-200 rounded-xl shadow-lg p-6 border border-green-300">
              <p className="text-gray-700 text-sm mb-2">Selected Videos</p>
              <p className="text-5xl font-extrabold text-green-700">{selectedCount}</p>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Video Summaries</h2>
            <h3 className="text-xl font-bold text-blue-700 mb-2">{query}</h3>

            {summaries.length === 0 ? (
              <p className="text-gray-600">No summaries available.</p>
            ) : (
              <div className="space-y-10">
                {summaries.map((data) => {
                  const matchedVideo = videos.find((v) => v.videoId === data.videoId);
                  const videoName = matchedVideo?.title || "Unknown Title";
                  const videoLink = `https://www.youtube.com/watch?v=${data.videoId}`;

                  const [showSummary, setShowSummary] = useState(false);

                  return (
                    <div
                      key={data.videoId}
                      className="bg-white shadow rounded-xl p-6 border border-gray-200"
                    >
                      <h3 className="text-xl font-bold text-blue-700 mb-2">{videoName}</h3>
                      <a
                        href={videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-sm mb-4 inline-block"
                      >
                        Watch on YouTube
                      </a>

                      <div className="mb-4">
                        <button
                          onClick={() => setShowSummary(!showSummary)}
                          className="text-sm text-white bg-blue-400 px-3 py-1 rounded hover:bg-blue-600 mt-2 mb-1"
                        >
                          {showSummary ? "Hide Summary" : "Summary"}
                        </button>

                        {showSummary && (
                          <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm text-gray-700">
                            {data.summary}
                          </pre>
                        )}
                      </div>

                      <ToggleSection
                        title="Common Topics"
                        topics={data.topics}
                        color="text-green-600 border-green-300"
                      />
                      <ToggleSection
                        title="Rare Topics"
                        topics={data.rareTopics}
                        color="text-red-600 border-red-300"
                      />
                    </div>
                  );
                })}

                <button
                  onClick={saveAllSummaries}
                  className="mb-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
                >
                  Save All Summaries
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
