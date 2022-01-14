window.onload = () => {

    const headerMain = document.getElementById('header-main')
    const footerMain = document.getElementById('footer-main')

    /* Menu Left Buttons */
    const buttonCheck = document.getElementById('button-check')
    const buttonCancel = document.getElementById('button-cancel')
    const buttonMusicList = document.getElementById('button-music-list')

    const selectMusic = document.getElementById('select-music')
    const lyricsArea = document.getElementById('lyrics-area')
    const containerMain = document.getElementById('container-main')

    // Controls Buttons
    const controlPlay = document.getElementById('control-play')
    const controlRestart = document.getElementById('control-restart')
    const controlAdd = document.getElementById('control-add')
    const controlLyrics = document.getElementById('control-lyrics')
    const controlTrash = document.getElementById('control-trash')

    const iconsPlay = ['<i class="fas fa-play"></i>', '<i class="fas fa-pause"></i>']
    const timerElement = document.getElementById('music-timer-span')

    const createLyricsContainer = document.createElement('div')
    let blockLyrics;

    function editMenuLeft() {
        buttonMusicList.classList.toggle('active')
        selectMusic.classList.toggle('music-list-on')
    }

    /* Open Music List */
    buttonMusicList.addEventListener('click', editMenuLeft)

    function createElementsMusics() {
        const musicList = document.getElementById('music-list')

        musicsLocal.map(music => {
            const createMusicItem = `
            <div class="music" data-directory="${music.directory}">
                <h3>${music.name}</h3>
                <p>${music.author}</p>
            </div>`

            musicList.innerHTML += createMusicItem
        })
    }

    function loadMusic() {
        if (currentMusic.directory != '') {

            for (let prop in musicsLocal) {
                if (currentMusic.directory == musicsLocal[prop].directory) {
                    source.src = 'musics/' + musicsLocal[prop].directory
                    audio.load()

                    document.getElementById('name-music-header').innerHTML = musicsLocal[prop].name
                    document.getElementById('author-music-header').innerHTML = musicsLocal[prop].author
                    headerMain.style.display = 'block'
                    footerMain.style.display = 'block'
                    containerMain.innerHTML = ''

                    if (currentMusic.lyrics) {
                        createElementsLyrics()
                    } else {
                        containerMain.innerHTML +=
                            `<div class="msg-music">
                            <img src="assets/images/logo.png">
                            <h3>Nenhuma letra foi encontrada!</h3>
                            <p>Clique no ícone piscando no player para adicionar uma letra!</p>
                            </div>`

                        controlLyrics.classList.add('no-lyrics')
                    }

                    break
                }
            }
        }
    }

    function createElementsLyrics() {
        createLyricsContainer.classList.add('lyrics-container')

        containerMain.innerHTML = ''
        controlPlay.classList.add('control-on')
        containerMain.appendChild(createLyricsContainer)

        const getLyrics = currentMusic.lyrics.split('\n')

        getLyrics.map(lyric => {
            if (lyric != '') {
                createLyricsContainer.innerHTML +=
                    `<div class="block-lyrics">
                    <h3>${lyric}</h3>
                    <span></span>
                    </div>`
            }
        })

        blockLyrics = createLyricsContainer.querySelectorAll('.block-lyrics')
    }




    let current = 0
    let syncMain = []

    const controls = {
        play() {

            if (currentMusic.lyrics != '') {
                if (!controlsLocal.play) {
                    audio.play()

                    controlPlay.innerHTML = iconsPlay[1]

                    controlsLocal.play = true
                    setLocal('controls', JSON.stringify(controlsLocal))

                    controls.currentItem()
                    controls.timer()

                } else {
                    controls.pause()
                }
            }

        },
        pause() {
            audio.pause()

            controlPlay.innerHTML = iconsPlay[0]

            controlsLocal.play = false
            setLocal('controls', JSON.stringify(controlsLocal))
        },
        restart() {
            audio.currentTime = 0
        },
        add() {
            if (controlsLocal.play) {
                createLyricsContainer.querySelectorAll('.block-lyrics')[current].classList.remove('current')
                createLyricsContainer.querySelectorAll('.block-lyrics')[current].classList.add('done')

                blockLyrics[current].querySelector('span').innerHTML = time.converter(Math.floor(audio.currentTime))

                syncMain.push({ line: blockLyrics[current].querySelector('h3').textContent, time: audio.currentTime })

                console.log(syncMain)
                current++
                controls.currentItem()
            }
        },
        currentItem() {
            createLyricsContainer.querySelectorAll('.block-lyrics')[current].classList.add('current')
        },
        timer() {
            setInterval(() => {
                time.display(timerElement)
            }, 100);
        },
        lyrics() {
            lyricsArea.classList.toggle('on-lyrics-area')

            lyricsArea.querySelector('#save-lyrics').addEventListener('click', () => {
                const textLyrics = lyricsArea.querySelector('#lyrics-content')

                if (textLyrics.value != 'Letra não encontrada!') {
                    currentMusic.lyrics = textLyrics.value
                    setLocal('currentMusic', JSON.stringify(currentMusic))

                    createElementsLyrics()

                    controlLyrics.classList.remove('no-lyrics')
                    lyricsArea.classList.remove('on-lyrics-area')
                }
            })

            lyricsArea.querySelector('#cancel-lyrics').addEventListener('click', () => {
                lyricsArea.classList.remove('on-lyrics-area')
            })
        },
        trash() {
            syncMain = []
            current = 0
        }
    }


    /* Add Musics in List */
    if (musicsLocal) {
        createElementsMusics()

        /* Criar um item para cada uma das musicas */
        document.querySelectorAll('.music').forEach(music => {

            // Quando uma música for clicada
            music.addEventListener('click', () => {
                const getDirectoryElement = music.getAttribute('data-directory') // Directory presente no data do elemento
                controls.pause()

                for (prop in musicsLocal) {

                    // Verificar se a música que foi clicada existe!
                    if (getDirectoryElement == musicsLocal[prop].directory) {

                        editMenuLeft() // Menu Lateral esquerdo

                        /* Adicionando em current music a musica atual */
                        currentMusic.directory = musicsLocal[prop].directory
                        currentMusic.lyrics = ''

                        // Atualizando o currentMusic
                        setLocal('currentMusic', JSON.stringify(currentMusic))

                        // Removendo o footer e o header
                        headerMain.style.display = 'none'
                        footerMain.style.display = 'none'
                        containerMain.innerHTML = `<div class="loading"><i class="fas fa-sync-alt"></i></div>` // Loading

                        setTimeout(() => {
                            loadMusic()
                        }, 2000);

                        break
                    }
                }

            })
        })

    }

    controlPlay.addEventListener('click', controls.play)
    controlRestart.addEventListener('click', controls.restart)
    controlAdd.addEventListener('click', controls.add)
    controlLyrics.addEventListener('click', controls.lyrics) // Show Lyrics
    controlTrash.addEventListener('click', controls.trash)


    audio.addEventListener('ended', controls.pause)
    window.addEventListener('beforeunload', controls.pause)

    buttonCheck.addEventListener('click', () => {
        if (syncMain.length > 0) {

            if (confirm("Tem certeza que está tudo correto e deseja salvar este Sync?") == true) {

                const getSyncLocal = JSON.parse(getLocal('sync'))
                getSyncLocal.push({ directory: currentMusic.directory, time: audio.duration, fullSync: syncMain })

                setLocal('sync', JSON.stringify(getSyncLocal))

                window.location.href = 'index.html'
            }

        } else {
            alert('Nenhum Sync foi Gerado!')
        }

    })

    buttonCancel.addEventListener('click', () => {
        if (syncMain.length > 0) {

            if (confirm("Tem certeza que deseja descartar este Sync?") == true) {
                window.location.href = 'index.html'
            }

        } else {
            window.location.href = 'index.html'
        }
    })

}
