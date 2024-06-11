const User = require("../models/user");
const bcrypt = require('bcryptjs');
module.exports.index = async (req, res) => {
    const user = await User.findById(req.params.userId).populate({
        path: "bands",
        populate: {
            path: "live"
        }
    });
    if (!user) {
        req.flash("error", "ユーザーが存在しません");
        return res.redirect(`/lives`);
    };
    user.bands = user.bands.reverse();
    res.render("myPage/index", { user });
};

module.exports.delete = async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (!user) {
        req.flash("error", "ユーザーが存在しません");
        return res.redirect(`/lives`);
    }
    is_adminUser = true
    if (req.session.user.email !== "admin@admin.com") {
        is_adminUser = false;
        req.session.destroy();
    }
    await User.findOneAndDelete(user);
    req.flash("success", "ユーザーを削除しました");
    
    if (is_adminUser) {
        return res.redirect("/admin/user-management")
    }
    res.redirect(`/lives`);
};

module.exports.edit = async (req, res) => {
    const { grade, circleName, email, password } = req.body;
    const accountUser = await User.findById(req.params.userId);
    if (!accountUser) {
        req.flash("error", "ユーザーが存在しません");
        return res.redirect(`/lives`);
    }

    const validPassword = await bcrypt.compare(password, accountUser.password);
    if (!validPassword) {
        req.flash("error", "パスワードが間違っています．");
        return res.redirect(`/mypage/${accountUser._id}`);
    }
    const user = await User.findByIdAndUpdate(accountUser._id, { $set :{ grade, circleName }} );
    await user.save();
    const editedUser = await User.findById(user._id);
    req.session.user = editedUser;
    req.flash("success", `ユーザー情報を更新しました`);
    res.redirect(`/mypage/${accountUser._id}`);
};