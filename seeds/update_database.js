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

const seedDB = async () => {
    let lives = await Live.find({});
    for (let i = 0; i < lives.length; i++){
        lives[i].statues = 4
        await lives[i].save();
        console.log(lives[i].statues);
    }
    console.log("変更完了")
}
seedDB();