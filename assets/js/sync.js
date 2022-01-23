/* ============================================ */
/* File that will do all the synchronization of */
/* the song and the lyrics.                     */
/* ============================================ */


/* 
    Tudo que está dentro de window.onload será corregado 
    depois que toda a página for carregada.
*/
window.onload = () => {

    // Header and Footer
    const headerMain = document.getElementById('header-main') // Header Main Element
    const footerMain = document.getElementById('footer-main') // Footer Main Element
    const timerElement = document.getElementById('music-timer-span') // Timer Element - Header

    /* Menu Left Buttons */
    const buttonCheck = document.getElementById('button-check') // Button Check
    const buttonCancel = document.getElementById('button-cancel') // Button Cancel
    const buttonMusicList = document.getElementById('button-music-list') // Button Music List

    /* Select Music Area */
    const selectMusic = document.getElementById('select-music') // Área para selecionar uma música
    const musicList = document.getElementById('music-list') // Music List

    // Lyrics Area and content
    const lyricsArea = document.getElementById('lyrics-area') // Lyrics Area
    const textLyrics = lyricsArea.querySelector('#lyrics-content') // Content of the textarea that has the lyrics of the song

    // Container Main Sync
    const containerMain = document.getElementById('container-main')

    // Controls Buttons
    const controlPlay = document.getElementById('control-play') // Control Play
    const controlRestart = document.getElementById('control-restart') // Control Restart
    const controlAdd = document.getElementById('control-add') // Control Add (Important)
    const controlLyrics = document.getElementById('control-lyrics') // Control Show Lyrics
    const controlTrash = document.getElementById('control-trash') // Control Trash

    const iconsPlay = ['<i class="fas fa-play"></i>', '<i class="fas fa-pause"></i>'] // Play button status icons

    let blockLyrics // Variavel para armazenar todos os items de letras. 
    let current = 0 // Variavel para armazenar a posição atual do item de letra.
    let syncMain = [] // Array para armazenar toda sincronazação.

    // Função para adicionar e remover a lista de música.
    function listMusicMenu() {
        buttonMusicList.classList.toggle('active')
        selectMusic.classList.toggle('music-list-on')
    }

    /* Open Music List */
    buttonMusicList.addEventListener('click', listMusicMenu) // Button in navbar
    document.querySelector('.list-music-button').addEventListener('click', listMusicMenu) // Button of no music selected

    /* 
       Função que irá criar todos os elementos da lista de músicas.
       Irá percorrer todo o array de música e adicinar na lista vistual.
       [data-directory] para armazenar o diretorio onde a música está presente; 

    */
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

    /* 
      Função que irá criar todos os elementos de letra e exibir na tela. 

    */
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


    /* 
       Obj que irá armazenar todas funções dos controles da sincronização.

       - play: Ao clicar no botão play será verificado se existe o play ativo ou não,
       se existir, irá dar pause na música, se não irá dar start na música.

       - pause: Pausa a música e altera o icone do botão.

       - restart: Para dar restart na música.

       - add: 
    */
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

                /*
                
                    Irá verificar se a música está rodando antes de começar.
                    A variavel current que foi setado lá em cima será usado aqui para aramazenar a posição atual da letra.
                    
                    Será adiconado a linha da letra na variavel syncMain também criada lá em cima.

                    currentItem() irá adicionar a posição atual da letra visualmente.
                */
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

                function saveSync() {
                    syncLocal.push({ directory: currentMusic.directory, time: audio.duration, fullSync: syncMain })
                    setLocal('sync', JSON.stringify(syncLocal))
                }

                saveSync()

                // for (let prop in syncLocal) {

                //     if (syncLocal[prop].directory == currentMusic.directory) {
                //         if (confirm("Error! Já existe um Sync com essa música. Deseja substituir a existente por este Sync?") == true) {
                //             syncLocal.splice(prop, 1)
                //             saveSync()

                //             break
                //         }

                //         saveSync()
                //         window.location.href = 'index.html'
                //     }
                // }
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
