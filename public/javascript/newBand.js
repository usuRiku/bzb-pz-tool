const songNumInput = document.getElementById("songNumber");
let songNum = 1;
document.querySelector("#song1").setAttribute("required", "");
document.querySelector("#accordion1").classList.toggle('hidden');
songNumInput.addEventListener("change", function (e) {
    songNum = this.value;
    for (let i = 1; i <= 10; i++) {
        const id = "#accordion" + i;
        document.querySelector(id).classList.add('hidden');
        document.querySelector("#song" + i).removeAttribute("required");
    }
    for (let i = 1; i <= songNum; i++) {
        const id = "#accordion" + i;
        console.log(id);
        document.querySelector(id).classList.toggle('hidden');
        document.querySelector("#song" + i).setAttribute("required", "");
    }
});

for (let i = 1; i <= 10; i++) {
    document.querySelector("#micNumber" + i + "-" + 6).value = "6"
    document.querySelector("#micNumber" + i + "-" + 5).value = "5"
    document.querySelector("#micNumber" + i + "-" + 4).value = "4"
    document.querySelector("#micNumber" + i + "-" + 3).value = "3"
    document.querySelector("#micNumber" + i + "-" + 2).value = "2"
    document.querySelector("#micNumber" + i + "-" + 1).value = "1"

    document.querySelector("#part" + i + "-" + 6).value = "サード"
    document.querySelector("#part" + i + "-" + 5).value = "セカンド"
    document.querySelector("#part" + i + "-" + 4).value = "トップ"
    document.querySelector("#part" + i + "-" + 3).value = "リード"
    document.querySelector("#part" + i + "-" + 2).value = "ベース"
    document.querySelector("#part" + i + "-" + 1).value = "ボイパ"
}

//曲検索
//spotify
const spotifyApi = new SpotifyWebApi();
const searchSong = document.querySelector(".searchSong");

async function search(word) {
    result = await spotifyApi.search(word, ["album", "artist", "playlist", "track", "show", "episode", "audiobook"]);
    return result;
}
searchSong.addEventListener('change', () => {
    spotifyApi.setAccessToken(spotifyAccessToken);
    console.log("setaccesstoken at 検索")
    result_div = document.querySelector("#searchResult");
    while (result_div.firstChild) {
        result_div.removeChild(result_div.firstChild)
    }
    word = searchSong.value

    if (word != false) {
        search(word)
            .then(res => {
                result = res;
                const playMsg = document.createElement('p');
                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');
                const addMsg = document.createElement('p');
                table.className = "table"
                const header = document.createElement('tr');
                playMsg.innerHTML = "<div class = 'alert alert-info'>曲名をクリックすると，曲を再生できます（Spotifyの無料登録が必要です）．</div><h3>検索結果</h3>";
                addMsg.innerHTML = "<div class = 'alert alert-warning'>もし曲が見つからなかった場合は，以下にspotifyの曲をシェアからURLを貼り付けてください<br><a href = 'https://open.spotify.com/search' target = '_blank'>Spotify検索ページ</a></div>";
                header.innerHTML = "<th class = 'searchResultTable1'>操作</th><th class ='searchResultTable2'>曲名</th><th class = 'searchResultTable3'>アーティスト</th>";
                result_div.appendChild(playMsg);
                document.querySelector("#searchResult").appendChild(table);
                table.appendChild(thead);
                thead.appendChild(header);
                table.appendChild(tbody);
                for (let j = 0; j < 5; j++) {
                    if (result.tracks.items.length === j + 2) {
                        break;
                    }
                    const tr = document.createElement('tr');
                    const item = result.tracks.items[j];
                    buttonId = "addButton" + (j + 1);
                    songUrl = 'https://open.spotify.com/intl-ja/track/' + item.id
                    tr.innerHTML = "<td><button class = 'btn btn-success btn-sm ' type = 'button' id = '" + buttonId + "'>追加</button></td><td><a href = " + songUrl + " target = '_blank'>" + item.name + "</a></td>" + "<td>" + item.artists[0].name + "</td>";
                    tbody.appendChild(tr);
                    document.getElementById(buttonId).addEventListener("click", e => {
                        document.getElementById("se").value = item.name
                        document.getElementById("seUrl").value = 'https://open.spotify.com/intl-ja/track/' + item.id
                        document.getElementById("seArtist").value = item.artists[0].name

                    })
                }
                result_div.appendChild(addMsg);
            }).catch(e => {
                console.log(e)
                error = document.createElement("p")
                if (e.status === 401) {
                    error.innerHTML = "タイムアウトしました<br>ページを再読み込みしてください";
                } else {
                    error.innerHTML = "見つかりませんでした<br>条件を変えて再検索してください";
                }
                result_div.appendChild(error);
            });
    }
});

//pa表自動補完機能
for (let i = 1; i <= 10; i++) {
    bands.forEach((band, j) => {
        band.songs.forEach((song, k) => {
            const addButton = document.getElementById(`addButton${i}-${j + 1}-${k + 1}`);
            addButton.addEventListener("click", () => {
                document.querySelector("#song" + i).value = song.song;
                document.querySelector("#isMc" + i).value = song.isMc;
                document.querySelector("#micNumber" + i + "-" + 6).value = song.micNumber[0];
                document.querySelector("#micNumber" + i + "-" + 5).value = song.micNumber[1];
                document.querySelector("#micNumber" + i + "-" + 4).value = song.micNumber[2];
                document.querySelector("#micNumber" + i + "-" + 3).value = song.micNumber[3];
                document.querySelector("#micNumber" + i + "-" + 2).value = song.micNumber[4];
                document.querySelector("#micNumber" + i + "-" + 1).value = song.micNumber[5];

                document.querySelector("#part" + i + "-" + 6).value = song.part[0];
                document.querySelector("#part" + i + "-" + 5).value = song.part[1];
                document.querySelector("#part" + i + "-" + 4).value = song.part[2];
                document.querySelector("#part" + i + "-" + 3).value = song.part[3];
                document.querySelector("#part" + i + "-" + 2).value = song.part[4];
                document.querySelector("#part" + i + "-" + 1).value = song.part[5];

                document.querySelector("#member" + i + "-" + 6).value = song.member[0];
                document.querySelector("#member" + i + "-" + 5).value = song.member[1];
                document.querySelector("#member" + i + "-" + 4).value = song.member[2];
                document.querySelector("#member" + i + "-" + 3).value = song.member[3];
                document.querySelector("#member" + i + "-" + 2).value = song.member[4];
                document.querySelector("#member" + i + "-" + 1).value = song.member[5];
                
                document.querySelector("#mainSpeaker" + i).value = song.mainSpeaker;
                document.querySelector("#returnSpeaker" + i).value = song.returnSpeaker;
                document.querySelector("#nuance" + i).value = song.nuance;
                document.querySelector("#otherRequests" + i).value = song.otherRequests;
            })
        })
    })
}