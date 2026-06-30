let words = [];
let index = 0;

/* =========================
   RENDER
========================= */
function render() {
    if (!words.length) return;

    const bg = randomColor();
    const textColor = getContrastColor(bg);

    document.body.style.background = bg;
    document.body.style.color = textColor;

    document.getElementById("hu").innerText = words[index].hu;
    document.getElementById("ru").innerText = words[index].ru;
    document.getElementById("counter").innerText =
        (index + 1) + " / " + words.length;
}

/* =========================
   RANDOM BG COLOR
========================= */
function randomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 80%, 50%)`;
}

/* =========================
   CONTRAST CALC
========================= */
function getContrastColor(hslColor) {
    const temp = document.createElement("div");
    temp.style.color = hslColor;
    document.body.appendChild(temp);

    const rgb = getComputedStyle(temp).color;
    document.body.removeChild(temp);

    const values = rgb.match(/\d+/g);
    const r = values[0], g = values[1], b = values[2];

    const luminance = (0.299*r + 0.587*g + 0.114*b);

    return luminance > 140 ? "#000" : "#fff";
}

/* =========================
   NAVIGATION
========================= */
function next() {
    if (index < words.length - 1) {
        index++;
        render();
    }
}

function prev() {
    if (index > 0) {
        index--;
        render();
    }
}

/* =========================
   SWIPE
========================= */
let startY = 0;

function handleSwipe(endY) {
    let diff = startY - endY;

    if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
    }
}

document.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", e => {
    handleSwipe(e.changedTouches[0].clientY);
});

document.addEventListener("mousedown", e => {
    startY = e.clientY;
});

document.addEventListener("mouseup", e => {
    handleSwipe(e.clientY);
});

/* =========================
   CSV LOAD
========================= */
fetch("words.csv")
    .then(res => res.text())
    .then(text => {
        const results = Papa.parse(text, {
            header: true,
            skipEmptyLines: true
        });

        words = results.data.filter(w => w.hu && w.ru);

        index = 0;
        render();
    });