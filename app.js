/* =========================
   STATE
========================= */

let words = [];
let index = 0;

// true = magyar
// false = orosz
let showHungarian = true;


/* =========================
   MENU
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
   TABS
========================= */

function openTab(tabId) {

    document.querySelectorAll(".menuTab").forEach(tab => {

        tab.classList.add("hidden");

    });

    document.getElementById(tabId).classList.remove("hidden");

}


/* =========================
   GO TO PAGE
========================= */

function goToPage() {

    const input = document.getElementById("pageInput");

    let page = parseInt(input.value);

    if (isNaN(page)) return;

    page--;

    if (page < 0) return;
    if (page >= words.length) return;

    index = page;
    showHungarian = true;

    render();

    menuPanel.classList.add("hidden");

}


/* =========================
   CONTENTS
========================= */

function jumpTo(page) {

    if (page < 0) return;
    if (page >= words.length) return;

    index = page;
    showHungarian = true;

    render();

    menuPanel.classList.add("hidden");

}


/* =========================
   FLIP
========================= */

document.getElementById("flipBtn").addEventListener("click", () => {

    showHungarian = !showHungarian;

    render();

});


/* =========================
   RENDER
========================= */

function render() {

    if (words.length === 0) return;

    const bg = randomColor();
    const textColor = getContrastColor(bg);

    document.body.style.background = bg;
    document.body.style.color = textColor;

    const label = document.getElementById("languageLabel");
    const word = document.getElementById("word");
    const btn = document.getElementById("flipBtn");

    if (showHungarian) {

        label.innerText = "MAGYAR";
        word.innerText = words[index].hu;
        btn.innerText = "Mutasd az oroszt";

    } else {

        label.innerText = "РУССКИЙ";
        word.innerText = words[index].ru;
        btn.innerText = "Mutasd a magyart";

    }

    document.getElementById("counter").innerText =
        (index + 1) + " / " + words.length;

}


/* =========================
   RANDOM COLOR
========================= */

function randomColor() {

    const hue = Math.floor(Math.random() * 360);

    return `hsl(${hue},80%,50%)`;

}


/* =========================
   TEXT COLOR
========================= */

function getContrastColor(hslColor) {

    const temp = document.createElement("div");

    temp.style.color = hslColor;

    document.body.appendChild(temp);

    const rgb = getComputedStyle(temp).color;

    document.body.removeChild(temp);

    const values = rgb.match(/\d+/g);

    const r = parseInt(values[0]);
    const g = parseInt(values[1]);
    const b = parseInt(values[2]);

    const luminance =
        0.299 * r +
        0.587 * g +
        0.114 * b;

    return luminance > 140 ? "#000000" : "#FFFFFF";

}


/* =========================
   NAVIGATION
========================= */

function next() {

    if (index >= words.length - 1)
        return;

    index++;

    showHungarian = true;

    render();

}


function prev() {

    if (index <= 0)
        return;

    index--;

    showHungarian = true;

    render();

}


/* =========================
   SWIPE
========================= */

let startY = 0;

function handleSwipe(endY) {

    const diff = startY - endY;

    if (Math.abs(diff) < 50)
        return;

    if (diff > 0)
        next();
    else
        prev();

}


/* =========================
   TOUCH
========================= */

document.addEventListener("touchstart", e => {

    startY = e.touches[0].clientY;

});

document.addEventListener("touchend", e => {

    handleSwipe(e.changedTouches[0].clientY);

});


/* =========================
   MOUSE
========================= */

document.addEventListener("mousedown", e => {

    startY = e.clientY;

});

document.addEventListener("mouseup", e => {

    handleSwipe(e.clientY);

});


/* =========================
   KEYBOARD
========================= */

document.addEventListener("keydown", e => {

    switch (e.key) {

        case "ArrowUp":
            prev();
            break;

        case "ArrowDown":
            next();
            break;

        case " ":
        case "Enter":
            e.preventDefault();
            showHungarian = !showHungarian;
            render();
            break;

    }

});


/* =========================
   CSV LOAD
========================= */

fetch("words.csv")
    .then(res => res.text())
    .then(text => {

        const results = Papa.parse(text, {

            header: false,
            skipEmptyLines: true

        });

        words = results.data
            .filter(row => row.length >= 3)
            .map(row => ({

                id: parseInt(row[0]),

                hu: row[1].trim(),

                ru: row[2].trim()

            }));

        index = 0;

        showHungarian = true;

        render();

    })
    .catch(err => {

        console.error(err);

        document.getElementById("word").innerText =
            "Nem sikerült betölteni a words.csv fájlt.";

    });