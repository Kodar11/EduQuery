import React from "react";
import "../styles/IntroPage.css";

export default function IntroHome({ demoData }) {
  const videos = demoData?.videos || [];
  const manualVideos = demoData?.manualVideos || [];
  const selectedVideos = demoData?.selectedVideos || {};

  return (
    <div className="intro-home-container">
      <div className="home-header">
        <h2 className="home-title">Demo Search Page</h2>
        <p className="home-description">
          This is a demonstration of the EduQuery search page. In the full application, you would be able to search for educational videos 
          and add them manually for analysis. The search results would be displayed below.
        </p>
      </div>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search YouTube videos..."
          value={demoData?.query || ""}
          disabled
        />
        <button className="search-button" >
          <i className="fas fa-search"></i>
          Search
        </button>
      </div>

      <div className="manual-input-section">
        <input
          type="text"
          className="manual-input"
          placeholder="Enter YouTube video link..."
          disabled
        />
        <button className="add-button" >
          <i className="fas fa-plus"></i>
          Add Video
        </button>
      </div>

      {/* {manualVideos.length > 0 && (
        <div className="manual-videos-section">
          <h3 className="section-title">Manually Added Videos</h3>
          <p className="section-description">
            Videos added manually through the URL input field above.
          </p>
          <div className="videos-grid">
            {manualVideos.map((video) => (
              <div key={video.videoId} className="video-card">
                <div className="thumbnail-container">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="thumbnail"
                  />
                  <div className="video-overlay">
                    <i className="fas fa-play-circle"></i>
                  </div>
                </div>
                <div className="video-info">
                  <h3 className="video-title">
                    <a
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="video-link"
                    >
                      {video.title}
                    </a>
                  </h3>
                  <p className="channel-name">
                    <i className="fas fa-user-circle"></i>
                    {video.channelTitle}
                  </p>
                  <p className="video-stats">
                    <i className="fas fa-eye"></i>
                    {video.views} views
                  </p>
                  <p className="video-stats">
                    <i className="fas fa-thumbs-up"></i>
                    {video.likes} likes
                  </p>
                  <p className="video-stats">
                    <i className="fas fa-comments"></i>
                    {video.comments} comments
                  </p>
                </div>
                <div className="video-select">
                  <input
                    type="checkbox"
                    checked={selectedVideos[video.videoId] || false}
                    className="video-checkbox"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}

      <div className="videos-section">
        <h3 className="section-title">Search Results</h3>
        <p className="section-description">
          Below are example search results. In the full application, these would be videos matching your search query.
        </p>
        
        {videos.length === 0 ? (
          <p className="no-results-message">
            No videos found. Try searching for something else.
          </p>
        ) : (
          <div className="videos-grid">
            {videos.map((video) => (
              <div key={video.videoId} className="video-card">
                <div className="thumbnail-container">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="thumbnail"
                  />
                  <div className="video-overlay">
                    <i className="fas fa-play-circle"></i>
                  </div>
                </div>
                <div className="video-info">
                  <h3 className="video-title">
                    <a
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="video-link"
                    >
                      {video.title}
                    </a>
                  </h3>
                  <p className="channel-name">
                    <i className="fas fa-user-circle"></i>
                    {video.channelTitle}
                  </p>
                  <p className="video-stats">
                    <i className="fas fa-eye"></i>
                    {video.views || "N/A"} views
                  </p>
                  <p className="video-stats">
                    <i className="fas fa-thumbs-up"></i>
                    {video.likes || "N/A"} likes
                  </p>
                  <p className="video-stats">
                    <i className="fas fa-comments"></i>
                    {video.comments || "N/A"} comments
                  </p>
                </div>
                <div className="video-select">
                  <input
                    type="checkbox"
                    checked={selectedVideos[video.videoId] || false}
                    className="video-checkbox"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {Object.keys(selectedVideos).length > 0 && (
        <div className="summarize-section">
          <button className="summarize-button">
            <i className="fas fa-file-alt"></i>
            Get Summaries
          </button>
        </div>
      )}

      {/* <div className="demo-instructions">
        <h3 className="instructions-title">How to Use the Search Page</h3>
        <ol className="instructions-list">
          <li>Enter your search query in the search bar and click "Search"</li>
          <li>Browse through the search results</li>
          <li>Select the videos you want to analyze by clicking on them</li>
          <li>Alternatively, add videos manually by pasting their URLs</li>
          <li>Click "Get Summaries" to proceed to the summaries page</li>
        </ol>
      </div> */}
    </div>
  );
} 