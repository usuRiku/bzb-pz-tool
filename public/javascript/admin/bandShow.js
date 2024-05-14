const nextHref = document.querySelector("#next");
const ForwardHref = document.querySelector("#forward");
window.addEventListener("keydown", async function (e) {
    switch (e.code) {
        case "ArrowRight":
            console.log("右");
            try {
                this.location.href = nextHref.href;
            } catch {
                
            }
            break;
        case "ArrowLeft":
            console.log("左");
            try {
                this.location.href = ForwardHref.href;
            } catch {
                
            }
            break;
    }
});