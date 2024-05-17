const express = require("express");
const router = express.Router();
const myPages = require("../controllers/myPages");
const { isLoggedIn , hasUserAuthority} = require("../middleware");
const { catchAsync } = require("../utils/catchAsync");

router.route("/:userId")
    .get(isLoggedIn, hasUserAuthority, catchAsync(myPages.index))
    .delete(isLoggedIn, hasUserAuthority, catchAsync(myPages.delete))
    .put(isLoggedIn, hasUserAuthority, catchAsync(myPages.edit));

module.exports = router;