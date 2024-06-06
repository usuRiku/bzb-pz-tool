const express = require("express");
const router = express.Router();
const mails = require("../controllers/mails/mails");
const auth = require("../controllers/auth");
const { isLoggedIn, hasUserAuthority } = require("../middleware");
const { catchAsync } = require("../utils/catchAsync");

router.route("/forgotPassword")
    .post(catchAsync(mails.sendPasswordResetMail))
    .get(catchAsync(mails.renderPasswordResetForm));

router.route("/resetPassword")
    .post(catchAsync(auth.resetPassword));

router.route("/forgotPassword/form")
    .get(mails.renderPasswordMailForm);

module.exports = router;