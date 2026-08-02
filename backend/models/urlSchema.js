import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({

    userId: {
        type: String, // Clerk user ID
        required: true,
    },

    shortCode: {
        type: String,
        unique: true,
        required: true
    },

    longURL: {
        type: String,
        required: true
    },

    clicks: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});


export default mongoose.model("Shortened_urls", urlSchema);