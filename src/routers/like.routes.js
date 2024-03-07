import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleVideoLike,
  toggleTweetLike,
} from "../controllers/likecontrollers.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export default router;
