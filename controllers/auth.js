const User = require("../models/user");
const bcrypt = require('bcryptjs');
const spotifyId = process.env.SPOTIFY_CLIENT_ID
const spotifySecret = process.env.SPOTIFY_CLIENT_SECRET

module.exports.renderLoginForm = (req, res) => {
    res.render("auth/login");
};

module.exports.renderNewForm = (req, res) => {
    res.render("auth/new");
};

module.exports.register = async (req, res) => {
    const { email, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        req.flash("error", "このメールアドレスは既に登録されています");
        res.redirect("/register");
    }
    // Hash the password
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store the user
    const registeredUser = new User(req.body);
    registeredUser.password = hashedPassword;
    registeredUser.save();
    req.session.user = registeredUser;
    req.flash("success", `${req.session.user.circleName}さん ようこそ！`);
    res.redirect("/lives");
};

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        req.flash("error", "このメールアドレスは登録されていません！");
        return res.redirect("/register");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        req.session.user = user;
        req.flash("success", `${req.session.user.circleName}でログインしました！`);
        res.redirect("/lives");
    } else {
        req.flash("error", "メールアドレスまたはパスワードが間違っています");
        return res.redirect("/login");
    }
};

module.exports.lineLogin = async (req, res) => {
    console.log("lineログイン成功")
    req.flash("success", "Lineでログインしました！！");
    res.redirect("/lives");
};

module.exports.googleLogin = async (req, res) => {
    console.log("googleログイン成功")
    req.flash("success", "googleでログインしました！！");
    res.redirect("/lives");
};

module.exports.logout = async (req, res) => {
    req.session.destroy();
    res.redirect('/');
};

module.exports.redirectSpotify = async (req, res) => {
    authorization_code = req.query.code;
    authOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(spotifyId + ':' + spotifySecret).toString('base64'))
        },
        body: new URLSearchParams({
            code: authorization_code,
            redirect_uri: "http://localhost:3000/login/spotify",
            grant_type: 'authorization_code',
        }),
        json: true
    }
    
    response = await fetch(`https://accounts.spotify.com/api/token`, authOptions);
    resJson = await response.json();
    access_token = resJson.access_token;
    req.session.specificAccessToken = access_token;
    req.session.spotifyUser = 1;
    req.flash("success", "Spotifyでログインしました");
    res.redirect(`/admin/${req.session.now_live}/playlist`);
};