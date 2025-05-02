import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import Loader from "./Loader";

export default function Home() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState({});
  const [summaries, setsummaries] = useState({});
  const [manualVideo, setManualVideo] = useState("");
  const [manualVideos, setManualVideos] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [selectedVideoIds, setSelectedVideoIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  let ans = [];

  const fetchVideos = async () => {
    if (!query) return;
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/analyze/videos?q=${query}`);
      setVideos(res.data.data.videos || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const addManualVideo = async () => {
    if (!manualVideo) return;
    setError("");

    try {
      const res = await axios.post("http://localhost:8000/api/v1/analyze/video-from-link", { link: manualVideo });
      const videoData = res.data.data;

      if (videoData) {
        setManualVideos((prev) => [...prev, videoData]);
        setManualVideo("");
      } else {
        setError("No video found.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };


  const fetchAllsummaries = async () => {

    console.log("Select Videos : ", selectedVideos);

    if (!selectedVideos || selectedVideos.length === 0) {
      console.warn("⚠️ No videos selected for summarization.");
      return;
    }

    const videoIds = Object.keys(selectedVideos);

    setIsLoading(true);
    try {
      console.log("📤 Sending video IDs to backend for summarization:", videoIds);

      const response = await axios.post("http://localhost:8000/api/v1/analyze/summarize-videos", {
        videoIds
      });
      console.log("Response : ", response);

      const rankedResults = response.data.data;
      console.log("✅ Summarization complete. Ranked Results:", rankedResults);

      setIsLoading(false);
      navigate("/dashboard", {
        state: {
          videos: [...videos, ...manualVideos],
          selectedVideos,
          summaries: rankedResults,
          query
        },
      });


    } catch (error) {
      console.error("❌ Error summarizing selected videos:", error.response?.data || error.message);
    }

  };


  const handleSelect = (videoId) => {
    setSelectedVideos((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  };

  return (
    <>
    {isLoading ? (
      <Loader />
    ) : (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl relative">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-3 p-2 animate-gradient">
            EduQuery
          </h1>
          <p className="text-gray-600 text-base max-w-xl mx-auto leading-relaxed">
            Discover, analyze, and summarize educational content from YouTube with AI-powered insights
          </p>
        </div>

        <div className="flex flex-col items-center">
          {/* Search Section */}
          <div className=" w-4xl bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-8 transform transition-all duration-300 hover:shadow-xl border border-white/20">
            <div className="flex flex-col sm:flex-row gap-4 group">
              <Input
                placeholder="Search Content "
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 group-hover:border-teal-300"
              />
              <button
                onClick={fetchVideos}
                className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-500 transition-all duration-300 text-base font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center min-w-[120px]"
              >
                {/* <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg> */}
                Search
              </button>
            </div>
          </div>

          {/* Manual Video Link Input Section */}
          <div className="w-4xl bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-8 transform transition-all duration-300 hover:shadow-xl border border-white/20">
            <div className="flex flex-col sm:flex-row gap-4 mb-2 group">
              <Input
                placeholder="Enter YouTube video link..."
                value={manualVideo}
                onChange={(e) => setManualVideo(e.target.value)}
                className="flex-1 group-hover:border-teal-300"
              />
              <button
                onClick={addManualVideo}
                className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-500 transition-all duration-300 text-base font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center whitespace-nowrap"
              >
                {/* <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg> */}
                Add Video
              </button>
            </div>
            {error && (
              <div className="mt-2 p-3 bg-red-50 text-red-500 rounded-lg text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Manual Video Cards */}
        {manualVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {manualVideos.map((video) => (
              <div
                key={video.videoId}
                className="group flex items-start gap-4 bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border border-white/20"
              >
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-40 h-auto object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col flex-1">
                  <h2 className="text-lg font-semibold text-indigo-700 mb-2 line-clamp-2 group-hover:text-indigo-800 transition-colors duration-300">{video.title}</h2>
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    {video.channelTitle}
                  </p>
                  <div className="space-y-1.5 text-sm text-gray-700">
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Views:</span> {video.views}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span className="font-medium">Likes:</span> {video.likes}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Comments:</span> {video.comments}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedVideos[video.videoId] || false}
                    onChange={() => handleSelect(video.videoId)}
                    className="mt-2 w-5 h-5 accent-indigo-600 cursor-pointer rounded-full border-2 border-indigo-200 checked:border-indigo-600 transition-colors duration-200"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fetched Video Cards */}
        {videos.length === 0 ? (
          <div className="text-center py-12">
            {/*   <div className="inline-block p-3 rounded-full bg-indigo-50 mb-3">
               <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
             </div>
             <p className="text-lg text-gray-500 font-medium">
               Try searching for something else.
             </p> */}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <div
                key={video.videoId}
                className="group flex items-start gap-4 bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border border-white/20"
              >
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-40 h-auto object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col flex-1">
                  <h2 className="text-lg font-semibold text-indigo-700 mb-2 line-clamp-2 group-hover:text-indigo-800 transition-colors duration-300">
                    <a
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {video.title}
                    </a>
                  </h2>
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a2.945 2.945 0 00-2.071-2.085C19.75 3.5 12 3.5 12 3.5s-7.75 0-9.427.601a2.945 2.945 0 00-2.071 2.085C0 7.867 0 12 0 12s0 4.133.502 5.814a2.945 2.945 0 002.071 2.085C4.25 20.5 12 20.5 12 20.5s7.75 0 9.427-.601a2.945 2.945 0 002.071-2.085C24 16.133 24 12 24 12s0-4.133-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
                    </svg>
                    {video.channelTitle}
                  </p>
                  <div className="space-y-1.5 text-sm text-gray-700">
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Views:</span> {video.views || "N/A"}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span className="font-medium">Likes:</span> {video.likes || "N/A"}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Comments:</span> {video.comments || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedVideos[video.videoId] || false}
                    onChange={() => handleSelect(video.videoId)}
                    className="mt-2 w-5 h-5 accent-indigo-600 cursor-pointer rounded-full border-2 border-indigo-200 checked:border-indigo-600 transition-colors duration-200"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summarize button */}
        {Object.keys(selectedVideos).length > 0 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={fetchAllsummaries}
              className="px-8 py-3 text-base bg-green-400 hover:bg-green-500 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl rounded-lg font-medium flex items-center justify-center min-w-[160px]"
            >
              Get Summaries
            </button>
          </div>
        )}
      </div>
    </div>
      )}
    </>
  );
}
