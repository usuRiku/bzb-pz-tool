const Live = require("../models/live");
const Band = require("../models/band");
const Kuroshiro = require("kuroshiro").default;
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
const natural = require('natural');
const metaphone = natural.Metaphone;
const DEFAULT_MIC_NUMBERS = ['6','5','4','3','2','1'];
const DEFAULT_MIC_PARTS = ['サード','セカンド','トップ','リード','ベース','ボイパ'];

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
    console.log('createLive req.body.live =', req.body.live);
    const live = new Live(req.body.live);
    const kuroshiro = new Kuroshiro();
    await kuroshiro.init(new KuromojiAnalyzer());
    live.hiraganaName = await kuroshiro.convert(live.name, { to: "hiragana" });
    live.breaks = [];
    live.statues = 1
    // Ensure micNumber / micPart defaults are present when not provided or empty
    if (!live.micNumber || !Array.isArray(live.micNumber) || live.micNumber.filter(v => v && String(v).trim() !== '').length === 0) {
        live.micNumber = DEFAULT_MIC_NUMBERS.slice();
    }
    if (!live.micPart || !Array.isArray(live.micPart) || live.micPart.filter(v => v && String(v).trim() !== '').length === 0) {
        live.micPart = DEFAULT_MIC_PARTS.slice();
    }
    await live.save();
    console.log('saved Live:', live._id, 'micNumber=', live.micNumber, 'micPart=', live.micPart);
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
    // If form omitted micNumber/micPart or sent empty values, fill defaults before update
    if (!req.body.live) req.body.live = {};
    console.log('edit req.body.live =', req.body.live);
    if (!req.body.live.micNumber || !Array.isArray(req.body.live.micNumber) || req.body.live.micNumber.filter(v => v && String(v).trim() !== '').length === 0) {
        req.body.live.micNumber = DEFAULT_MIC_NUMBERS.slice();
    }
    if (!req.body.live.micPart || !Array.isArray(req.body.live.micPart) || req.body.live.micPart.filter(v => v && String(v).trim() !== '').length === 0) {
        req.body.live.micPart = DEFAULT_MIC_PARTS.slice();
    }
    await Live.updateOne(live, req.body.live);
    res.redirect(`/lives`);
};

module.exports.renderSearchResult = async (req, res) => {
    const livename = req.query.livename;
    const location = req.query.location;
    const year = req.query.year;
    const date_start = req.query.date_start;
    const date_end = req.query.date_end;

    const kuroshiro = new Kuroshiro();
    await kuroshiro.init(new KuromojiAnalyzer());
    const katakana = await kuroshiro.convert(livename, { to: "katakana" });
    
    let lives = await Live.find({
        $and: [
        {
            $or: [
                { katakanaName: { $regex: katakana } },
                { name: { $regex: new RegExp(livename, "i") } }
            ]
        }, 
        {
            $or: [
                { location: { $regex: location } }
            ]
        },
        {
            $or: [
                {
                    date: {
                        $gt: new Date(`${year}-01-01T00:00:00+09:00`), 
                        $lt: new Date(`${year}-12-31T23:59:59+09:00`)
                    }
                }
            ]    
        }
        ]
    }).sort({ date: -1 });
    res.render("lives/search/result", { lives, livename });
}