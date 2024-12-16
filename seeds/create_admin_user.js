if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
};
const bcrypt = require("bcryptjs")
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/bzb-pa-tool";
const mongoose = require("mongoose");
mongoose.connect(dbUrl, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDBコネクションOK！！');
    })
    .catch(err => {
        console.log("MongoDBコネクションエラー！！！'");
        console.log(err);
    });

const User = require("../models/user");

const seedDB = async () => {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash("admin", salt);
    let user = new User({email:"admin@admin.com",
        password:hashedPassword,
        circleName:"機材班",
        grade:0,
        bands: []})
    await user.save()
    console.log("変更完了")
}
seedDB();