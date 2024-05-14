const mongoose = require("mongoose");
const Band = require("./band");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password:String,
    circleName: String,
    grade: Number,
    bands: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Band"
        }
    ]
});

userSchema.static("isAuthenticated", function (req) {
    try {
        if (req.session.user.email) {
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }
})

userSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        console.log("ユーザーを削除しようとしている", doc.bands);
        for (let band of doc.bands){
            await Band.findByIdAndDelete(band);
        }
    }
});


module.exports = mongoose.model("User", userSchema);