const deleteEl = document.querySelectorAll(".deleteEl");
const deleteForm = document.querySelectorAll(".delete-forms");
deleteEl.forEach((el, index) => {
    el.addEventListener("click", (e) => {
        if (confirm("ユーザーを削除しますか")) {
            if (confirm("ユーザーを削除すると，関連するPA表も削除されますがよろしいですか？")) {
                deleteForm[index].submit();
            }
        } else {
            alert("削除を中止しました");
        }
    })

})