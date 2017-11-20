const view = {
    displayProductInfo(product) {
        document.getElementById('product-result').innerHTML = (
            "<dl><dt>Id</dt><dd><a href='https://www.ceneo.pl/" + product.id + "'>" + product.id + "</a></dd>" +
            "<dt>Rodzaj urządzenia</dt><dd>" + product.type + "</dd>" +
            "<dt>Marka</dt><dd>" + product.brand + "</dd>" +
            "<dt>Model</dt><dd>" + product.model + "</dd>" +
            "<dt>Dodatkowe uwagi</dt><dd>" + product.remarks + "</dd>" +
            "<dt>Liczba opinii</dt><dd>" + product.reviewsCount + "</dd></dl>"
        );
    },
    displayMessage(text) {
        document.getElementById('message').textContent = text;
    },
    appendAllReviews(reviews) {
        const result = document.getElementById('transform-result');

        for (let i = 0, k = reviews.length; i < k; i++) {
            $(result).append(
                "<dl><dt>Id</dt><dd>" + reviews[i].id + "</dd>" +
                "<dt>Zalety produktu</dt><dd>" + reviews[i].pros + "</dd>" +
                "<dt>Wady produktu</dt><dd>" + reviews[i].cons + "</dd>" +
                "<dt>Podsumowanie opinii</dt><dd>" + reviews[i].summary + "</dd>" +
                "<dt>Ocena produktu</dt><dd>" + reviews[i].starsCount + "</dd>" +
                "<dt>Autor opinii</dt><dd>" + reviews[i].author + "</dd>" +
                "<dt>Data wystawienia opinii</dt><dd>" + reviews[i].date + "</dd>" +
                "<dt>Poleca / nie poleca</dt><dd>" + (reviews[i].isRecommended ? 'Poleca' : 'Nie poleca') + "</dd>" +
                "<dt>Liczba głosów na tak</dt><dd>" + reviews[i].positiveVotesCount + "</dd>" +
                "<dt>Liczba głosów na nie</dt><dd>" + reviews[i].negativeVotesCount + "</dd></dl>"
            );
        }
    },
    displayExtractReport(pageCount) {
        document.getElementById('extract-result').innerHTML = (
            "<dl><dt>Liczba pobranych stron internetowych</dt><dd>" + pageCount + "</dd></dl>"
        );
    },
    displayLoadReport(reviewsCount) {
        document.getElementById('load-result').innerHTML = (
            "<dl><dt>Liczba opinii dodana do bazy danych</dt><dd>" + reviewsCount + "</dd></dl>"
        );
    },
    setElementAvailability(handle, isEnabled) {
        isEnabled ? $(handle).removeClass('disabled') : $(handle).addClass('disabled');
    },
    setElementActivity(handle, isActive) {
        isActive ? $(handle).addClass('active') : $(handle).removeClass('active');
    },
    setElementVisibility(handle, isVisible) {
        isVisible ? $(handle).show() : $(handle).hide();
    },
    showPanel(panelHandle, buttonHandleArray = []) {
        for (let i = 0, k = buttonHandleArray.length; i < k; i++) {
            $(buttonHandleArray[i]).show();
        }
        $(panelHandle).show();
    },
    clearMessage() {
        document.getElementById('message').textContent = '';
    },
    clearProductInfo() {
        document.getElementById('product-result').innerHTML = '';
    },
    clearReports() {
        document.getElementById('extract-result').innerHTML = '';
        document.getElementById('transform-result').innerHTML = '';
        document.getElementById('load-result').innerHTML = '';
    },
    showIndicator() {
        indicatorHandle.innerHTML = '<div class="spinner"><div class="cube1"></div><div class="cube2"></div></div>';
    },
    hideIndicator() {
        $(indicatorHandle).empty();
    }
}