import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

export default function HistoryDashboard() {
  const [history, setHistory] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/analyze/history", {
          withCredentials: true,
        });
        setHistory(res.data?.data?.userSummaries || []);
      } catch (err) {
        console.error("Failed to fetch history", err);
      }
    };

    fetchHistory();
  }, []);

  const toggleSection = (key, type) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: !prev[key]?.[type],
      },
    }));
  };

  // Filter logic based on search input
  const filteredHistory = history
    .map((user) => ({
      ...user,
      topics: user.topics.filter((topic) =>
        topic.topic_name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((user) => user.topics.length > 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-10">
            History
          </h1>

          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Search by topic name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border bg-white border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {filteredHistory.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">No matching topics found.</p>
          ) : (
            filteredHistory.map((user, userIndex) =>
              user.topics.map((topic, topicIndex) => (
                <div
                  key={`${userIndex}-${topicIndex}`}
                  className="bg-white shadow-md hover:shadow-xl transition-all duration-300 p-6 mb-8 rounded-2xl border border-gray-200"
                >
                  <h2 className="text-2xl font-bold text-indigo-700 mb-4 capitalize">
                    Topic: {topic.topic_name}
                  </h2>

                  {topic.videos.map((video, vidIndex) => {
                    const sectionKey = `${userIndex}-${topicIndex}-${vidIndex}`;
                    const sectionState = expandedSections[sectionKey] || {};

                    return (
                      <div key={vidIndex} className="mb-6 border border-b-cyan-900 pb-4 p-4">
                        <h3 className="text-xl font-semibold text-indigo-600">
                          {video.videoName || "Untitled Video"}
                        </h3>
                        <p className="text-gray-700 mb-1">
                          <strong className="text-gray-900">Video Link:</strong>{" "}
                          <a
                            href={video.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {video.videoLink}
                          </a>
                        </p>

                        {video.summary && (
                          <>
                            <button
                              onClick={() => toggleSection(sectionKey, "summary")}
                              className="text-sm text-white bg-blue-400 px-3 py-1 rounded hover:bg-blue-600 mt-2 mb-1"
                            >
                              {sectionState.summary ? "Hide Summary" : " Summary"}
                            </button>
                            {sectionState.summary && (
                              <p className="text-gray-700 whitespace-pre-wrap mb-2 mt-1">
                                <strong className="text-gray-900">Summary:</strong>{" "}
                                {video.summary}
                              </p>
                            )}
                          </>
                        )}

                        {video.commonTopics?.length > 0 && (
                          <>
                            <button
                              onClick={() => toggleSection(sectionKey, "common")}
                              className="text-sm text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600 mt-2 mb-1 ml-2"
                            >
                              {sectionState.common ? "Hide Common Topics" : " Common Topics"}
                            </button>
                            {sectionState.common && (
                              <div className="mb-4 mt-2">
                                <h4 className="text-lg font-bold text-green-600 mb-2 border-b-2 border-green-300 pb-1">
                                  📌 Common Topics:
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  {video.commonTopics.map((topic, i) => (
                                    <div
                                      key={i}
                                      className="bg-gray-100 p-4 rounded-md shadow-md"
                                    >
                                      <p className="text-gray-800 text-md">{topic}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {video.rareTopics?.length > 0 && (
                          <>
                            <button
                              onClick={() => toggleSection(sectionKey, "rare")}
                              className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 mt-2 mb-1 ml-2"
                            >
                              {sectionState.rare ? "Hide Rare Topics" : " Rare Topics"}
                            </button>
                            {sectionState.rare && (
                              <div className="mt-2">
                                <h4 className="text-lg font-bold text-red-600 mb-2 border-b-2 border-red-300 pb-1">
                                  🌟 Rare Topics:
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  {video.rareTopics.map((topic, i) => (
                                    <div
                                      key={i}
                                      className="bg-gray-100 p-4 rounded-md shadow-md"
                                    >
                                      <p className="text-gray-800 text-md">{topic}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )
          )}
        </div>
      </div>
    </>
  );
}
