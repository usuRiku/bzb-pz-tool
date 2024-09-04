const Live = require("../models/live");
const Band = require("../models/band");
const User = require("../models/user");
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyId = process.env.SPOTIFY_CLIENT_ID
const spotifySecret = process.env.SPOTIFY_CLIENT_SECRET
const spotifyCallback = process.env.SPOTIFY_CALLBACK

module.exports.index = (req, res) => {
    res.render("admin/index");
};

module.exports.renderLiveManagement = async (req, res) => {
    const lives = await Live.find({}).sort({ date: -1 });
    res.render("admin/liveManagement", { lives });
}

module.exports.renderUserManagement = async (req, res) => {
    const users = await User.find({});
    res.render("admin/userManagement", { users });
}

module.exports.renderLiveIndex = async (req, res) => {
    const lives = await Live.find({}).sort({ date: -1 });
    res.render("admin/liveIndex", { lives });
};

module.exports.showLive = async (req, res) => {
    const live = await Live.findById(req.params.liveId).populate("bands");
    if (!live) {
        req.flash("error", "ライブが存在しません");
        return res.redirect(`/admin/live-management`);
    }
    res.render("admin/liveShow", { live });
};

module.exports.showBand = async (req, res) => {
    const band = await Band.findById(req.params.bandId).populate().populate("songs").populate("author").populate("live");
    if (!band) {
        req.flash("error", "PA表が存在しません");
        return res.redirect(`/admin/live/${req.params.liveId}`);
    }
    const forwardBand = await Band.findOne({ live: req.params.liveId, order: band.order - 1 });
    const nextBand = await Band.findOne({ live: req.params.liveId, order: band.order + 1 });
    res.render("admin/bandShow", { band, forwardBand, nextBand });
};

module.exports.renderPlaylist = async (req, res) => {
    const live = await Live.findById(req.params.liveId).populate("bands");
    if (!live) {
        req.flash("error", "ライブが存在しません");
        return res.redirect(`/admin/live-management`);
    }
    res.render("admin/playlistShow", { live })
};

module.exports.editPlaylist = async (req, res) => {
    const live = await Live.findById(req.params.liveId).populate("bands");
    if (!live) {
        req.flash("error", "ライブが存在しません");
        return res.redirect(`/admin/live-management`);
    }
    const trackPattern = new RegExp("(?<=track/)[a-zA-Z0-9]{22}");
    const playlistPattern = new RegExp("(?<=playlist/)[a-zA-Z0-9]{22}");
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
    let playlist_songs_num;
    let array = [];
    spotifyApi.setAccessToken(req.session.specificAccessToken);
    res.locals.spotifyAccessToken = req.session.specificAccessToken;

    //プレイリスト情報を変更
    for (let i = 0; i < live.bands.length; i++){
        const band = await Band.findById(live.bands[i]._id);
        band.seUrl = seUrls[i][1];
        await band.save();
    }
    //プレイリストを取得
    spotifyApi.getPlaylist(playlistId)
        .then(function (data) {
            playlist_songs_num = data.body.tracks.items.length
            console.log('got playlist information', playlist_songs_num);
            for (let i = 0; i < playlist_songs_num; i++) {
                console.log(data.body.tracks.items[i])
                if (data.body.tracks.items[i].is_local === true) {
                    continue
                } else {
                    array.push(i);
                }   
            }
            //前のプレイリストデータを削除

            spotifyApi.removeTracksFromPlaylistByPosition(playlistId, array)
                .then(function (data) {
                    console.log('Tracks removed from playlist!');
                    //最新のプレイリスト情報を追加
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
                }, function (err) {
                    //最新のプレイリスト情報を追加
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
                });
        }, function (err) {
            console.log('Something went wrong!', err);
        });
};

module.exports.loginSpotify = (req, res) => {
    req.session.now_live = req.params.liveId;
    res.redirect(`https://accounts.spotify.com/authorize?client_id=${spotifyId}&redirect_uri=${spotifyCallback}&response_type=code&scope=playlist-modify-private%20playlist-modify-public`);
}