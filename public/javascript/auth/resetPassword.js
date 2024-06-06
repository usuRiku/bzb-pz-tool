const submitButton = document.querySelector("#submitButton");
const forms = document.querySelectorAll('.validation');
const password = document.querySelector("#password");
const passwordConform = document.querySelector("#passwordConform");
let alreadySubmit = false;
submitButton.addEventListener("click", (e) => {
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
            if (!(password.value === passwordConform.value)) {
                document.querySelector("#msg").innerHTML = "パスワードが一致していません";
                isConformPassword = true;
            } else {
                if (!alreadySubmit) {
                    alreadySubmit = true;
                    form.submit();
                    }
                alreadySubmit = true;
            }
        }
        form.classList.add('was-validated')
    }, false)
});