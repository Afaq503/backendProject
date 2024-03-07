// import mongoose, {isValidObjectId} from "mongoose"
// import {Video} from "../models/video.model.js"
// import {User} from "../models/user.model.js"
// import { ApiError } from "../utils/Apierror.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { asynchandler } from "../utils/asynchandler.js"


const getAllVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asynchandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asynchandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}