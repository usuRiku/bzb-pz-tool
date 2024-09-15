if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
};
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/bzb-pa-tool";
const mongoose = require("mongoose");
mongoose.connect(dbUrl, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDBコネクションOK！！');
    })
    .catch(err => {
        console.log("MongoDBコネクションエラー！！！'");
        console.log(err);
    });

const Live = require("../models/live");
const Band = require("../models/band");
const Song = require("../models/song");
const Break = require("../models/break");
const User = require("../models/user");

const bcrypt = require('bcryptjs');

const seedDB = async () => {
    const user = await User.findOne({ email: "yamatoure1216@gmail.com" });
    console.log(user);
    if (!user) {
        console.log("ユーザーが存在しません");
    } else {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        const hashedPassword = await bcrypt.hash("temp_pass", salt);
        user.password = hashedPassword;
        console.log("変更完了", user)
    }
}
seedDB();