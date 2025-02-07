const Live = require("../models/live");
const Band = require("../models/band");

module.exports.index = async (req, res) => {
    const lives = await Live.find({}).sort({ date: -1 });
    res.render("lives/index", { lives });
};

module.exports.renderNewForm =  (req, res) => {
    res.render("lives/new");
};

module.exports.showLive = async (req, res) => {
    const { liveId } = req.params;
    const live = await Live.findById(liveId).populate({
        path: "bands",
        populate: {
            path: "songs"
        }
    }).populate("breaks");
    if (!live) {
        req.flash("error", "ライブが存在しません");
        return res.redirect(`/lives`);
    }
    if (live.statues === 1) {
        res.render("lives/show", { live });
    } else if (live.statues === 2) {
        res.render("lives/show_ready_to_go", {live});
    } else if (live.statues === 3) {
        res.render("lives/currently_live", {live});
    } else if (live.statues === 4) {
        res.render("lives/archive", {live});
    }
};

module.exports.createLive = async (req, res) => {
    const live = new Live(req.body.live);
    live.breaks = [];
    live.statues = 1
    await live.save();
    res.redirect("/lives");
};

module.exports.exchangeBandOrder = async (req, res, next) => {
    const { liveId } = req.params;
    const live = await Live.findById(liveId).populate("bands");
    live.bands = req.body;
    for (let i = 1; i <= live.bands.length; i++){
        const band = await Band.findById(live.bands[i-1]._id);
        band.order = i;
        await band.save();
    }
    await live.save();
    console.log(live.bands);
    console.log("順番変更しました");
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send({ "live": live });
};

module.exports.delete = async (req, res) => {
    const { liveId } = req.params;
    const live = await Live.findById(liveId);
    if (!live) {
        req.flash("error", "ライブが存在しません");
        return res.redirect(`/lives`);
    }
    await Live.findOneAndDelete(live);
    req.flash("success", "Liveを削除しました");
    res.redirect(`/lives`);
};

module.exports.renderEditForm = async (req, res) => {
    const live = await Live.findById(req.params.liveId);
    if (!live) {
        req.flash("error", "ライブが存在しません");
        return res.redirect(`/lives`);
    }
    res.render("lives/edit", {live});
};

module.exports.edit = async (req, res) => {
    const live = await Live.findById(req.params.liveId);
    if (!live) {
        req.flash("error", "ライブが存在しません");
        return res.redirect(`/lives`);
    }
    await Live.updateOne(live, req.body.live);
    res.redirect(`/lives`);
};