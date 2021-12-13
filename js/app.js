window.onload = () => {
    let current = 1;

    // const leftarrow = document.getElementById(`left-arrow`);
    // const rightarrow = document.getElementById(`right-arrow`);

    document.addEventListener(`keydown`, function(e) {
        console.log(e);
        if (e.key === `ArrowRight`) {
            next();
        } else if (e.key === `ArrowLeft`) {
            last();
        }
    });

    // let checkSlide = () => {
    //     if (index > 0 && index < 4) {
    //         leftarrow.classList.remove(`hidden`);
    //         rightarrow.classList.remove(`hidden`);
    //     } else if (index === 0) {
    //         leftarrow.classList.add(`hidden`);
    //     } else if (index === 4){
    //         rightarrow.classList.add(`hidden`);
    //     }
    // };


    function next() {
        if (current === 4)
        {
            current = 1;

            window.location.href = `#slide-${current}`;
            // `#slide-${current}`.classlist.add(`.move`);
        } else {
            current += 1;
            window.location.href = `#slide-${current}`;
            // current.classlist.add(`.move`);
            // checkSlide();
        }
    }

    function last() {

        if (current === 1) {
            current = 4;

            window.location.href = `#slide-${current}`;
            // `#slide-${current}`.classlist.add(`.move`);
        } else {
            current -= 1;
            window.location.href = `#slide-${current}`;
            // `#slide-${current}`.classlist.add(`.move`);
            // checkSlide();

        }
    }
};
