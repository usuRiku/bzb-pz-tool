const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");
const { isLoggedIn, hasAdminAuthority, hasLightAuthority } = require("../middleware");
const { catchAsync } = require("../utils/catchAsync");

router.route("/")
    .get(isLoggedIn, hasAdminAuthority, admin.index);

router.route("/live-management")
    .get(isLoggedIn, hasAdminAuthority, catchAsync(admin.renderLiveManagement));

router.route("/user-management")
    .get(isLoggedIn, hasAdminAuthority, catchAsync(admin.renderUserManagement));

router.route("/live")
    .get(isLoggedIn, hasAdminAuthority, catchAsync(admin.renderLiveIndex));

router.route("/live/:liveId")
    .get(isLoggedIn, hasAdminAuthority, catchAsync(admin.showLive));

router.route("/live/:liveId/:bandId")
    .get(isLoggedIn, hasLightAuthority, catchAsync(admin.showBand));

router.route("/:liveId/playlist")
    .get(isLoggedIn, hasAdminAuthority, catchAsync(admin.renderPlaylist))
    .put(isLoggedIn, hasAdminAuthority, catchAsync(admin.editPlaylist));

router.route("/createBreak/:liveId")
    .post(isLoggedIn, hasAdminAuthority, catchAsync(admin.createBreak))

router.route("/editBreak/:liveId/:breakId")
    .put(isLoggedIn, hasAdminAuthority, catchAsync(admin.editBreak))

router.route("/deleteBreak/:liveId/:breakId")
    .delete(isLoggedIn, hasAdminAuthority, catchAsync(admin.deleteBreak));

router.route("/:liveId/login/spotify")
    .post(isLoggedIn, hasAdminAuthority, admin.loginSpotify);

module.exports = router;
