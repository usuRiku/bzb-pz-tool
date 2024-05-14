const button = document.querySelector("#submitButton");
const forms = document.querySelectorAll('.validation');
button.addEventListener("click", (e) => {
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
            form.submit();
        }
        form.classList.add('was-validated')
    }, false)
});