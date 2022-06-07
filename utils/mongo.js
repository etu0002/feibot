import { config } from "./config.js"
import mongoose from "mongoose"

export const connect = () => mongoose.connect(`mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`)

export default mongoose