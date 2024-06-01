const mongoose = require("mongoose");
const bandSchema = new mongoose.Schema({
    name: String,
    leader: String,
    se: String,
    seUrl: String,
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
    const Song = require("./song");
    const Live = require("./live");
    const User = require("./user");
    console.log("バンドを削除しようとしている", doc.songs);
    if (doc) {
        await Song.deleteMany({
            _id: {
                $in: doc.songs
            }
        });
        await Live.findByIdAndUpdate(doc.live, { $pull : { bands: doc._id }});
        await User.findByIdAndUpdate(doc.author, { $pull : { bands: doc._id }});
        console.log("doc:", doc._id);
    }
});

module.exports = mongoose.model("Band", bandSchema);
