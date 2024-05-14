const Live = require("../models/live");
const Band = require("../models/band");
const User = require("../models/user");
module.exports.index = (req, res) => {
    res.render("admin/index");
};

module.exports.renderLiveManagement = async(req, res) => {
    const lives = await Live.find({});
    res.render("admin/liveManagement", {lives});
}

module.exports.renderUserManagement = async (req, res) => {
    const users = await User.find({});
    res.render("admin/userManagement", {users});
}

module.exports.renderLiveIndex = async (req, res) => {
    const lives = await Live.find({});
    res.render("admin/liveIndex", {lives});
};

module.exports.showLive = async (req, res) => {
    const live = await Live.findById(req.params.liveId).populate("bands");
    res.render("admin/liveShow", {live});
};

module.exports.showBand = async (req, res) => {
    const band = await Band.findById(req.params.bandId).populate().populate("songs").populate("author").populate("live");
    const forwardBand = await Band.findOne({ live: req.params.liveId, order: band.order -1 });
    const nextBand = await Band.findOne({ live: req.params.liveId, order: band.order + 1 });
    res.render("admin/bandShow", {band, forwardBand, nextBand});
};