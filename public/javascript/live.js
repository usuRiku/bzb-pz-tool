const el = document.getElementById("sortable");
const tableRow = document.querySelector("#sortable > tr");
const sortable1 = Sortable.create(el, {
    animation: 150,
    handle: ".handle",
    onSort: async function (e) {
        const url = `/lives/${liveId}/`;
        const items = el.querySelectorAll('tr');
        let order = [];
        bands = {
            order: []
        }
        for (let i = 0; i < items.length; i++) {
            items[i].querySelector('.no').innerHTML = i + 1;
            const a = items[i].querySelector("a").href;
            const reg = new RegExp("(?<=(.*" + liveId + "\/)).*");
            const bandId = a.match(reg)[0];
            bands.order.push(bandId);
        }
        await fetch(url, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bands.order)
        })
        .then((response) => {
            console.log("パッチ送信");
        })
        .catch((error) => {
            console.log("パッチ送信失敗");
        });
    },
});

// tableRow.addEventListener("click", async () => {
//     const items = el.querySelectorAll('tr');
//     for (let i = 0; i < items.length; i++) {
//         const url = items[i].querySelector("a").href;
//         console.log(url);
//         open(url);
//     }
// })

//ハンドル非表示
$(function() {
    $(".hiddenBtn").click(function () {
        console.log("click");
        $(".handle").toggleClass("hidden");
    });
});