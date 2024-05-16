const submitButton = document.querySelector("#submitButton");
const forms = document.querySelectorAll('.validation');
const emailConform = document.querySelector("#emailConform");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const passwordConform = document.querySelector("#passwordConform");
let alreadySubmit = false;
let isConformMail = false;
let isConformPassword = false;
console.log(password.value)
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
            if (!(email.value === emailConform.value)) {
                document.querySelector("#msg").innerHTML = "メールアドレスが一致していません";
                isConformMail = true;
            }
            else {
                isConformMail = false;
            }
            if (!(password.value === passwordConform.value)) {
                document.querySelector("#msg").innerHTML = "パスワードが一致していません";
                isConformPassword = true;
            } else {
                isConformPassword = false;
            }
            if (!alreadySubmit && !isConformMail && !isConformPassword) {
                form.submit();
                alreadySubmit = true;
            }
        }
        form.classList.add('was-validated')
    }, false)
});