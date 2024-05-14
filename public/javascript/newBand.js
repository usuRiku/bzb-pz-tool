const songNumInput = document.getElementById("songNumber");
let songNum = 1;
document.querySelector("#song1").setAttribute("required", "");
document.querySelector("#accordion1").classList.toggle('hidden');
songNumInput.addEventListener("change", function(e){
    songNum = this.value;
    for (let i = 1; i <= 10; i++){
        const id = "#accordion" + i;
        document.querySelector(id).classList.add('hidden');
        document.querySelector("#song" + i).removeAttribute("required");
    }
    for (let i = 1; i <= songNum; i++){
        const id = "#accordion" + i;
        console.log(id);
        document.querySelector(id).classList.toggle('hidden');
        document.querySelector("#song" + i).setAttribute("required", "");
    }
});

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