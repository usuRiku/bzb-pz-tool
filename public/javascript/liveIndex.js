const searchYear = document.getElementById("searchYear")
const now = new Date()
const year = now.getFullYear();

for (let i = 2023; i <= year; i++){
    const option = document.createElement("option")
    option.innerHTML = i
    option.value = i
    searchYear.appendChild(option)
}