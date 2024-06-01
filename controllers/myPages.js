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
    } else {
        req.session.destroy();
    }
    await User.deleteOne(user);
    // req.flash("success", "ユーザーを削除しました");
    
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
    // Check if the user already exists
    const userExists = await User.findOne({email});
    if (userExists) {
        req.flash("error", "このメールアドレスは既に登録されています");
        return res.redirect(`/mypage/${accountUser._id}`);
    }
    const validPassword = await bcrypt.compare(password, accountUser.password);
    if (!validPassword) {
        req.flash("error", "パスワードが間違っています．");
        return res.redirect(`/mypage/${accountUser._id}`);
    }
    // Hash the password
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store in the user
    const user = await User.findByIdAndUpdate(accountUser._id, {grade, circleName, email} );
    user.password = hashedPassword;
    user.save()
    req.session.user = user;
    req.flash("success", `ユーザー情報を更新しました`);
    res.redirect(`/mypage/${accountUser._id}`);
};