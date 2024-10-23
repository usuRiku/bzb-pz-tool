if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
};
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/bzb-pa-tool";
const mongoose = require("mongoose");

const Kuroshiro = require("kuroshiro").default;
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
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

const seedDB = async () => {
    let lives = await Live.find({});
    for (let i = 0; i < lives.length; i++){
        const kuroshiro = new Kuroshiro();
        await kuroshiro.init(new KuromojiAnalyzer());
        lives[i].katakanaName = await kuroshiro.convert(lives[i].name, { to: "katakana" });
        console.log(lives[i].katakanaName);
        await lives[i].save();
    }
    console.log("変更完了")
}
seedDB();