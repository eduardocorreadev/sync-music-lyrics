const syncListElement = document.getElementById('sync-list')
const viewerElement = document.getElementById('viewer-lyrics')
let timerLyrics;

if (syncLocal.length > 0) {

    syncLocal.map(item => {

        for (let prop in musicsLocal) {

            if (musicsLocal[prop].directory == item.directory) {

                syncListElement.innerHTML +=
                    `<div class="music" data-directory="${musicsLocal[prop].directory}">
                    <div class="details">
                        <h3>${musicsLocal[prop].name}</h3>
                        <p>${musicsLocal[prop].author}</p>
                    </div>
                    <span>${time.converter(Math.floor(item.time))}</span>
                </div>`

            }
        }
    })

} else {
    syncListElement.innerHTML = `
    <div class="no-sync">
        <img src="assets/images/logo.png">
        <h3>Nenhuma Música Sincronizada foi encontrada!</h3>
        <p>Clique no botão para criar uma Sincronização de música e letra.</p>
    </div>`
}

const musicElements = syncListElement.querySelectorAll('.music')

musicElements.forEach(music => {
    music.addEventListener('click', () => {
        const dataDirectory = music.getAttribute('data-directory')

        for (let prop in musicsLocal) {
            if (musicsLocal[prop].directory == dataDirectory) {
                viewerElement.style.display = 'block'
                document.title = `${musicsLocal[prop].name} | ${musicsLocal[prop].author}`

                controlsLocal.play = true
                setLocal('controls', JSON.stringify(controlsLocal))

                currentMusic.directory = dataDirectory
                setLocal('currentMusic', JSON.stringify(currentMusic))

                source.src = 'musics/' + musicsLocal[prop].directory
                audio.load()
                audio.currentTime = 0
                audio.play()

                controlPlay.innerHTML = '<i class="fas fa-pause"></i>'

                for (let prop in musicElements) {
                    if (musicElements[prop] == music) {

                        let current = 0
                        let lyrics = syncLocal[prop].fullSync
                        const syncActionElement = document.getElementById('sync-action')

                        syncActionElement.innerHTML = ''

                        timerLyrics = setInterval(() => {

                            if (time.converter(Math.floor(audio.currentTime)) == time.converter(Math.floor(lyrics[current].time))) {
                                syncActionElement.innerHTML = `<span class="current">${lyrics[current].line}</span>`
                                current++
                            }

                        }, 100);

                        break
                    }
                }

                break
            }
        }

    })

})

const controlPlay = viewerElement.querySelector('.control-play')
const controlFull = viewerElement.querySelector('.control-full')
const controlTrash = viewerElement.querySelector('.control-trash')
const controlClose = viewerElement.querySelector('.control-close')

function resetProcess() {
    document.title = 'Lyrics Sync Music'

    source.src = ''
    audio.load()
    audio.pause()

    controlsLocal.play = false
    setLocal('controls', JSON.stringify(controlsLocal))

    currentMusic.directory = ''
    currentMusic.lyrics = ''
    setLocal('currentMusic', JSON.stringify(currentMusic))
}

function playState(bol) {
    if (bol) {
        audio.pause()
        controlsLocal.play = false

        starsParams.speed = 0

        controlPlay.innerHTML = '<i class="fas fa-play"></i>'
    } else {
        audio.play()
        controlsLocal.play = true

        starsParams.speed = 7

        controlPlay.innerHTML = '<i class="fas fa-pause"></i>'
    }

    setLocal('controls', JSON.stringify(controlsLocal))
}

function getFullscreenElement() {
    return document.fullscreenElement
        || document.webkitFullscreenElement
        || document.mozFullscreenElement
        || document.msFullscreenElement
}

function toggleFullscreen() {
    if (getFullscreenElement()) {
        document.exitFullscreen()

        controlFull.innerHTML = '<i class="fas fa-expand"></i>'
    } else {
        document.documentElement.requestFullscreen()

        controlFull.innerHTML = '<i class="fas fa-compress"></i>'
    }
}

function closeViewer() {
    viewerElement.style.display = 'none'
    resetProcess()
    clearInterval(timerLyrics)
}

controlPlay.addEventListener('click', () => {
    playState(controlsLocal.play)
})

controlTrash.addEventListener('click', () => {
    playState(true)

    for (let prop in syncLocal) {
        if (syncLocal[prop].directory == currentMusic.directory) {

            if (confirm("Tem certeza que deseja deletar para sempre este Sync?") == true) {
                syncLocal.splice(prop, 1)
                setLocal('sync', JSON.stringify(syncLocal))

                closeViewer()
                window.location.reload(true);
            } else {
                playState(false)
            }

            break
        }
    }
})

controlFull.addEventListener('click', toggleFullscreen)
controlClose.addEventListener('click', closeViewer)
audio.addEventListener('ended', closeViewer)
window.addEventListener('beforeunload', resetProcess)