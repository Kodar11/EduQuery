import { User } from "../models/user.models.js";
import axios from "axios";
import { Summary } from "../models/summary.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

let resultForRanking = {}

const parseYouTubeVideoId = (url) => {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
};

const getVideoDetailsFromLink = asyncHandler(async (req, res) => {
  const { link } = req.body;
  if (!link) throw new ApiError(400, "Video link is required");

  const videoId = parseYouTubeVideoId(link);
  if (!videoId) throw new ApiError(400, "Invalid YouTube link");

  // Step 1: Check English captions
  const captionRes = await axios.get(
    `https://www.googleapis.com/youtube/v3/captions`,
    {
      params: {
        part: "snippet",
        videoId,
        key: process.env.YOUTUBE_API_KEY,
      },
    }
  );
  const hasEnglishCaptions = captionRes.data.items?.some(
    (caption) => caption.snippet.language === "en"
  );
  if (!hasEnglishCaptions)
    throw new ApiError(400, "Video does not have English captions");

  // Step 2: Get video stats
  const statsRes = await axios.get(
    `https://www.googleapis.com/youtube/v3/videos`,
    {
      params: {
        part: "snippet,statistics,contentDetails",
        id: videoId,
        key: process.env.YOUTUBE_API_KEY,
      },
    }
  );

  const video = statsRes.data.items?.[0];
  if (!video) throw new ApiError(404, "Video not found");

  const parseDuration = (duration) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match?.[1]) || 0;
    const minutes = parseInt(match?.[2]) || 0;
    const seconds = parseInt(match?.[3]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  const durationSeconds = parseDuration(video.contentDetails.duration);

  const formattedVideo = {
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: video.snippet.thumbnails.high.url,
    videoId,
    channelTitle: video.snippet.channelTitle,
    publishedAt: video.snippet.publishedAt,
    views: video.statistics.viewCount || "0",
    likes: video.statistics.likeCount || "0",
    comments: video.statistics.commentCount || "0",
    durationSeconds,
  };

  return res.status(200).json(new ApiResponse(200, formattedVideo, "Video fetched successfully"));
});




const fetchVideosWithEnglishCaptions = async (query) => {
  try {
    // console.log("🔍 [Step 1] Searching videos for query:", query);

    const videoRes = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: "snippet",
          type: "video",
          q: query,
          maxResults: 20,
          videoDuration: "long",
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const videoData = videoRes.data;

    if (!videoData.items || videoData.items.length === 0)
      throw new ApiError(404, "No video items found from search");

    const videoIds = videoData.items.map((v) => v.id.videoId).filter(Boolean);
    // console.log(" Extracted video IDs:", videoIds);

    if (videoIds.length === 0) return [];

    // Step 2: Check English captions
    // console.log("📝 [Step 2] Checking for English captions");

    const captionChecks = videoIds.map(async (videoId) => {
      try {
        const captionRes = await axios.get(
          `https://www.googleapis.com/youtube/v3/captions`,
          {
            params: {
              part: "snippet",
              videoId: videoId,
              key: process.env.YOUTUBE_API_KEY,
            },
          }
        );
        const captionData = captionRes.data;
        const hasEnglishCaptions = captionData.items?.some(
          (caption) => caption.snippet.language === "en"
        );
        // console.log(` Video ${videoId} has English captions: ${hasEnglishCaptions}`);
        return hasEnglishCaptions ? videoId : null;
      } catch (err) {
        console.warn(`⚠️ Error checking captions for ${videoId}:`, err.message);
        return null;
      }
    });

    const videosWithEnglishCaptionsIds = (await Promise.all(captionChecks)).filter(Boolean);
    // console.log(" Videos with English captions:", videosWithEnglishCaptionsIds);

    if (videosWithEnglishCaptionsIds.length === 0) return [];

    const statsRes = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`,
      {
        params: {
          part: "statistics,contentDetails",
          id: videosWithEnglishCaptionsIds.join(","),
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const statsData = statsRes.data;
    // console.log("📈 [Step 3.1] Stats fetched:", statsData);

    const parseDuration = (duration) => {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      const hours = parseInt(match?.[1]) || 0;
      const minutes = parseInt(match?.[2]) || 0;
      const seconds = parseInt(match?.[3]) || 0;
      return hours * 3600 + minutes * 60 + seconds;
    };

    // Step 4: Merge metadata
    const videosWithStats = videoData.items
      .filter((video) => videosWithEnglishCaptionsIds.includes(video.id.videoId))
      .map((video) => {
        const statItem = statsData.items.find((stat) => stat.id === video.id.videoId);
        const stats = statItem?.statistics || {};
        const duration = statItem?.contentDetails?.duration || "PT0S";
        const durationSeconds = parseDuration(duration);

        return {
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.high.url,
          videoId: video.id.videoId,
          channelTitle: video.snippet.channelTitle,
          publishedAt: video.snippet.publishedAt,
          views: stats.viewCount || "0",
          likes: stats.likeCount || "0",
          comments: stats.commentCount || "0",
          durationSeconds,
        };
      })
      .filter((video) => video.durationSeconds > 1800)
      .slice(0, 10);

    resultForRanking = videosWithStats
    // console.log("🎬 [Final] Filtered long videos:", videosWithStats);
    return videosWithStats;
  } catch (error) {
    console.error("🔥 [ERROR] Failed to fetch videos:", error.message);
    throw new ApiError(500, "Error fetching videos");
  }
};


// ================== VIDEO ROUTES (PROTECTED) ==================
const getVideos = asyncHandler(async (req, res) => {
  const query = req.query.q;
  if (!query) throw new ApiError(400, "Query is required");

  console.log("🔍 [Route] Received query:", query);

  const videos = await fetchVideosWithEnglishCaptions(query);

  // console.log("✅ [Route] Sending back video response");
  return res.status(200).json(new ApiResponse(200, { videos }, "Videos fetched successfully"));
});

const getManualVideo = asyncHandler(async (req, res) => {
  const videoId = req.query.id;
  if (!videoId) throw new ApiError(400, "Video ID is required");

  try {
    const videoRes = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`, {
      params: {
        part: 'snippet,statistics',
        id: videoId,
        key: YOUTUBE_API_KEY
      }
    }
    );
    const videoData = videoRes.data;

    if (!videoData.items || videoData.items.length === 0)
      throw new ApiError(404, "Video not found");

    const video = videoData.items[0];
    return res.status(200).json({
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high.url,
      videoId: video.id,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      views: video.statistics.viewCount || "0",
      likes: video.statistics.likeCount || "0",
      comments: video.statistics.commentCount || "0",
    });
  } catch (error) {
    throw new ApiError(500, "Failed to fetch manual video");
  }
});

