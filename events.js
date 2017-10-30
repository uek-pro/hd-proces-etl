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
    controller.updateUI(ProductStatus.EXTRACTED);
});

// zdarzenie klinięcia w przycisk Transform
processBtns[2].addEventListener('click', function () {

    // TODO: implementacja Transform
    controller.updateUI(ProductStatus.TRANSFORMED);
});

// zdarzenie klinięcia w przycisk Load
processBtns[3].addEventListener('click', function () {

    // TODO: implementacja Load + info o liczbie dodanych rekordów do bazy (dane nie mogą się dublować)
    controller.updateUI(ProductStatus.LOADED);
});