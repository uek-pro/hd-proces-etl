const idElement = document.getElementById('idValue');
const processBtns = document.querySelectorAll("input.process-button");

document.querySelector('input[value=Pokaż]').addEventListener('click', function () {
    
    controller.showProductIfExists(idElement.value);
});

// zdarzenie klinięcia w przycisk ETL
processBtns[0].addEventListener('click', function () {

    controller.showProductsReviews();
});

// zdarzenie klinięcia w przycisk Extract
processBtns[1].addEventListener('click', function () {

    // TODO: implementacja Extract + info o liczbie pobranych plików
    updateUI(ProductStatus.EXTRACTED);
});

// zdarzenie klinięcia w przycisk Transform
processBtns[2].addEventListener('click', function () {

    // TODO: implementacja Transform
    updateUI(ProductStatus.TRANSFORMED);
});

// zdarzenie klinięcia w przycisk Load
processBtns[3].addEventListener('click', function () {

    // TODO: implementacja Load + info o liczbie dodanych rekordów do bazy (dane nie mogą się dublować)
    updateUI(ProductStatus.LOADED);
});


updateUI(ProductStatus.NONE);

function updateUI(state) {
    if (state == ProductStatus.NONE) {
        processBtns[0].disabled = true;
        processBtns[1].disabled = true;
        processBtns[2].disabled = true;
        processBtns[3].disabled = true;
    } else if (state == ProductStatus.FOUNDED || state == ProductStatus.LOADED) {
        processBtns[0].disabled = false;
        processBtns[1].disabled = false;
        processBtns[2].disabled = true;
        processBtns[3].disabled = true;
    } else if (state == ProductStatus.EXTRACTED) {
        processBtns[0].disabled = true;
        processBtns[1].disabled = true;
        processBtns[2].disabled = false;
        processBtns[3].disabled = true;
    } else if (state == ProductStatus.TRANSFORMED) {
        processBtns[0].disabled = true;
        processBtns[1].disabled = true;
        processBtns[2].disabled = true;
        processBtns[3].disabled = false;
    }
}