const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");
const { isLoggedIn, hasAdminAuthority } = require("../middleware");
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
    .get(isLoggedIn, hasAdminAuthority, catchAsync(admin.showBand));

router.route("/:liveId/playlist")
    .get(isLoggedIn, hasAdminAuthority, catchAsync(admin.renderPlaylist))
    .put(isLoggedIn, hasAdminAuthority, catchAsync(admin.editPlaylist));
module.exports = router;

router.route("/:liveId/login/spotify")
    .post(isLoggedIn, hasAdminAuthority, admin.loginSpotify);