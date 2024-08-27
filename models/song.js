const mongoose = require("mongoose");
const songSchema = new mongoose.Schema({
    song: {
        type: String,
        default: "入力無し"
    },
    isMc: {
        type: String,
        default: "入力無し"
    },
    micNumber: [
        {
            type: String,
            default: [6,5,4,3,2,1]
        }
    ],
    part: [
        {
            type: String,
            default:["3rd","2nd","1st","Lead","Bass","VP"]
        }
    ],
    member: [
        {
            type: String,
            default: ["","","","","",""]
        }
    ],
    mainSpeaker: {
        type: String,
        default: "特になし"
    },
    returnSpeaker: {
        type: String,
        default: "特になし"
    },
    nuance: {
        type: String,
        default: "特になし"
    },
    otherRequests: {
        type: String,
        default: "特になし"
    },
    requests: { //新しい要望欄　ここにすべて格納する
        type: String
    },
    tempo: {
        type: Number
    }
});

module.exports = mongoose.model("Song", songSchema);