import mongoose, { Schema } from "mongoose";

// const summarySchema = new Schema(
//     {
//         userId: {
//             type: Schema.Types.ObjectId,
//             ref: "User"
//         },
//         videos: [
//             {
//                 videoName: String,
//                 videoLink: String,
//                 summary: String,
//                 topicsCovered : [String]
//             }
//         ],
//         commonTopic: [String],
//         rareTopic: [String],


//     },

// )


const summarySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    topics: [
        {
            topic_name: {
                type: String,
                required: true
            },
            videos: [
                {
                    videoName: String,
                    videoLink: String,
                    summary: String,
                    // topicsCovered: [String]
                    commonTopics: [String],
                    rareTopics: [String]
                }
            ],
            // commonTopic: [String],
            // rareTopic: [String]
        }
    ]
});


export const Summary = mongoose.model("Summary", summarySchema)