if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
};
const dbUrl = process.env.DB_URL;
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
const song = require("../models/song");

const seedDB = async () => {
    await Live.deleteMany({});
    for (let i = 0; i < 10; i++){
        const liveName = `live${i}`;
        const live = new Live({
            name: liveName,
    bands

        })
    }

    await Live.save();
}