const mongoose = require("mongoose");
const Band = require("./band");
const liveSchema = new mongoose.Schema({
    name: String,
    katakanaName : String,
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
    ],
    breaks:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Break"
        }
    ],
    statues : Number,
    micNumber: {
        type: [String],
        default: ['6','5','4','3','2','1']
    },
    micPart: {
        type: [String],
        default: ['サード','セカンド','トップ','リード','ベース','ボイパ']
    }
    
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
