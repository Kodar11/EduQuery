import { Router } from "express";
import { 
    saveSummary,
    getUserSummaries,
    summarizeVideos,
    summarizeLargeText,
    getVideos,
    getManualVideo,
    getHistory,
    getVideoDetailsFromLink
} from "../controllers/analyze.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();


router.route("/save-summaries").post(verifyJWT,saveSummary);
// router.route("/history").get(verifyJWT, getUserSummaries);
router.route("/summarize-videos").post(summarizeVideos);
router.post('/summary', summarizeLargeText);


router.route("/videos").get( getVideos); 
router.route("/manual-videos").get(verifyJWT, getManualVideo); 
router.route("/history").get(verifyJWT, getHistory); 
router.post("/video-from-link", getVideoDetailsFromLink);


router.route("/protected-route").get(verifyJWT, (req, res) => {
    return res.status(200).json();
});

export default router;
