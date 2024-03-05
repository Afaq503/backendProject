import mongoose, {Schema} from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const vidoeSchema = new Schema({
    videoFile:{
        type: String, // cloudiinary url
        required: true,
    },
    thumbnail:{
        type: String, // cloudiinary url
        required: true,
    },
    title:{
        type: String, 
        required: true,
    },
    description:{
        type: String, 
        required: true,
    },
    duration:{
        type: Number, // cloudinary 
        required: true
    },
    view:{
        type: Number,
        default: 0
    },
    isPublished:{
        type: Boolean,
        default: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})

vidoeSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", vidoeSchema)