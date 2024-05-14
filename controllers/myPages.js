const User = require("../models/user");
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
}