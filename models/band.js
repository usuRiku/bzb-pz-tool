const mongoose = require("mongoose");
const Song = require("./song");
const Live = require("./live");
const bandSchema = new mongoose.Schema({
    name: String,
    leader: String,
    se: String,
    seArtist: String,
    time: Number,
    songNumber: Number,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song"
        }
    ],
    live: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Live"
    },
    order: Number
});

bandSchema.post("findOneAndDelete", async function (doc) {
    console.log("バンドを削除しようとしている", doc.songs);
    if (doc) {
        await Song.deleteMany({
            _id: {
                $in: doc.songs
            }
        });
        await Live.findByIdAndUpdate(doc.live, { $pull : { bands: doc._id }});
    }
});

module.exports = mongoose.model("Band", bandSchema);
