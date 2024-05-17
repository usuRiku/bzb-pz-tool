const User = require("../models/user");
const bcrypt = require('bcryptjs');
module.exports.index = async (req, res) => {
    const user = await User.findById(req.params.userId).populate({
        path: "bands",
        populate: {
            path: "live"
        }
    });
    
    res.render("myPage/index", { user });
};

module.exports.delete = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.userId);
    req.flash("success", "ユーザーを削除しました");
    res.redirect(`/lives`);
};

module.exports.edit = async (req, res) => {
    const {grade,circleName, email, password} = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({email});
    if (userExists) {
        req.flash("error", "このメールアドレスは既に登録されています");
        return res.redirect(`/mypage/${req.session.user._id}`);
    }
    const validPassword = await bcrypt.compare(password, req.session.user.password);
    if (!validPassword) {
        req.flash("error", "パスワードが間違っています．");
        return res.redirect(`mypage/${req.session.user._id}`);
    }
    // Hash the password
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store in the user
    const user = await User.findByIdAndUpdate(req.session.user._id, {grade, circleName, email} );
    console.log(req.session.user._id);
    user.password = hashedPassword;
    user.save()
    req.session.user = user;
    req.flash("success", `ユーザー情報を更新しました`);
    res.redirect(`/mypage/${req.session.user._id}`);
};