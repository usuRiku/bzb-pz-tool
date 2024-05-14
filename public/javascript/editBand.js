for (let i = 1; i <= 10; i++){
    document.querySelector("#micNumber"+i+"-"+6).value = "6"
    document.querySelector("#micNumber"+i+"-"+5).value = "5"
    document.querySelector("#micNumber"+i+"-"+4).value = "4"
    document.querySelector("#micNumber"+i+"-"+3).value = "3"
    document.querySelector("#micNumber"+i+"-"+2).value = "2"
    document.querySelector("#micNumber"+i+"-"+1).value = "1"
    
    document.querySelector("#part"+i+"-"+6).value = "サード"
    document.querySelector("#part"+i+"-"+5).value = "セカンド"
    document.querySelector("#part"+i+"-"+4).value = "トップ"
    document.querySelector("#part"+i+"-"+3).value = "リード"
    document.querySelector("#part"+i+"-"+2).value = "ベース"
    document.querySelector("#part"+i+"-"+1).value = "ボイパ"
}
//デフォルト値設定(songのみ)
for (let i = 1; i <= 10; i++) {
    try {
        document.getElementById("song" + i).value = band.songs[i - 1].song
        document.getElementById("isMc" + i).value = band.songs[i - 1].isMc

        document.querySelector("#micNumber" + i + "-" + 6).value = band.songs[i - 1].micNumber[0];
        document.querySelector("#micNumber" + i + "-" + 5).value = band.songs[i - 1].micNumber[1];
        document.querySelector("#micNumber" + i + "-" + 4).value = band.songs[i - 1].micNumber[2];
        document.querySelector("#micNumber" + i + "-" + 3).value = band.songs[i - 1].micNumber[3];
        document.querySelector("#micNumber" + i + "-" + 2).value = band.songs[i - 1].micNumber[4];
        document.querySelector("#micNumber" + i + "-" + 1).value = band.songs[i - 1].micNumber[5];

        document.querySelector("#part" + i + "-" + 6).value = band.songs[i - 1].part[0];
        document.querySelector("#part" + i + "-" + 5).value = band.songs[i - 1].part[1];
        document.querySelector("#part" + i + "-" + 4).value = band.songs[i - 1].part[2];
        document.querySelector("#part" + i + "-" + 3).value = band.songs[i - 1].part[3];
        document.querySelector("#part" + i + "-" + 2).value = band.songs[i - 1].part[4];
        document.querySelector("#part" + i + "-" + 1).value = band.songs[i - 1].part[5];
        
        document.querySelector("#member" + i + "-" + 6).value = band.songs[i - 1].member[0];
        document.querySelector("#member" + i + "-" + 5).value = band.songs[i - 1].member[1];
        document.querySelector("#member" + i + "-" + 4).value = band.songs[i - 1].member[2];
        document.querySelector("#member" + i + "-" + 3).value = band.songs[i - 1].member[3];
        document.querySelector("#member" + i + "-" + 2).value = band.songs[i - 1].member[4];
        document.querySelector("#member" + i + "-" + 1).value = band.songs[i - 1].member[5];
        if (band.songNumber === i) {
            document.getElementById("songNum" + i).setAttribute("selected", "");
        }
    } catch {
        break;
    }
}

const songNumInput = document.getElementById("songNumber");
let songNum = band.songNumber;
for (let i = 1; i <= songNum;i++){
    document.querySelector("#song" + songNum).setAttribute("required", "");
    document.querySelector("#accordion" + i).classList.toggle('hidden');
}
songNumInput.addEventListener("change", function (e) {
    songNum = this.value;
    for (let i = 1; i <= 10; i++) {
        const id = "#accordion" + i;
        document.querySelector(id).classList.add('hidden');
        document.querySelector("#song" + i).removeAttribute("required");
    }
    for (let i = 1; i <= songNum; i++) {
        const id = "#accordion" + i;
        console.log(id);
        document.querySelector(id).classList.toggle('hidden');
        document.querySelector("#song" + i).setAttribute("required", "");
    }
});