// By: https://codepen.io/ksenia-k/

// DOM selectors
const stars = document.getElementById('stars');
const starsCtx = stars.getContext('2d');

// run stars
setupStars();
updateStars();

// update stars on resize to keep them centered
window.onresize = function () {
    setupStars();
};

// star constructor
function Star() {
    this.x = Math.random() * stars.width;
    this.y = Math.random() * stars.height;
    this.z = Math.random() * stars.width;

    this.move = function () {
        this.z -= starsParams.speed;
        if (this.z <= 0) {
            this.z = stars.width;
        }
    };

    this.show = function () {
        let x, y, rad, opacity;
        x = (this.x - screenAnime.c[0]) * (stars.width / this.z);
        x = x + screenAnime.c[0];
        y = (this.y - screenAnime.c[1]) * (stars.width / this.z);
        y = y + screenAnime.c[1];
        rad = stars.width / this.z;
        opacity = (rad > starsParams.extinction) ? 1.5 * (2 - rad / starsParams.extinction) : 1;

        starsCtx.beginPath();
        starsCtx.fillStyle = "rgba(255, 255, 255, " + opacity + ")";
        starsCtx.arc(x, y, rad, 0, Math.PI * 2);
        starsCtx.fill();
    }
}

// setup <canvas>, create all the starts
function setupStars() {
    screenAnime = {
        w: window.innerWidth,
        h: window.innerHeight,
        c: [window.innerWidth * 0.5, window.innerHeight * 0.5]
    };
    window.cancelAnimationFrame(updateStars);
    stars.width = screenAnime.w;
    stars.height = screenAnime.h;
    starsElements = [];
    for (let i = 0; i < starsParams.number; i++) {
        starsElements[i] = new Star();
    }
}

// redraw the frame
function updateStars() {
    starsCtx.fillStyle = "black";
    starsCtx.fillRect(0, 0, stars.width, stars.height);
    starsElements.forEach(function (s) {
        s.show();
        s.move();
    });
    window.requestAnimationFrame(updateStars);
}

