const paDeleteEl = document.querySelectorAll(".paDeleteEl");
paDeleteEl.forEach((el, index) => {
    const deleteForm = document.getElementById("paDeleteForm" + index);
    el.addEventListener("click", (e) => {
        if (confirm("PA表を削除しますか")) {
            deleteForm.submit();
        } else {
            alert("削除を中止しました");
        }
    })
});

const userDeleteForm = document.getElementById("userDeleteForm");
const userEditButton = document.getElementById("userEditButton");
const userDeleteButton = document.getElementById("userDeleteButton");
userDeleteButton.addEventListener("click", (e) => {
    if (confirm("ユーザーを削除しますか")) {
        if (confirm("ユーザーを削除すると関連するPA表も削除されますがよろしいですか")) {
            userDeleteForm.submit();
        } else {
            alert("削除を中止しました");
        }
    }
});

const forms = document.querySelectorAll('.validation');
const password = document.querySelector("#password");
let alreadySubmit = false;
userEditButton.addEventListener("click", (e) => {
    Array.from(forms).forEach(form => {
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
                if (confirm("ユーザー情報を更新しますか")) {
                    form.submit();
                    alreadySubmit = true;
                } else {
                    alert("編集を中止しました");
                }
            }
        }
        form.classList.add('was-validated')
    }, false)
});