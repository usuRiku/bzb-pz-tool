const express = require("express");
const router = express.Router();
const light = require("../controllers/light");
const { catchAsync } = require("../utils/catchAsync");
const { isLoggedIn, hasLightAuthority } = require("../middleware");

router.route("/")
    .get(isLoggedIn, hasLightAuthority, light.index);

router.route("/lives")
    .get(isLoggedIn, hasLightAuthority, light.lives);

router.route("/lives/:liveId")
    .get(isLoggedIn, hasLightAuthority, catchAsync(light.showLive));

module.exports = router;