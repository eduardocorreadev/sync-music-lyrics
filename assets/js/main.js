/* ============================================ */
/*  Main file that will help all others work.   */
/*  By: ucarlos1001                             */
/* ============================================ */

console.log('❤️️') // Thanks :)

const audio = document.querySelector('audio') // Audio Element
const source = document.querySelector('source') // Source Element

/* Functions to convert and show time */
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

/* 
   Anime.js variables for background animation. 
   Speed, number and extinction.
*/
let screenAnime, starsElements, starsParams = { speed: 7, number: 400, extinction: 3 };

// Function to set item to localstorage
function setLocal(key, value) {
    localStorage.setItem(key, value)
}

// Function to get item from localstorage
function getLocal(key) {
    return localStorage.getItem(key)
}


// Check if items are present in localstorage and if not create.
/* CurrentMusic - Item to store the current song being played. */
if (!getLocal('currentMusic')) {
    setLocal('currentMusic', JSON.stringify({ lyrics: "", directory: "" }))
}

/* Controls - Item to store play state */
if (!getLocal('controls')) {
    setLocal('controls', JSON.stringify({ RemotePlayback: false }))
}

/* Sync - Item to store completed syncs. */
if (!getLocal('sync')) {
    setLocal('sync', JSON.stringify([]))
}


// Getting the items present in localstorage
let musicsLocal = JSON.parse(getLocal('musics')) // Getting all songs
let currentMusic = JSON.parse(getLocal('currentMusic')) // Getting currentMusic
let controlsLocal = JSON.parse(getLocal('controls')) // Getting Control State
let syncLocal = JSON.parse(getLocal('sync')) // Getting Completed Syncs

// Adding all songs to an object
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
    },
    {
        name: "Já Que Me Ensinou a Beber",
        author: "Os Barões da Pisadinha",
        directory: "Os Barões da Pisadinha - Já Que Me Ensinou a Beber.mp3"
    },
    {
        name: "Jorge & Mateus",
        author: "Seu Astral",
        directory: "Jorge & Mateus - Seu Astral.mp3"
    }
]

// Adding the object to an item in localstorage
setLocal('musics', JSON.stringify(musicList)) 