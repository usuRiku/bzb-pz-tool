const DEFAULT_MIC_NUMBERS = ['6','5','4','3','2','1'];
const DEFAULT_MIC_PARTS = ['サード','セカンド','トップ','リード','ベース','ボイパ'];

// Fill each song block: if band has a song at position i, use its values;
// otherwise use live defaults (if available) or the script defaults.
for (let i = 1; i <= 10; i++) {
    const songData = band.songs && band.songs[i - 1];
    const liveNumbers = band.live && Array.isArray(band.live.micNumber) && band.live.micNumber.length === 6 ? band.live.micNumber : DEFAULT_MIC_NUMBERS;
    const liveParts = band.live && Array.isArray(band.live.micPart) && band.live.micPart.length === 6 ? band.live.micPart : DEFAULT_MIC_PARTS;

    if (songData) {
        // populate from saved song
        document.getElementById("song" + i).value = songData.song || '';
        document.getElementById("isMc" + i).value = songData.isMc || '';
        for (let k = 0; k < 6; k++) {
            const j = 6 - k; // j = 6..1 maps to songData arrays 0..5
            const micVal = songData.micNumber && songData.micNumber[k] ? songData.micNumber[k] : '';
            const partVal = songData.part && songData.part[k] ? songData.part[k] : '';
            const memberVal = songData.member && songData.member[k] ? songData.member[k] : '';
            const micEl = document.querySelector("#micNumber" + i + "-" + j);
            const partEl = document.querySelector("#part" + i + "-" + j);
            const memberEl = document.querySelector("#member" + i + "-" + j);
            if (micEl) micEl.value = micVal;
            if (partEl) partEl.value = partVal;
            if (memberEl) memberEl.value = memberVal;
        }
        const options = document.querySelectorAll(".tempo" + i);
        for (let j = 0; j < options.length; j++){
            if (options[j].value == songData.tempo){
                options[j].removeAttribute("selected");
                options[j].setAttribute("selected", "");
            }
        }
        document.querySelector("#nuance" + i).value = songData.nuance || '';
        document.querySelector("#requests" + i).value = songData.requests || '';
        if (band.songNumber === i) {
            const el = document.getElementById("songNum" + i);
            if (el) el.setAttribute("selected", "");
        }
    } else {
        // No saved song: populate mic/part inputs from live defaults
        for (let k = 0; k < 6; k++) {
            const j = 6 - k; // j = 6..1
            const micEl = document.querySelector("#micNumber" + i + "-" + j);
            const partEl = document.querySelector("#part" + i + "-" + j);
            if (micEl) micEl.value = liveNumbers[k] || '';
            if (partEl) partEl.value = liveParts[k] || '';
        }
    }
}

// Utility to get values arrays for a song i (top->bottom order)
function getSongValues(i) {
    const nums = [];
    const parts = [];
    const members = [];
    for (let j = 6; j >= 1; j--) {
        const n = document.querySelector("#micNumber" + i + "-" + j);
        const p = document.querySelector("#part" + i + "-" + j);
        const m = document.querySelector("#member" + i + "-" + j);
        nums.push(n ? n.value : '');
        parts.push(p ? p.value : '');
        members.push(m ? m.value : '');
    }
    return { nums, parts, members };
}

function setSongValues(i, nums, parts, members) {
    for (let j = 6; j >= 1; j--) {
        const pos = 7 - j;
        const n = document.querySelector("#micNumber" + i + "-" + j);
        const p = document.querySelector("#part" + i + "-" + j);
        const m = document.querySelector("#member" + i + "-" + j);
        if (n) n.value = nums[pos-1] !== undefined ? nums[pos-1] : '';
        if (p) p.value = parts[pos-1] !== undefined ? parts[pos-1] : '';
        if (m) m.value = members[pos-1] !== undefined ? members[pos-1] : '';
    }
}

// Capture initial values per song so we can reset to live defaults
const initialSongValues = {};
for (let i = 1; i <= 10; i++) {
    initialSongValues[i] = getSongValues(i);
}

// Attach control handlers for each song block (reverse/reset)
for (let i = 1; i <= 10; i++) {
    const revNumBtn = document.getElementById(`reverseNumbers-${i}`);
    const revPartsBtn = document.getElementById(`reversePartsMembers-${i}`);
    const revRowsBtn = document.getElementById(`reverseRows-${i}`);

    if (revNumBtn) {
        revNumBtn.addEventListener('click', () => {
            const { nums, parts, members } = getSongValues(i);
            nums.reverse();
            setSongValues(i, nums, parts, members);
        });
    }
    if (revPartsBtn) {
        revPartsBtn.addEventListener('click', () => {
            const { nums, parts, members } = getSongValues(i);
            parts.reverse();
            members.reverse();
            setSongValues(i, nums, parts, members);
        });
    }
    if (revRowsBtn) {
        revRowsBtn.addEventListener('click', () => {
            const { nums, parts, members } = getSongValues(i);
            nums.reverse(); parts.reverse(); members.reverse();
            setSongValues(i, nums, parts, members);
        });
    }
    const resetBtn = document.getElementById(`resetInitial-${i}`);
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const init = initialSongValues[i] || { nums: [], parts: [], members: [] };
            const current = getSongValues(i);
            const currentMembers = current.members || [];
            setSongValues(i, init.nums, init.parts, currentMembers);
        });
    }
}

const songNumInput = document.getElementById("songNumber");
let songNum = band.songNumber;
for (let i = 1; i <= songNum; i++) {
    document.querySelector("#song" + songNum).setAttribute("required", "");
    document.querySelector("#tempo" + songNum).setAttribute("required", "");
    document.querySelector("#accordion" + i).classList.toggle('hidden');
}
songNumInput.addEventListener("change", function (e) {
    songNum = this.value;
    for (let i = 1; i <= 10; i++) {
        const id = "#accordion" + i;
        document.querySelector(id).classList.add('hidden');
        document.querySelector("#song" + i).removeAttribute("required");
        document.querySelector("#tempo" + i).removeAttribute("required");
    }
    for (let i = 1; i <= songNum; i++) {
        const id = "#accordion" + i;
        console.log(id);
        document.querySelector(id).classList.toggle('hidden');
        document.querySelector("#song" + i).setAttribute("required", "");
        document.querySelector("#tempo" + i).setAttribute("required", "");
    }
});

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
})

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
                if (song.tempo) {
                    document.querySelectorAll(".tempo" + i)[0].removeAttribute("selected");
                    document.querySelectorAll(".tempo" + i)[1].removeAttribute("selected");
                    document.querySelectorAll(".tempo" + i)[2].removeAttribute("selected");
                    document.querySelectorAll(".tempo" + i)[song.tempo].setAttribute("selected", "");
                } 

                document.querySelector("#nuance" + i).value = song.nuance;
                document.querySelector("#requests" + i).value = song.requests;
            })
        })
    })
}