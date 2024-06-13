if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
};
const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require('method-override');
const SpotifyWebApi = require('spotify-web-api-node');
const MongoStore = require('connect-mongo');
const { getSpotifyAccessToken } = require("./utils/spotify_credentials.js");

const sessionSecret = process.env.SESSION_SECRET;
const PORT = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/bzb-pa-tool";
const spotifyId = process.env.SPOTIFY_CLIENT_ID
const spotifySecret = process.env.SPOTIFY_CLIENT_SECRET
const spotifyCallback = process.env.SPOTIFY_CALLBACK

const homeRoutes = require("./routes/home");
const livesRoutes = require("./routes/lives");
const authRoutes = require("./routes/auth");
const myPageRoutes = require("./routes/myPage");
const adminRoutes = require("./routes/admin");
const lightRoutes = require("./routes/light");
const mailsRoutes = require("./routes/mails");
const ExpressError = require("./utils/ExpressError");
const app = express();

//session
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: sessionSecret
    },
    touchAfter: 24 * 3600
});

store.on("error", () => {
    console.log("セッションストアエラー", e);
})

const sessionConfig = {
    store,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};


app.use(session(sessionConfig));

app.use(flash());


//middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(async (req, res, next) => {
    //spotify
    const spotifyApi = new SpotifyWebApi({
        clientId: spotifyId,
        clientSecret: spotifySecret,
        redirectUri: spotifyCallback
    });
    access_token = await getSpotifyAccessToken();
    spotifyApi.setAccessToken(access_token);
    res.locals.spotifyAccessToken = access_token;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.session.user;
    next();
});

//mongoose
mongoose.set('strictQuery', true);

//ejs
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


//routes middleware
app.use("/", homeRoutes);
app.use("/lives", livesRoutes);
app.use("/", authRoutes);
app.use("/mypage", myPageRoutes);
app.use("/admin", adminRoutes);
app.use("/light", lightRoutes);
app.use("/mails", mailsRoutes);

//spotify
const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer.from(spotifyId + ':' + spotifySecret).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

app.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        const token = body.access_token;
    }
});

app.all('*', (req, res, next) => {
    next(new ExpressError('ページが見つかりませんでした', 404));
});

//dbUrl
mongoose.connect(dbUrl, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDBコネクションOK！！');
    })
    .catch(err => {
        console.log("MongoDBコネクションエラー！！！'");
        console.log(err);
    });

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (statusCode === 404) {
        res.status(statusCode).render('errors/notFound', { err });
    } else {
        console.log(err);
        res.status(statusCode).render("errors/error", { err });
    }
    next();
});

app.listen(PORT, () => {
    console.log("listening server");
});