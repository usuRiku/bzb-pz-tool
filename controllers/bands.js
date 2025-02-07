const Band = require("../models/band");
const Live = require("../models/live");
const Song = require("../models/song");
const User = require("../models/user");

module.exports.createBand = async (req, res) => {
    const live = await Live.findById(req.params.liveId);
    if (!live) {
        req.flash("error", "ライブが存在しません");
        return res.redirect(`/lives`);
    }
    const band = new Band(req.body.band);
    const oglive = await Live.findById(req.params.liveId);
    band.order = oglive.bands.length + 1;
    await band.save();
    band.author = req.session.user._id;
    band.live = req.params.liveId;
    for (let i = 0; i < req.body.band.songNumber; i++){
        const songObject = {
            song: req.body.band.song[i],
            isMc: req.body.band.isMc[i],
            micNumber: req.body.band.micNumber[i],
            part: req.body.band.part[i],
            member: req.body.band.member[i],
            nuance: req.body.band.nuance[i],
            requests: req.body.band.requests[i],
            tempo: req.body.band.tempo[i]
        }
        const song = new Song(songObject);
        band.songs.push(song);
        await song.save();
        await band.save();
    }
    const user = await User.findById(req.session.user._id);
    user.bands.push(band)
    live.bands.push(band);
    await band.save();
    await live.save();
    await user.save();
    req.flash("success", "PA表を作成しました");
    res.redirect(`/lives/${live._id}/${band._id}`);
};

module.exports.renderNewForm = async(req, res) => { 
    const { liveId } = req.params;
    const live = await Live.findById(liveId);
    const user = await User.findById(req.session.user._id).populate({
        path: "bands",
        populate: {
            path: "songs"
        }
    }).populate({
        path: "bands",
        populate: {
            path: "live"
        }
    });
    if (!live) {
        req.flash("error", "ライブが存在しません");
        return res.redirect(`/lives`);
    }
    res.render("bands/new", { live, user });
};

module.exports.renderEditForm = async(req, res) => {
    const { bandId } = req.params;
    const band = await Band.findById(bandId).populate("songs").populate("live");
    const user = await User.findById(req.session.user._id).populate({
        path: "bands",
        populate: {
            path: "songs"
        }
    }).populate({
        path: "bands",
        populate: {
            path: "live"
        }
    });
    if (!band) {
        req.flash("error", "バンドが存在しません");
        return res.redirect(`/lives/${req.params.liveId}`);
    }
    res.render("bands/edit", { band , user});
};

module.exports.edit = async (req, res) => {
    let band = await Band.findById(req.params.bandId);
    if (!band) {
        req.flash("error", "バンドが存在しません");
        return res.redirect(`/lives/${req.params.liveId}`);
    }
    await Band.updateOne(band, req.body.band);
    band.live = req.params.liveId;
    for (let song of band.songs) {
        await Song.findByIdAndDelete(song)
    }
    band.songs.splice(0);
    for (let i = 0; i < 10; i++){
        if (req.body.band.song[i] === "") {
            break;
        }
        const songObject = {
            song: req.body.band.song[i],
            isMc: req.body.band.isMc[i],
            micNumber: req.body.band.micNumber[i],
            part: req.body.band.part[i],
            member: req.body.band.member[i],
            nuance: req.body.band.nuance[i],
            requests: req.body.band.requests[i],
            tempo: req.body.band.tempo[i],
        }
        const song = new Song(songObject);
        band.songs.push(song);
        await song.save();
        await band.save();
    }
    await band.save();
    req.flash("success", "PA表を編集しました");
    res.redirect(`/lives/${req.params.liveId}/${band._id}`);
};

module.exports.showBand = async(req, res) => {
    const band = await Band.findById(req.params.bandId).populate("songs").populate("author");
    if (!band) {
        req.flash("error", "バンドが存在しません");
        return res.redirect(`/lives/${req.params.liveId}`);
    }
    res.render("bands/show", { band } );
};

module.exports.delete = async (req, res) => {
    const { bandId } = req.params;
    const band = await Band.findById(bandId);
    if (!band) {
        req.flash("error", "バンドが存在しません");
        return res.redirect(`/lives/${req.params.liveId}`);
    }
    await Band.findByIdAndDelete(bandId);
    req.flash("success", "PA表を削除しました");
    if (req.session.user.email === "admin@admin.com") {
        return res.redirect(`/admin/live/${req.params.liveId}`);
    }
    res.redirect(`/mypage/${req.session.user._id}`);
}