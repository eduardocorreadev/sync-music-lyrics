window.onload = () => {

    const headerMain = document.getElementById('header-main')
    const footerMain = document.getElementById('footer-main')

    /* Menu Left Buttons */
    const buttonCheck = document.getElementById('button-check')
    const buttonCancel = document.getElementById('button-cancel')
    const buttonMusicList = document.getElementById('button-music-list')

    const selectMusic = document.getElementById('select-music')
    const musicList = document.getElementById('music-list')
    const lyricsArea = document.getElementById('lyrics-area')
    const containerMain = document.getElementById('container-main')

    // Controls Buttons
    const controlPlay = document.getElementById('control-play')
    const controlRestart = document.getElementById('control-restart')
    const controlAdd = document.getElementById('control-add')
    const controlLyrics = document.getElementById('control-lyrics')
    const controlTrash = document.getElementById('control-trash')

    const textLyrics = lyricsArea.querySelector('#lyrics-content')

    const iconsPlay = ['<i class="fas fa-play"></i>', '<i class="fas fa-pause"></i>']

    const timerElement = document.getElementById('music-timer-span')

    let blockLyrics;
    let current = 0
    let syncMain = []

    function listMusicMenu() {
        buttonMusicList.classList.toggle('active')
        selectMusic.classList.toggle('music-list-on')
    }

    /* Open Music List */
    buttonMusicList.addEventListener('click', listMusicMenu)
    document.querySelector('.list-music-button').addEventListener('click', listMusicMenu)


    function createElementsMusics() {

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

        const createLyricsContainer = document.createElement('div')
        createLyricsContainer.classList.add('lyrics-container')

        containerMain.innerHTML = ''
        containerMain.appendChild(createLyricsContainer)

        controlPlay.classList.add('control-on')

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


    const controls = {
        play() {

            if (currentMusic.lyrics != '') {
                if (!controlsLocal.play) {
                    audio.play()

                    controlPlay.innerHTML = iconsPlay[1]
                    controlRestart.classList.add('control-on')

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
            if (audio.currentTime > 0) {
                audio.currentTime = 0
            }
        },
        add() {
            if (controlsLocal.play) {
                blockLyrics[current].classList.add('done')
                blockLyrics[current].classList.remove('current')

                blockLyrics[current].querySelector('span').innerHTML = time.converter(Math.floor(audio.currentTime))

                syncMain.push({ line: blockLyrics[current].querySelector('h3').textContent, time: audio.currentTime })

                current++
                controls.currentItem()
            }
        },
        currentItem() {
            blockLyrics[current].classList.add('current')

            if (current > 0) {
                controlTrash.classList.add('control-trash')
            } else {
                controlTrash.classList.remove('control-trash')
            }

        },
        timer() {
            setInterval(() => {
                time.display(timerElement)
            }, 100);
        },
        lyrics() {
            lyricsArea.classList.toggle('on-lyrics-area')

            if (textLyrics.value == '') {

                textLyrics.value = 'Procurando Letra...'

                setTimeout(() => {
                    let xml = new XMLHttpRequest()

                    for (let prop in musicsLocal) {

                        if (musicsLocal[prop].directory == currentMusic.directory) {
                            let urlVagalume = `https://api.vagalume.com.br/search.php?art=${musicsLocal[prop].author}&mus=${musicsLocal[prop].name}`

                            xml.open('GET', urlVagalume, true)
                            xml.send(null)

                            xml.onload = () => {
                                if (xml.readyState == 4 && (xml.status >= 200 && xml.status < 400)) {
                                    let resultLyrics = JSON.parse(xml.responseText)

                                    if (resultLyrics.type == 'exact' || resultLyrics.type == 'aprox') {
                                        textLyrics.value = resultLyrics.mus[0].text
                                    } else {
                                        textLyrics.value = 'Letra não encontrada!'
                                    }
                                }
                            }

                            break
                        }
                    }
                }, 2000);
            }

            lyricsArea.querySelector('#save-lyrics').addEventListener('click', () => {
                if (textLyrics.value != '' && textLyrics.value != 'Procurando Letra...' && textLyrics.value != 'Letra não encontrada!') {

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
            if (current > 0) {
                syncMain = []
                current = 0

                controls.restart()
                controls.pause()

                createElementsLyrics()

                controlTrash.classList.remove('control-trash')
            }
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

                controlPlay.classList.remove('control-on')
                controlRestart.classList.remove('control-on')

                for (prop in musicsLocal) {

                    // Verificar se a música que foi clicada existe!
                    if (getDirectoryElement == musicsLocal[prop].directory) {

                        listMusicMenu() // Menu Lateral esquerdo

                        textLyrics.value = ''

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
    controlLyrics.addEventListener('click', controls.lyrics)
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
