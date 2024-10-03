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

const change_author = async () => {
    const bandId = process.argv[2];
    const newAuthorId = process.argv[3];
    const band = await Band.findOne({ _id: bandId }).populate("songs").populate("live").populate("author");
    const newAuthor = await User.findOne({ _id: newAuthorId });
    const oldAuthor = await User.findOne({ _id: band.author._id });

    if (!band) {
        console.log("バンドが存在しません");
    } else if(!newAuthor) {
        console.log("ユーザーが存在しません");
    } else {
        newAuthor.bands.push(band._id);
        band.author = newAuthor;
        oldAuthor.bands = oldAuthor.bands.filter((bandId) => bandId === band._id);

        await newAuthor.save();
        await band.save();
        await oldAuthor.save();

        console.log("変更完了");
        console.log("バンド", band);
        console.log("新ユーザー", newAuthor);
        console.log("旧ユーザー", oldAuthor);
    }
}
change_author();