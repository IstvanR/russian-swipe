
/* =========================
   STATE
========================= */

let words = [];
let index = 0;

/* =========================
   MENU TOGGLE
========================= */

const menuBtn = document.getElementById("menuBtn");
const menuPanel = document.getElementById("menuPanel");

menuBtn.addEventListener("click", () => {
    menuPanel.classList.toggle("hidden");

    if (!menuPanel.classList.contains("hidden")) {
        openTab("gotoTab");
    }
});

/* =========================
   TAB SWITCH
========================= */

function openTab(tabId) {

    document.querySelectorAll(".menuTab")
        .forEach(tab => tab.classList.add("hidden"));

    document.getElementById(tabId)
        .classList.remove("hidden");
}

/* =========================
   GO TO PAGE
========================= */

function goToPage() {

    const input = document.getElementById("pageInput");

    let page = parseInt(input.value);

    if (isNaN(page)) return;

    page = page - 1;

    if (page < 0 || page >= words.length) return;

    index = page;

    render();

    menuPanel.classList.add("hidden");
}

/* =========================
   CONTENTS JUMP
========================= */

function jumpTo(page) {

    if (page < 0) return;
    if (page >= words.length) return;

    index = page;

    render();

    menuPanel.classList.add("hidden");
}

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
   RANDOM COLOR
========================= */

function randomColor() {

    const hue = Math.floor(Math.random() * 360);

    return `hsl(${hue}, 80%, 50%)`;
}

/* =========================
   CONTRAST COLOR
========================= */

function getContrastColor(hslColor) {

    const temp = document.createElement("div");

    temp.style.color = hslColor;

    document.body.appendChild(temp);

    const rgb = getComputedStyle(temp).color;

    document.body.removeChild(temp);

    const values = rgb.match(/\d+/g);

    const r = values[0];
    const g = values[1];
    const b = values[2];

    const luminance =
        (0.299 * r + 0.587 * g + 0.114 * b);

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
   SWIPE GESTURE
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