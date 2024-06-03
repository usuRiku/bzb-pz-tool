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
    const Band = require("./band");
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
    }
    const bands = await Band.find({ live: doc.live });
    console.log(bands);
    for (let i = 0; i < (bands).length; i++){
        await Band.findByIdAndUpdate(bands[i]._id, { $set: { order: (i + 1) } });
    }
});

module.exports = mongoose.model("Band", bandSchema);