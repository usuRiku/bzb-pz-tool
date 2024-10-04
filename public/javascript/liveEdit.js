const liveStatues1 = document.querySelector("#liveStatues1");
const liveStatues2 = document.querySelector("#liveStatues2");
const liveStatues3 = document.querySelector("#liveStatues3");
const liveStatues4 = document.querySelector("#liveStatues4");
if (statues == 1) {
    liveStatues1.setAttribute("checked", "");
} else if (statues == 2) {
    liveStatues2.setAttribute("checked", "");
} else if (statues == 3) {
    liveStatues3.setAttribute("checked", "");
} else if (statues === 4) {
    liveStatues4.setAttribute("checked", "");
}