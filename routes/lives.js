const express = require("express");
const router = express.Router();
const lives = require("../controllers/lives");
const bands = require("../controllers/bands");
const { isLoggedIn, hasEditBandAuthority, hasAdminAuthority , hasCreateBandAuthority} = require("../middleware");
const { catchAsync } = require("../utils/catchAsync");

router.route("/")
    .get(catchAsync(lives.index))
    .post(catchAsync(lives.createLive));

router.route("/new")
    .get(isLoggedIn, hasAdminAuthority, lives.renderNewForm);

router.route("/:liveId/new")
    .get(isLoggedIn, hasCreateBandAuthority, catchAsync(bands.renderNewForm));

router.route("/:liveId/:bandId/edit")
    .get(isLoggedIn, hasEditBandAuthority, catchAsync(bands.renderEditForm));
    
router.route("/:liveId")
    .get(catchAsync(lives.showLive))
    .post(isLoggedIn, hasCreateBandAuthority, catchAsync(bands.createBand))
    .patch(isLoggedIn, hasAdminAuthority, catchAsync(lives.exchangeBandOrder))
    .delete(isLoggedIn, hasAdminAuthority, catchAsync(lives.delete))
    .put(isLoggedIn, hasAdminAuthority, catchAsync(lives.edit));
    
router.route("/:liveId/edit")
    .get(isLoggedIn, hasAdminAuthority, catchAsync(lives.renderEditForm));

router.route("/:liveId/:bandId")
    .get(isLoggedIn, hasEditBandAuthority,catchAsync(bands.showBand))
    .delete(isLoggedIn, hasEditBandAuthority, catchAsync(bands.delete))
    .put(isLoggedIn, hasEditBandAuthority, catchAsync(bands.edit));

module.exports = router;
