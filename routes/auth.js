const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const { catchAsync } = require("../utils/catchAsync");

router.route("/register")
    .get(auth.renderNewForm)
    .post(catchAsync(auth.register));

router.route("/login")
    .get(auth.renderLoginForm)
    .post(catchAsync(auth.login));

// router.route("/line/login")
//     .get(catchAsync(passport.authenticate('line')));

// router.route("/line/login/callback")
//     .get(catchAsync(auth.lineLogin));
    
// router.route("/google/login")
//     .get(catchAsync(passport.authenticate('google' , {scope: ['email', 'profile']}, { failureFlash: true, failureRedirect: "/login" })));
    
// router.route("/google/login/callback")
//     .get(catchAsync(auth.googleLogin));
        
router.route("/logout")
    .get(catchAsync(auth.logout));
module.exports = router;