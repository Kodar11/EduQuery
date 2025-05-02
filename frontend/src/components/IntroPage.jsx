import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IntroHome from './IntroHome';
import IntroDashboard from './IntroDashboard';
import IntroHistoryDashboard from './IntroHistoryDashboard';
import StartPage from './StartPage';
import '../styles/IntroPage.css';

const IntroPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  // Demo data for each component
  const demoData = {
    home: {
      query: "Introduction to Machine Learning",
      videos: [
        {
          videoId: "rTUmCssOGhg",
          title: "Machine Learning Crash Course",
          channelTitle: "Google Developers",
          thumbnail: "https://i.ytimg.com/vi/rTUmCssOGhg/maxresdefault.jpg",
          views: "2.5M",
          likes: "45K",
          comments: "1.2K"
        },
        {
          videoId: "aircAruvnKk",
          title: "Deep Learning Fundamentals",
          channelTitle: "MIT OpenCourseWare",
          thumbnail: "https://i.ytimg.com/vi/aircAruvnKk/maxresdefault.jpg",
          views: "1.8M",
          likes: "32K",
          comments: "980"
        },
        {
          videoId: "IHZwWFHWa-w",
          title: "Neural Networks Explained",
          channelTitle: "3Blue1Brown",
          thumbnail: "https://i.ytimg.com/vi/IHZwWFHWa-w/maxresdefault.jpg",
          views: "3.2M",
          likes: "58K",
          comments: "1.5K"
        }
      ],
      manualVideos: [
        {
          videoId: "8gBXVr-6OKc",
          title: "Introduction to Neural Networks",
          channelTitle: "Stanford CS231n",
          thumbnail: "https://i.ytimg.com/vi/8gBXVr-6OKc/maxresdefault.jpg",
          views: "1.5M",
          likes: "28K",
          comments: "850"
        }
      ],
      selectedVideos: {
        "rTUmCssOGhg": true,
        "aircAruvnKk": true,
        "8gBXVr-6OKc": true
      }
    },
    dashboard: {
      videos: [
        {
          videoId: "rTUmCssOGhg",
          title: "Machine Learning Crash Course",
          channelTitle: "Google Developers"
        },
        {
          videoId: "aircAruvnKk",
          title: "Deep Learning Fundamentals",
          channelTitle: "MIT OpenCourseWare"
        },
        {
          videoId: "8gBXVr-6OKc",
          title: "Introduction to Neural Networks",
          channelTitle: "Stanford CS231n"
        }
      ],
      selectedVideos: {
        "rTUmCssOGhg": true,
        "aircAruvnKk": true,
        "8gBXVr-6OKc": true
      },
      summaries: {
        "rTUmCssOGhg": {
          summary: "This comprehensive crash course covers the fundamentals of machine learning, including supervised learning, neural networks, and deep learning. The course explains key concepts like gradient descent, backpropagation, and model evaluation techniques. Perfect for beginners looking to understand the core principles of ML.",
          topics: ["Machine Learning Basics", "Neural Networks", "Gradient Descent", "Model Evaluation"],
          ranking: 4.8
        },
        "aircAruvnKk": {
          summary: "An in-depth exploration of deep learning concepts, starting from the basics of neural networks to advanced architectures like CNNs and RNNs. The course includes practical examples and implementation details, making it ideal for both theoretical understanding and practical application.",
          topics: ["Deep Learning", "CNN", "RNN", "Backpropagation"],
          ranking: 4.5
        },
        "8gBXVr-6OKc": {
          summary: "A detailed introduction to neural networks from Stanford's CS231n course. Covers the mathematical foundations, architecture design, and practical implementation considerations. Includes hands-on examples and best practices for training neural networks.",
          topics: ["Neural Networks", "Computer Vision", "Deep Learning", "Training Techniques"],
          ranking: 4.7
        }
      }
    },
    history: {
      summaries: [
        {
          id: 1,
          videoName: "Machine Learning Crash Course",
          videoLink: "https://youtube.com/watch?v=rTUmCssOGhg",
          summary: "Comprehensive introduction to machine learning fundamentals, covering supervised learning, neural networks, and model evaluation techniques.",
          topicsCovered: ["Machine Learning Basics", "Neural Networks", "Gradient Descent", "Model Evaluation"],
          createdAt: "2024-04-24",
          ranking: 4.8
        },
        {
          id: 2,
          videoName: "Deep Learning Fundamentals",
          videoLink: "https://youtube.com/watch?v=aircAruvnKk",
          summary: "Advanced concepts in deep learning, including CNN and RNN architectures, with practical implementation examples.",
          topicsCovered: ["Deep Learning", "CNN", "RNN", "Backpropagation"],
          createdAt: "2024-04-23",
          ranking: 4.5
        },
        {
          id: 3,
          videoName: "Introduction to Neural Networks",
          videoLink: "https://youtube.com/watch?v=8gBXVr-6OKc",
          summary: "Detailed introduction to neural networks from Stanford's CS231n course, covering mathematical foundations and practical implementation.",
          topicsCovered: ["Neural Networks", "Computer Vision", "Deep Learning", "Training Techniques"],
          createdAt: "2024-04-22",
          ranking: 4.7
        }
      ]
    }
  };

  const steps = [
    {
      title: "Welcome to EduQuery",
      description: "Your AI-powered educational video analysis platform",
      icon: "🎓",
      component: null
    },
    {
      title: "Search & Analyze Videos",
      description: "Search for educational videos or add them manually for analysis",
      icon: "🔍",
      component: <IntroHome demoData={demoData.home} />
    },
    {
      title: "Smart Summaries",
      description: "Get AI-generated summaries and key topics from your videos",
      icon: "📝",
      component: <IntroDashboard demoData={demoData.dashboard} />
    },
    {
      title: "Track Your Learning",
      description: "Save and manage your video summaries in your personal dashboard",
      icon: "📊",
      component: <IntroHistoryDashboard demoData={demoData.history} />
    },
    {
      title: "Get Started",
      description: "Ready to enhance your learning experience?",
      icon: "🚀",
      // component: <StartPage demoMode={true} />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsVisible(true);
      }, 500);
    }
  };

  const handleStart = () => {
    navigate('/start');
  };

  return (
    <div className="intro-container">
      <div className={`intro-content ${isVisible ? 'visible' : ''}`}>
        <div className="step-icon">{steps[currentStep].icon}</div>
        <h1 className="step-title">{steps[currentStep].title}</h1>
        <p className="step-description">{steps[currentStep].description}</p>
        
        <div className="page-preview">
          {steps[currentStep].component}
        </div>
        
        <div className="step-indicators">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentStep ? 'active' : ''}`}
            />
          ))}
        </div>

        <div className="navigation-buttons">
          {currentStep > 0 && (
            <button className="prev-button" onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                setCurrentStep(prev => prev - 1);
                setIsVisible(true);
              }, 500);
            }}>
              Previous
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button className="next-button" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button className="start-button" onClick={handleStart}>
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntroPage; 