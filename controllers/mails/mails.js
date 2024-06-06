const mail = require("nodemailer");
const zohoUser = process.env.ZOHO_USER
const zohoPass = process.env.ZOHO_PASSWORD
const { HTML } = require("./resetMailHTML");

module.exports.sendPasswordResetMail = async (req, res) => {
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
            return res.redirect(`/mypage/${req.params.userId}`);
        } else {
            console.log("メール送信完了!: " + result);
            req.flash("success", "メールを送信しました！");
            return res.redirect(`/myPage/${req.params.userId}`);
        };
    };

    const smtp = mail.createTransport(mailParam);
    smtp.sendMail({
        from: zohoUser,
        to: mailAddress,
        subject: "メール送信テスト",
        html: HTML
    }, mailCallback);

};