const getHistory = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const userSummaries = await Summary.find({ userId });

    console.log("User Summaries", userSummaries);
    
    return res.status(200).json(new ApiResponse(200, { userSummaries }, "User history fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Error fetching summaries");
  }
});

const chunkText = (text, chunkSize = 8000) => {
  // console.log(`🔧 Chunking text of length ${text.length} into chunks of size ${chunkSize}`);
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  // console.log(`✅ Created ${chunks.length} chunks`);
  return chunks;
};

// Utility to count words
const wordCount = (text) => text.trim().split(/\s+/).length;

// Summarize a single chunk
const summarizeChunkText = async (chunk) => {
  try {
    console.log(`📝 Summarizing a chunk of length ${chunk.length}...`);
    const res = await axios.post(process.env.API_URL, {
      model: "llama3",
      prompt: `Summarize the following text in 100 words and don't write anything else:\n\n${chunk}`,
      stream: false,
    });
    console.log("✅ Chunk summarized successfully");
    return res.data.response || '';
  } catch (err) {
    console.error("❌ Chunk summarization failed:", err.message);
    return '';
  }
};

// Recursively compress until within word limit
const summarizeUntilCompact = async (textChunks, maxWords = 4000) => {
  let iteration = 1;

  while (true) {
    console.log(`🔄 Summarization iteration ${iteration}`);
    const summaries = [];

    for (let i = 0; i < textChunks.length; i++) {
      console.log(`📦 Summarizing chunk ${i + 1}/${textChunks.length}`);
      const summary = await summarizeChunkText(textChunks[i]);
      if (summary) summaries.push(summary);
    }

    const combined = summaries.join('\n\n');
    const wordLen = wordCount(combined);
    // console.log(`📊 Combined summary word count: ${wordLen}`);

    if (wordLen <= maxWords) {
      console.log(`✅ Final compressed summary is within word limit (${wordLen} words)`);
      return combined;
    }

    console.log(`⚠️ Exceeded word limit (${wordLen} > ${maxWords}), re-chunking...`);
    textChunks = chunkText(combined, 8000);
    iteration++;
  }
};

