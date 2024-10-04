const mail = require("nodemailer");
const zohoUser = process.env.ZOHO_USER
const zohoPass = process.env.ZOHO_PASSWORD
const jwtSecret = process.env.JWT_SECRET
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports.sendPasswordResetMail = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash("error", "ユーザーが存在しません");
        return res.redirect(`/lives`);
    };
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
    req.session.passwordResetToken = token;
    req.session.passwordResetExpires = Date.now() + 3600000;//一時間
    let resetUrl = "";
    if (process.env.NODE_ENV != "production") {
        resetUrl = `http://localhost:3000/mails/forgotPassword?token=${token}`;
    } else {
        resetUrl = `https://www.bzb-pa-tool.com/mails/forgotPassword?token=${token}`;
    }
    HTML =
    `
    <p>bzb-pa-toolのパスワードリセットをリクエストしました。以下のリンクをクリックしてパスワードをリセットしてください。<\p>
    <a href="${resetUrl}">${resetUrl}<\a>
    <p>このリクエストを行っていない場合は、このメールを無視してください。<\p>
        
    `
    mailAddress = req.body.email;
    const mailParam = {
        host: "smtp.zoho.jp",
        port: 465,
        auth: {
            user: zohoUser,
            pass: zohoPass
        }
    };

    var mailCallback = (err, result) => {
        if (err) {
            console.log("メール送信エラー: " + err);
            req.flash("error", "メールが送信できませんでした");
            return res.redirect(`/login`);
        } else {
            console.log("メール送信完了!: " + result);
            req.flash("success", "メールを送信しました！");
            return res.redirect(`/login`);
        };
    };

    const smtp = mail.createTransport(mailParam);
    smtp.sendMail({
        from: zohoUser,
        to: mailAddress,
        subject: "bzb-pa-tool パスワードリセットリクエスト",
        html: HTML
    }, mailCallback);
};

module.exports.renderPasswordResetForm = async (req, res) => {
    const token = req.query.token;
    let resetUrl = "";
    if (process.env.NODE_ENV != "production") {
        resetUrl = `http://localhost:3000/mails/resetPassword?token=${token}`;
    } else {
        resetUrl = `https://www.bzb-pa-tool.com/mails/resetPassword?token=${token}`;
    }
    res.render("auth/resetPassword", { resetUrl });
};

module.exports.SendPaTableSubmissionNotificationMail = async (req, res) => {
    
}

module.exports.renderPasswordMailForm = (req, res) => {
    res.render("auth/passwordMailForm");
};