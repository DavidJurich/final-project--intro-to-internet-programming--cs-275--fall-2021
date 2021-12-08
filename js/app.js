let current = 1


document.addEventListener('keydown', function(e) {
    console.log(e);
    if (e.key === `ArrowRight`) {
    next();
    } else if (e.key === `ArrowLeft`) {
    last();
    }
});


function next() {

    if (current === 3) {
        current = 1

        window.location.href = `#slide-${current}`
    } else {
        current += 1
        window.location.href = `#slide-${current}`

    }
}

function last() {

    if (current === 1) {
        current = 3

        window.location.href = `#slide-${current}`
    } else {
        current -= 1
        window.location.href = `#slide-${current}`

    }
}