// Final summary
const generateFinalSummaryFromText = async (summaryText) => {
  try {
    console.log("🧠 Generating final comprehensive summary...");
    const finalPrompt = `The following are multiple summaries of different chunks from a large document:\n\n${summaryText}\n\nBased on these, generate:\n1. A final comprehensive summary.\nLimit your response to approximately 300 words.`;

    const res = await axios.post(process.env.API_URL, {
      model: "llama3",
      prompt: finalPrompt,
      stream: false,
    });

    console.log("✅ Final summary generated");
    return res.data.response || '';
  } catch (err) {
    console.error("❌ Final summary generation failed:", err.message);
    return '';
  }
};


const extractAllTopics = (text) => {
  const lines = text.split('\n');
  const topics = [];

  for (let line of lines) {
    // Match lines like: 1. Topic Title
    const numberedMatch = line.match(/^\d+\.\s+(.+)/);
    if (numberedMatch) {
      topics.push(numberedMatch[1].trim());
      continue;
    }

    // Match lines like: * Sub-topic Title or - Sub-topic Title
    const bulletMatch = line.match(/^[*-]\s+(.+)/);
    if (bulletMatch) {
      topics.push(bulletMatch[1].trim());
    }
  }

  return topics;
};


// Only topics
const generateTopicsCovered = async (summaryText) => {
  try {
    console.log("🧩 Extracting topics covered...");
    const finalPrompt = `The following are multiple summaries of different chunks from a large document:\n\n${summaryText}\n\nGenerate a list of topics covered.`;

    const res = await axios.post(process.env.API_URL, {
      model: "llama3",
      prompt: finalPrompt,
      stream: false,
    });
    const extractTopics = extractAllTopics(res.data.response)
    console.log("Topics as string :", extractTopics);

    return extractTopics;
  } catch (err) {
    console.error("❌ Failed to extract topics:", err.message);
    return '';
  }
};

// MAIN CONTROLLER FUNCTION
const summarizeLargeText = asyncHandler(async (req, res) => {
  const { inputText } = req.body;
  console.log("📥 Received request to summarize large text");

  if (!inputText) {
    console.error("❌ No text input provided");
    throw new ApiError(400, "Text input is required");
  }

  const chunks = chunkText(inputText);
  const compressed = await summarizeUntilCompact(chunks);
  const finalSummary = await generateFinalSummaryFromText(compressed);
  const topics = await generateTopicsCovered(compressed);

  console.log("🎉 Summary and topics generation complete");
  return res.status(200).json(
    new ApiResponse(200, {
      summary: finalSummary,
      topics,
    }, "Summary generated successfully")
  );
});

const processTextSummary = async (inputText) => {
  const chunks = chunkText(inputText);
  const compressed = await summarizeUntilCompact(chunks);
  const summary = await generateFinalSummaryFromText(compressed);
  const topics = await generateTopicsCovered(compressed);
  return { summary, topics };
};

const getCommonAndRareTopics = async (topicsPerVideo) => {
  try {
    const response = await axios.post("http://localhost:5001/analyze-topics", {
      topicsPerVideo,
    });
    return response.data; // contains { commonTopics, rareTopicsPerVideo }
  } catch (error) {
    console.error("❌ Failed to analyze topics:", error.message);
    return { commonTopics: [], rareTopicsPerVideo: [] };
  }
};

const summarizeVideos = asyncHandler(async (req, res) => {
  const { videoIds } = req.body;
  console.log("📼 Received request to summarize videos", videoIds);


  if (!Array.isArray(videoIds) || videoIds.length === 0) {
    console.error("❌ Invalid input: videoIds should be a non-empty array");
    throw new ApiError(400, "videoIds should be a non-empty array");
  }

  const results = [];

  for (const videoId of videoIds) {
    try {
      console.log(`🔎 Fetching transcription for video ID: ${videoId}`);
      const transcriptionRes = await axios.get("http://localhost:3001/transcription", {
        params: { video_id: videoId },
      });

      const transcript = transcriptionRes.data.transcription;
      if (!transcript) throw new Error("No transcription received");

      console.log(`🧠 Processing summary & topics for video ID: ${videoId}`);
      const { summary, topics } = await processTextSummary(transcript);

      results.push({
        videoId,
        summary,
        topics,
      });

    } catch (error) {
      console.error(`❌ Failed processing video ID: ${videoId}`, error.message);
      results.push({ videoId, error: error.message });
    }
  }


  const enrichedResults = results.map((result) => {
    const videoMeta = resultForRanking.find((video) => video.videoId === result.videoId);
    return videoMeta
      ? { ...videoMeta, ...result }
      : result; // fallback if metadata not found
  });

  console.log("🧮 Enriched results before ranking:", enrichedResults);

  // 🧠 Call ranking function
  console.log("✅ All videos processed one by one");

  const rankedResults = await rankSummariesWithLLaMA(enrichedResults);

  console.log("Ranked Results ", rankedResults);

  // const finale = await analyzeTopicsWithLLM(rankedResults)

  // console.log("Finale : ", finale);

  const topicsPerVideo = rankedResults.map((video) => video.topics);

  // Get common and rare topics
  const { commonTopics, rareTopicsPerVideo } = await getCommonAndRareTopics(topicsPerVideo);

  // Enrich each video with common & rare topics
  const finalResults = rankedResults.map((video, index) => ({
    ...video,
    commonTopics,
    rareTopics: rareTopicsPerVideo[index] || [],
  }));

  console.log("🎯 Final enriched results:", finalResults);


  return res.status(200).json(new ApiResponse(200, finalResults, "Summaries generated successfully"));
});


