import React from "react";
import "../styles/IntroPage.css";

export default function IntroHistoryDashboard({ demoData }) {
  const { summaries = [] } = demoData || {};

  return (
    <div className="intro-history-container">
      <div className="history-header">
        <h2 className="history-title">Demo History</h2>
        <p className="history-description">
          This is a demonstration of the EduQuery history page. In the full application, you would be able to view all your saved video summaries, 
          including their topics and rankings. This helps you track your learning progress and revisit important content.
        </p>
      </div>

      <div className="history-content">
        {summaries.length === 0 ? (
          <p className="no-history-message">No history available in demo mode.</p>
        ) : (
          <div className="history-cards">
            {summaries.map((summary, index) => (
              <div key={index} className="history-card">
                <div className="card-header">
                  <h3 className="video-title">
                    <i className="fas fa-video"></i>
                    {summary.videoName}
                  </h3>
                  <a
                    href={summary.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-link"
                  >
                    <i className="fas fa-external-link-alt"></i>
                    Watch on YouTube
                  </a>
                </div>

                <div className="card-content">
                  <div className="summary-section">
                    <h4 className="section-title">
                      <i className="fas fa-file-alt"></i>
                      Summary
                    </h4>
                    <p className="summary-text">{summary.summary}</p>
                  </div>

                  <div className="topics-section">
                    <h4 className="section-title">
                      <i className="fas fa-tags"></i>
                      Topics Covered
                    </h4>
                    <div className="topics-container">
                      {summary.topicsCovered.map((topic, idx) => (
                        <span key={idx} className="topic-tag">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="metadata-section">
                    <div className="metadata-item">
                      <i className="fas fa-calendar"></i>
                      <span>Saved on: {summary.createdAt}</span>
                    </div>
                    <div className="metadata-item">
                      <i className="fas fa-star"></i>
                      <span>Ranking: {summary.ranking}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="demo-instructions">
        <h3 className="instructions-title">How to Use History</h3>
        <ol className="instructions-list">
          <li>Save summaries from the Dashboard page to add them to your history</li>
          <li>View all your saved summaries in chronological order</li>
          <li>Click on video links to watch the original content</li>
          <li>Review topics and rankings to track your learning progress</li>
          <li>Use the search feature to find specific summaries (in full version)</li>
        </ol>
      </div>
    </div>
  );
} 