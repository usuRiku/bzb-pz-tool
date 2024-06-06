const express = require("express");
const router = express.Router();
const mails = require("../controllers/mails/mails");
const { isLoggedIn, hasUserAuthority} = require("../middleware");
const { catchAsync } = require("../utils/catchAsync");

router.route("/resetPassword/:userId")
    .post(isLoggedIn, hasUserAuthority, catchAsync(mails.sendPasswordResetMail));

module.exports = router;