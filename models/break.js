const mongoose = require("mongoose");
const breakSchema = new mongoose.Schema({
    name: String,
    time: Number,

    live: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Live"
    },
    order: Number
});

breakSchema.post("findOneAndDelete", async function (doc) {
    const Live = require("./live");
    const Break = require("./break");
    const live = await Live.findById(doc.live);
    
    console.log("休憩を削除しようとしている");
    if (doc) {
        await Live.findByIdAndUpdate(doc.live, { $pull: { breaks: doc._id } });
    }
    await live.save();
});

module.exports = mongoose.model("Break", breakSchema);