import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Tweet } from "../models/tweet.models.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

const createTweet = asynchandler(async (req, res) => {
  //TODO: create tweet
  // first get user
  // Check if user is logged in
  const { content } = req.body;
  if (!content || typeof content !== "string")
    throw new ApiError(400, "Content is required");

  const tweet = await Tweet.create({
    content,
    owner: req.user?._id,
  });
  if (!tweet) throw new ApiError(500, "Server Error while creating tweet");

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet is created successfully"));
});

const getUserTweets = asynchandler(async (req, res) => {
  // TODO: get user tweets
  const tweets = await Tweet.find({ owner: req.user._id });

  if (tweets.length === 0) {
    throw new ApiError(404, "No Tweets Found!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, tweets.reverse(), "Tweets fetched Successfully")
    );

  
});

const updateTweet = asynchandler(async (req, res) => {
  //TODO: update tweet
  const { content } = req.body;
  const tweet = await Tweet.findOneAndUpdate(
    { _id: req.params.id, owner: req.user?._id },
    {
      $set: {
        content: content,
      },
    },
    { new: true }
  );
  console.log(req.params.id);
  console.log(`check tweet: ${tweet}`);

  if (!tweet) {
    throw new ApiError(500, "Something went wrong while updating tweet");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet has been updated succesfully."));
 
});

const deleteTweet = asynchandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  console.log(tweetId,"this is tweet iD");
  if (!tweetId) throw new ApiError(400, "Invalid request to delete tweet");
  const tweet = await Tweet.findOneAndDelete({
    _id: tweetId,
    owner: req.user._id,
  });
  if (!tweet) {
    throw new ApiError(500, "Something went wrong while deleting tweet.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
