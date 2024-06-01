# Diff Details

Date : 2024-06-01 11:44:09

Directory c:\\Users\\susuk\\Documents\\program\\24_04_27bzb-pa-tool

Total : 53 files,  3785 codes, 89 comments, 160 blanks, all 4034 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [controllers/admin.js](/controllers/admin.js) | JavaScript | 70 | 0 | 10 | 80 |
| [controllers/auth.js](/controllers/auth.js) | JavaScript | 80 | 3 | 11 | 94 |
| [controllers/bands.js](/controllers/bands.js) | JavaScript | 95 | 0 | 6 | 101 |
| [controllers/lives.js](/controllers/lives.js) | JavaScript | 46 | 0 | 9 | 55 |
| [controllers/myPages.js](/controllers/myPages.js) | JavaScript | 38 | 3 | 5 | 46 |
| [index.js](/index.js) | JavaScript | 105 | 7 | 19 | 131 |
| [middleware.js](/middleware.js) | JavaScript | 42 | 0 | 7 | 49 |
| [models/band.js](/models/band.js) | JavaScript | 39 | 0 | 3 | 42 |
| [models/live.js](/models/live.js) | JavaScript | 28 | 0 | 3 | 31 |
| [models/song.js](/models/song.js) | JavaScript | 46 | 0 | 1 | 47 |
| [models/user.js](/models/user.js) | JavaScript | 37 | 0 | 5 | 42 |
| [package-lock.json](/package-lock.json) | JSON | 1,902 | 0 | 1 | 1,903 |
| [package.json](/package.json) | JSON | 37 | 0 | 1 | 38 |
| [routes/admin.js](/routes/admin.js) | JavaScript | 23 | 0 | 8 | 31 |
| [routes/auth.js](/routes/auth.js) | JavaScript | 15 | 8 | 8 | 31 |
| [routes/home.js](/routes/home.js) | JavaScript | 6 | 0 | 2 | 8 |
| [routes/lives.js](/routes/lives.js) | JavaScript | 28 | 0 | 9 | 37 |
| [routes/myPage.js](/routes/myPage.js) | JavaScript | 10 | 0 | 2 | 12 |
| [seeds/index.js](/seeds/index.js) | JavaScript | 27 | 0 | 4 | 31 |
| [utils/ExpressError.js](/utils/ExpressError.js) | JavaScript | 8 | 0 | 1 | 9 |
| [utils/catchAsync.js](/utils/catchAsync.js) | JavaScript | 5 | 0 | 0 | 5 |
| [utils/spotify_credentials.js](/utils/spotify_credentials.js) | JavaScript | 27 | 0 | 7 | 34 |
| [utils/tempCodeRunnerFile.js](/utils/tempCodeRunnerFile.js) | JavaScript | 1 | 0 | 0 | 1 |
| [views/admin/bandShow.ejs](/views/admin/bandShow.ejs) | HTML | 20 | 0 | 0 | 20 |
| [views/admin/index.ejs](/views/admin/index.ejs) | HTML | 44 | 0 | 1 | 45 |
| [views/admin/liveIndex.ejs](/views/admin/liveIndex.ejs) | HTML | 26 | 0 | 1 | 27 |
| [views/admin/liveManagement.ejs](/views/admin/liveManagement.ejs) | HTML | 30 | 0 | 0 | 30 |
| [views/admin/liveShow.ejs](/views/admin/liveShow.ejs) | HTML | 52 | 0 | 2 | 54 |
| [views/admin/playlistShow.ejs](/views/admin/playlistShow.ejs) | HTML | 42 | 0 | 4 | 46 |
| [views/admin/userManagement.ejs](/views/admin/userManagement.ejs) | HTML | 23 | 0 | 0 | 23 |
| [views/auth/login.ejs](/views/auth/login.ejs) | HTML | 27 | 39 | 0 | 66 |
| [views/auth/new.ejs](/views/auth/new.ejs) | HTML | 39 | 29 | 0 | 68 |
| [views/bands/edit.ejs](/views/bands/edit.ejs) | HTML | 73 | 0 | 1 | 74 |
| [views/bands/new.ejs](/views/bands/new.ejs) | HTML | 90 | 0 | 3 | 93 |
| [views/bands/show.ejs](/views/bands/show.ejs) | HTML | 7 | 0 | 1 | 8 |
| [views/errors/error.ejs](/views/errors/error.ejs) | HTML | 2 | 0 | 0 | 2 |
| [views/errors/notFound.ejs](/views/errors/notFound.ejs) | HTML | 2 | 0 | 0 | 2 |
| [views/home/index.ejs](/views/home/index.ejs) | HTML | 20 | 0 | 2 | 22 |
| [views/layouts/boilerplate.ejs](/views/layouts/boilerplate.ejs) | HTML | 28 | 0 | 1 | 29 |
| [views/lives/edit.ejs](/views/lives/edit.ejs) | HTML | 46 | 0 | 2 | 48 |
| [views/lives/index.ejs](/views/lives/index.ejs) | HTML | 24 | 0 | 1 | 25 |
| [views/lives/new.ejs](/views/lives/new.ejs) | HTML | 45 | 0 | 2 | 47 |
| [views/lives/show.ejs](/views/lives/show.ejs) | HTML | 34 | 0 | 3 | 37 |
| [views/lives/show_admin.ejs](/views/lives/show_admin.ejs) | HTML | 58 | 0 | 4 | 62 |
| [views/myPage/index.ejs](/views/myPage/index.ejs) | HTML | 74 | 0 | 5 | 79 |
| [views/partials/editBandForm/song.ejs](/views/partials/editBandForm/song.ejs) | HTML | 39 | 0 | 0 | 39 |
| [views/partials/editBandForm/songs.ejs](/views/partials/editBandForm/songs.ejs) | HTML | 14 | 0 | 1 | 15 |
| [views/partials/flash.ejs](/views/partials/flash.ejs) | HTML | 11 | 0 | 1 | 12 |
| [views/partials/navbar.ejs](/views/partials/navbar.ejs) | HTML | 37 | 0 | 1 | 38 |
| [views/partials/newBandForm/song.ejs](/views/partials/newBandForm/song.ejs) | HTML | 39 | 0 | 0 | 39 |
| [views/partials/newBandForm/songs.ejs](/views/partials/newBandForm/songs.ejs) | HTML | 14 | 0 | 1 | 15 |
| [views/partials/showBand/paTable.ejs](/views/partials/showBand/paTable.ejs) | HTML | 44 | 0 | 1 | 45 |
| [views/partials/showBand/paTableSong.ejs](/views/partials/showBand/paTableSong.ejs) | HTML | 66 | 0 | 0 | 66 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details