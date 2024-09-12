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

//ハンドル非表示
$(function () {
    $(".hiddenBtn").click(function () {
        console.log("click");
        $(".handle").toggleClass("hidden");
    });
});

const deleteEl = document.querySelectorAll(".deleteEl");
const deleteForm = document.querySelectorAll(".delete-forms");
deleteEl.forEach((el, index) => {
    el.addEventListener("click", (e) => {
        if (confirm("PA表を削除しますか")) {
            deleteForm[index].submit();
        } else {
            alert("削除を中止しました");
        }
    })

});

const breakDeleteEl = document.querySelectorAll(".breakDeleteEl");
const breakDeleteForm = document.querySelectorAll(".break-delete-forms");
breakDeleteEl.forEach((el, index) => {
    el.addEventListener("click", (e) => {
        console.log(breakDeleteForm[index])
        if (confirm(`休憩(${breaks[index].name})を削除しますか`)) {
            breakDeleteForm[index].submit();
        } else {
            alert("削除を中止しました");
        }
    })

});


const addButton = document.getElementById("addBreakButton");
const addForms = document.querySelectorAll('#addBreakForm');
let alreadySubmit = false;
addButton.addEventListener("click", (e) => {
    Array.from(addForms).forEach(form => {
        if (!form.checkValidity()) {
            e.preventDefault()
            e.stopPropagation()
            window.scroll({
                top: 0,
                behavior: "smooth",
            });
            document.querySelector("#msg").innerHTML = "必須項目が入力されていません";
        } else {
            if (!alreadySubmit) {
                form.submit();
            } else {
                console.log("すでに送信されています!");
            }
            alreadySubmit = true;
        }
        form.classList.add('was-validated')
    }, false)
});

breaks.forEach((oneBreak, index) => {
    const editButton = document.querySelector("#editBreakButton" + index);
    const editForms = document.querySelectorAll('#editBreakForm' + index);
    let editAlreadySubmit = false;
    editButton.addEventListener("click", (e) => {
        Array.from(editForms).forEach(form => {
            if (!form.checkValidity()) {
                e.preventDefault()
                e.stopPropagation()
                window.scroll({
                    top: 0,
                    behavior: "smooth",
                });
                document.querySelector("#msg").innerHTML = "必須項目が入力されていません";
            } else {
                if (!editAlreadySubmit) {
                    form.submit();
                } else {
                    console.log("すでに送信されています!");
                }
                editAlreadySubmit = true;
            }
            form.classList.add('was-validated')
        }, false)
    });
});