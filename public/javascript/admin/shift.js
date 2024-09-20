
document.getElementById("bandNameCopyButton").addEventListener("click", async () => {
    const table = document.querySelectorAll("#bandTableBody > .bandInfo > .bandName");
    let copyText = ""
    for (let i = 0; i < table.length; i++){
      copyText += table[i].innerText;
      copyText += "\n";
    }
    console.log(copyText);
      try {
        await navigator.clipboard.writeText(copyText);
        alert("クリップボードにコピーしました!");
      } catch (err) {
        console.error("テキストのコピーに失敗しました", err);
      }
});