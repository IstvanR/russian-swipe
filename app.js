let words = [];
let index = 0;

// render
function render() {
    if (!words.length) return;

    document.getElementById("hu").innerText = words[index].hu;
    document.getElementById("ru").innerText = words[index].ru;
    document.getElementById("counter").innerText =
        (index + 1) + " / " + words.length;
}

// animáció wrapper
function animateChange(direction, callback) {
    const card = document.getElementById("card");

    if (direction === "up") {
        card.classList.add("slide-up");
    } else {
        card.classList.add("slide-down");
    }

    setTimeout(() => {
        callback();

        card.classList.remove("slide-up");
        card.classList.remove("slide-down");
    }, 200);
}

// next
function next() {
    if (index < words.length - 1) {
        animateChange("up", () => {
            index++;
            render();
        });
    }
}

// prev
function prev() {
    if (index > 0) {
        animateChange("down", () => {
            index--;
            render();
        });
    }
}

// swipe detection
let startY = 0;

function handleSwipe(endY) {
    let diff = startY - endY;

    if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
    }
}

// mobile
document.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", e => {
    handleSwipe(e.changedTouches[0].clientY);
});

// desktop
document.addEventListener("mousedown", e => {
    startY = e.clientY;
});

document.addEventListener("mouseup", e => {
    handleSwipe(e.clientY);
});

// CSV load
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