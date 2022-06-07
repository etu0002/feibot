import mongoose from "../utils/mongo.js"

const { Schema } = mongoose

const MessageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    room: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Message", MessageSchema)