let words = [];
let index = 0;

// render UI
function render() {
    if (!words.length) return;

    document.getElementById("hu").innerText = words[index].hu;
    document.getElementById("ru").innerText = words[index].ru;
    document.getElementById("counter").innerText =
        (index + 1) + " / " + words.length;
}

// next word
function next() {
    if (index < words.length - 1) {
        index++;
        render();
    }
}

// previous word
function prev() {
    if (index > 0) {
        index--;
        render();
    }
}

// swipe logic
let startY = 0;

function handleSwipe(endY) {
    let diff = startY - endY;

    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            next(); // swipe up
        } else {
            prev(); // swipe down
        }
    }
}

// MOBILE swipe
document.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", e => {
    handleSwipe(e.changedTouches[0].clientY);
});

// DESKTOP swipe (mouse)
document.addEventListener("mousedown", e => {
    startY = e.clientY;
});

document.addEventListener("mouseup", e => {
    handleSwipe(e.clientY);
});

// CSV load
Papa.parse("words.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    encoding: "UTF-8",
    complete: function(results) {

        console.log("CSV loaded:", results.data);

        words = results.data.filter(w => w.hu && w.ru);

        index = 0;
        render();
    }
});