const deleteEl = document.querySelectorAll(".deleteEl");
const deleteForm = document.querySelectorAll(".delete-forms");
deleteEl.forEach((el, index) => {
    el.addEventListener("click", (e) => {
        if (confirm("ライブを削除しますか")) {
            deleteForm[index].submit();
        } else {
            alert("削除を中止しました");
        }
    })

})