Live = require("../models/live");

module.exports.index = (req, res) => {
    res.render("light/index");
}

module.exports.lives = async (req, res) => {
    const lives = await Live.find({}).sort({ date: -1 });
    res.render("light/liveIndex", { lives });
};

module.exports.showLive = async (req, res) => {
    const live = await Live.findById(req.params.liveId).populate({
        path: "bands",
        populate: {
            path: "songs"
        }
    });
    if (!live) {
        req.flash("error", "ライブが存在しません");
        return res.redirect(`/admin/live-management`);
    }
    res.render("light/liveShow", { live });
};
