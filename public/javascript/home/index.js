// JavaScriptファイル (scripts.js)

// ページが読み込まれたときの処理
window.onload = function() {
    // タイトルセクションを表示
    document.getElementById('hero').style.display = 'block';
}

// スクロール時の処理
window.addEventListener('scroll', function() {
    var sections = document.querySelectorAll('section');
    var scrollPosition = window.scrollY || window.pageYOffset;

    // セクションが画面内に入ったら表示する
    for (var i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= scrollPosition + window.innerHeight * 0.7) {
            sections[i].style.display = 'block';
        }
    }
});
