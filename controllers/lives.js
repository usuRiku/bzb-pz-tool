const Live = require("../models/live");
const Band = require("../models/band");
const mongoose = require("mongoose");

module.exports.index = async (req, res) => {
    const lives = await Live.find({});
    res.render("lives/index", { lives });
};

module.exports.renderNewForm =  (req, res) => {
    res.render("lives/new");
};

module.exports.showLive = async (req, res) => {
    const { liveId } = req.params;
    const live = await Live.findById(liveId).populate("bands");
    if (!live) {
        req.flash("error", "ライブが存在しません");
        return res.redirect(`/lives`);
    }
    res.render("lives/show", { live });
};

module.exports.createLive = async (req, res) => {
    const live = new Live(req.body.live);
    await live.save();
    res.redirect("/lives");
};

module.exports.exchangeBandOrder = async (req, res) => {
    console.log("順番変更しました");
    const { liveId } = req.params;
    const live = await Live.findById(liveId).populate("bands");
    live.bands = req.body;
    console.log(live.bands[0]);
    for (let i = 1; i <= live.bands.length; i++){
        const band = await Band.findById(live.bands[i-1]._id);
        band.order = i;
        await band.save();
    }
    await live.save();
    console.log(live.bands);
};

module.exports.delete = async (req, res) => {
    const { liveId } = req.params;
    const live = await Live.findById(liveId);
    if (!live) {
        req.flash("error", "ライブが存在しません");
        return res.redirect(`/lives`);
    }
    await Live.deleteOne(live);
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

};