// Save summary

const saveSummary = asyncHandler(async (req, res) => {
  const { videos, query } = req.body;

  if (!Array.isArray(videos) || videos.length === 0) {
    throw new ApiError(400, "Videos array is required and cannot be empty");
  }

  if (!query || typeof query !== "string") {
    throw new ApiError(400, "Query (topic name) is required");
  }

  const userId = req.user._id;
  console.log(`📥 Saving summaries for topic '${query}' and user: ${userId}`);

  let userSummaryDoc = await Summary.findOne({ userId });

  const newTopicEntry = {
    topic_name: query,
    videos,
  };

  if (userSummaryDoc) {
    console.log("📄 Existing summary document found. Appending new topic...");

    userSummaryDoc.topics.push(newTopicEntry);

    await userSummaryDoc.save();
  } else {
    console.log("🆕 No summary document found. Creating new document...");

    userSummaryDoc = await Summary.create({
      userId,
      topics: [newTopicEntry],
    });
  }

  return res.status(200).json(
    new ApiResponse(200, userSummaryDoc, "Video summaries saved successfully under topic")
  );
});




// Fetch user history
const getUserSummaries = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log("User Id", userId);

  // const userSummaries = await Summary.findMany({ userId });
  const userSummaries = await Summary.find({ userId })

  if (!userSummaries || userSummaries.length === 0) {
    return res.status(404).json(
      new ApiResponse(404, [], "No summaries found for this user")
    );
  }
  console.log("User Summaries", userSummaries);


  return res.status(200).json(
    new ApiResponse(200, userSummaries, "User summaries fetched successfully")
  );
});


// Rank summaries using LLaMA
const rankSummariesWithLLaMA = async (summaries) => {
  console.log("🧠 Starting ranking of summaries...");

  if (!Array.isArray(summaries) || summaries.length === 0) {
    console.warn("⚠️ No summaries provided for ranking");
    return [];
  }

  const formatted = summaries
    .map((s, idx) => `${idx + 1}. ${s.summary}`)
    .join("\n\n");

  console.log("📋 Summaries to rank:\n", formatted);

  const prompt = `
You are a helpful assistant. Given the following YouTube video summaries, rank them from best to worst based on their clarity, coherence, informativeness, and how well they capture the core message of the video.

Summaries:
${formatted}

Respond with a list of numbers in the ranked order, like: [3, 1, 2]`;

  try {
    console.log("📤 Sending prompt to LLaMA API...");
    const res = await axios.post(process.env.API_URL, {
      model: "llama3",
      prompt,
      stream: false,
    });

    const raw = res.data.response.trim();
    console.log("📥 Raw LLaMA response:", raw);

    const match = raw.match(/\[(.*?)\]/);
    if (!match) throw new Error("❌ Ranking not found in response");

    const rankingOrder = match[1]
      .split(",")
      .map((n) => parseInt(n.trim()) - 1);

    console.log("🔢 Parsed ranking order (0-based):", rankingOrder);

    const rankedSummaries = rankingOrder.map((rank, i) => {
      const ranked = {
        ...summaries[rank],
        ranking: summaries.length - i,
      };
      console.log(`🏆 Rank ${ranked.ranking}: VideoID ${ranked.videoId}`);
      return ranked;
    });

    console.log("✅ Ranking complete");
    return rankedSummaries;

  } catch (err) {
    console.error("❌ Ranking failed:", err.message);
    return summaries.map((s, i) => ({ ...s, ranking: 1 }));
  }
};

export {
  saveSummary,
  getUserSummaries,
  summarizeVideos,
  summarizeLargeText,
  getVideos,
  getManualVideo,
  getHistory,
  getVideoDetailsFromLink
};
