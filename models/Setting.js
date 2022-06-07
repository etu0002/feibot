import mongoose from "../utils/mongo.js"

const { Schema } = mongoose

const SettingSchema = new Schema({
    key: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
})

export default mongoose.model("Setting", SettingSchema)