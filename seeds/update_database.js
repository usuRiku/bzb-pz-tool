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
    let songs = await Song.find({});
    for (let i = 0; i < songs.length; i++){
        let mainSpeaker ="メインスピーカ：\n" + songs[i].mainSpeaker + "\n\n";
        let returnSpeaker ="返しスピーカ：\n" + songs[i].returnSpeaker + "\n\n";
        let otherRequests = "その他：\n" + songs[i].otherRequests + "\n";
        let newRequest = mainSpeaker + returnSpeaker + otherRequests;
        songs[i].requests = newRequest;
        console.log(songs[i]);
        await songs[i].save();
    }
}
seedDB()