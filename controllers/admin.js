const Live = require("../models/live");
const Band = require("../models/band");
const User = require("../models/user");
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyId = process.env.SPOTIFY_CLIENT_ID
const spotifySecret = process.env.SPOTIFY_CLIENT_SECRET
const spotifyCallback = process.env.SPOTIFY_CLIENT_CALLBACK

module.exports.index = (req, res) => {
    res.render("admin/index");
};

module.exports.renderLiveManagement = async (req, res) => {
    const lives = await Live.find({});
    res.render("admin/liveManagement", { lives });
}

module.exports.renderUserManagement = async (req, res) => {
    const users = await User.find({});
    res.render("admin/userManagement", { users });
}

module.exports.renderLiveIndex = async (req, res) => {
    const lives = await Live.find({});
    res.render("admin/liveIndex", { lives });
};

module.exports.showLive = async (req, res) => {
    const live = await Live.findById(req.params.liveId).populate("bands");
    res.render("admin/liveShow", { live });
};

module.exports.showBand = async (req, res) => {
    const band = await Band.findById(req.params.bandId).populate().populate("songs").populate("author").populate("live");
    const forwardBand = await Band.findOne({ live: req.params.liveId, order: band.order - 1 });
    const nextBand = await Band.findOne({ live: req.params.liveId, order: band.order + 1 });
    res.render("admin/bandShow", { band, forwardBand, nextBand });
};

module.exports.renderPlaylist = async (req, res) => {
    const live = await Live.findById(req.params.liveId).populate("bands");
    res.render("admin/playlistShow", { live })
};

module.exports.editPlaylist = async (req, res) => {
    const live = await Live.findById(req.params.liveId);
    const trackPattern = new RegExp("(?<=track/).*");
    const playlistPattern = new RegExp("(?<=playlist/).*");
    seUrls = Object.entries(req.body);
    seIds = []
    for (let i = 0; i < seUrls.length; i++) {
        result = seUrls[i][1].match(trackPattern);
        if (result) {
            seIds.push("spotify:track:" + result[0])
        }
    }
    playlistId = live.playlistUrl.match(playlistPattern);
    const spotifyApi = new SpotifyWebApi({
        clientId: spotifyId,
        clientSecret: spotifySecret,
        redirectUri: spotifyCallback
    });
    spotifyApi.setAccessToken(req.session.specificAccessToken);
    spotifyApi.addTracksToPlaylist(playlistId, seIds)
        .then(function (data) {
            console.log('Added tracks to playlist!');
            req.flash("success", "プレイリストを更新しました");
            res.redirect(`/admin/${req.params.liveId}/playlist`);
        }, function (err) {
            console.log('Something went wrong!', err);
            req.flash("error", "プレイリストの更新に失敗しました．spotifyログイン情報がプレイリスト所有者のものか確認してください．");
            res.redirect(`/admin/${req.params.liveId}/playlist`);
        });

};

module.exports.loginSpotify = (req, res) => {
    req.session.now_live = req.params.liveId;
    res.redirect(`https://accounts.spotify.com/authorize?client_id=${spotifyId}&redirect_uri=http://localhost:3000/login/spotify&response_type=code&scope=playlist-modify-private%20playlist-modify-public`);
}