const mongoose = require("mongoose");
const Song = require("./song");
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
    if (doc) {
        console.log("曲を削除しようとしている", doc.songs);
        await Song.deleteMany({
            _id: {
                $in: doc.songs
            }
        })
    }
});

module.exports = mongoose.model("Band", bandSchema);
