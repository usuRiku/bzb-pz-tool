$('tr[data-href]').click(function (e) {
    if (!$(e.target).is('a')) {
        window.location = $(e.target).data('href');
    };
});

