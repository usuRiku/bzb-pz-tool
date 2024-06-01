const mongoose = require("mongoose");
const Band = require("./band");
const liveSchema = new mongoose.Schema({
    name: String,
    date: Date,
    location: String,
    time: String,
    playlistUrl: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    bands: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Band"
        }
    ]
});

liveSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        console.log("ライブを削除しようとしている", doc.bands);
        for (let band of doc.bands){
            await Band.findByIdAndDelete(band);
        }
    }
});

module.exports = mongoose.model("Live", liveSchema);
