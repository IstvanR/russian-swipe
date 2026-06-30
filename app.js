let words = [];
let index = 0;

function render() {
    document.getElementById("hu").innerText = words[index].hu;
    document.getElementById("ru").innerText = words[index].ru;
    document.getElementById("counter").innerText =
        (index + 1) + " / " + words.length;
}

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

// swipe
let startY = 0;

document.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", e => {
    let endY = e.changedTouches[0].clientY;
    let diff = startY - endY;

    if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
    }
});

// CSV betöltés
Papa.parse("words.csv", {
    download: true,
    header: true,
    complete: function(results) {
        words = results.data.filter(w => w.hu && w.ru);
        index = 0;
        render();
    }
});