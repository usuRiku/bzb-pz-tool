const Band = require("./models/band");
const User = require("./models/user");

module.exports.isLoggedIn = ((req, res, next) => {
    if (!User.isAuthenticated(req)) {
        req.flash("error", "ログインしてください");
        return res.redirect("/login");
    }
    next();
});

module.exports.hasCreateBandAuthority = async (req, res, next) => {
    if (req.session.user.email === "light@light.com") {
        req.flash("error", "照明班アカウントではPA表を作成できません.別アカウントでログインしなおしてください.")
        return res.redirect(`/lives/${req.params.liveId}`);
    }
    next();
}

module.exports.hasEditBandAuthority = async (req, res, next) => {
    const band = await Band.findById(req.params.bandId).populate("songs").populate("author");
    try {
        if (!(req.session.user.email === "admin@admin.com") && !band.author.equals(req.session.user._id)) {
            req.flash("error", `${req.session.user.circleName}にはそのアクションを行う権限がないため，アクセスできません`);
            return res.redirect("/lives");
        }
    } catch {
        req.flash("error", "ログインしてください");
        return res.redirect("/login");
    }
    next();
};

module.exports.hasAdminAuthority = async (req, res, next) => {
    try {
        if (!(req.session.user.email === "admin@admin.com")) {
            req.flash("error", `${req.session.user.circleName}には管理者権限がないため，アクセスできません`);
            return res.redirect("/lives");
        }
        
    } catch {
        req.flash("error", "ログインしてください");
        return res.redirect("/login");
    }
    next();
};

module.exports.hasUserAuthority = async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    if (!user) {
        req.flash("error", "ユーザーが見つかりません");
        return res.redirect("/lives");
    }
    if (!(req.session.user.email === "admin@admin.com") && !user.equals(req.session.user._id)) {
        req.flash("error", `${req.session.user.circleName}にはそのアクションを行う権限がないため，アクセスできません`);
        return res.redirect("/lives");
    }
    next();
};

module.exports.hasLightAuthority = async (req, res, next) => {
    const user = await User.findById(req.session.user._id);
    if (!user) {
        req.flash("error", "ユーザーが見つかりません");
        return res.redirect("/lives");
    }
    if (!(req.session.user.email === "admin@admin.com") && !(req.session.user.email === "light@light.com")) {
        req.flash("error", `${req.session.user.circleName}にはそのアクションを行う権限がないため，アクセスできません`);
        return res.redirect("/lives");
    }
    next();
};
