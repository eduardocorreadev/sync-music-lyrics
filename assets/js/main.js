let titlePage = document.title

/* Audio */
const audio = document.querySelector('audio')
const source = document.querySelector('source')

function setLocal(key, value) {
    localStorage.setItem(key, value)
}

function getLocal(key) {
    return localStorage.getItem(key)
}

if (!getLocal('currentMusic')) {
    setLocal('currentMusic', JSON.stringify({ lyrics: "", directory: "" }))
}

if (!getLocal('controls')) {
    setLocal('controls', JSON.stringify({ play: false }))
}

if (!getLocal('sync')) {
    setLocal('sync', JSON.stringify([]))
}

let musicsLocal = JSON.parse(getLocal('musics'))
let currentMusic = JSON.parse(getLocal('currentMusic'))
let controlsLocal = JSON.parse(getLocal('controls'))
let syncLocal = JSON.parse(getLocal('sync'))

const time = {
    converter(time) {
        let m = Math.floor(time / 60)
        let s = time - m * 60

        return `${m.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}:${s.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`
    },
    display(element) {
        element.innerHTML = `${this.converter(Math.floor(audio.currentTime))} | ${this.converter(Math.floor(audio.duration))}`
    }
}

const musicList = [
    {
        name: "7 Rings",
        author: "Ariana Grande",
        directory: "ariana-grande-7-rings-lyrics-2854589.mp3"
    },
    {
        name: "Someone To You",
        author: "BANNERS",
        directory: "BANNERS - Someone To You.mp3"
    },
    {
        name: "Bad Guy",
        author: "Billie Eilish",
        directory: "Billie Eilish - bad guy.mp3"
    },
    {
        name: "Always",
        author: "Bon Jovi",
        directory: "Bon Jovi - Always.mp3"
    },
    {
        name: "Ela tá Movimentando",
        author: "MC Kevin O Chris, Dulce María",
        directory: "MC Kevin O Chris, Dulce María.mp3"
    },
    {
        name: "Firework",
        author: "Katy Perry",
        directory: "firework-katyperry.mp3"
    },
    {
        name: "Tempos Modernos",
        author: "Make U Sweat, Lulu Santos",
        directory: "Make U Sweat, Lulu Santos - Tempos Modernos.mp3"
    }
]

setLocal('musics', JSON.stringify(musicList))

function resetProcess() {
    titlePage = 'Lyrics Sync Music'

    source.src = ''
    audio.load()
    audio.pause()

    currentMusic.directory = ''
    currentMusic.lyrics = ''
    setLocal('currentMusic', JSON.stringify(currentMusic))
}

