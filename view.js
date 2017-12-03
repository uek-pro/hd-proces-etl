const view = {
    displayMessage(text) {
        document.getElementById('message').textContent = text;
    },
    clearMessage() {
        document.getElementById('message').textContent = '';
    },
    showIndicator() {
        handles.indicator.innerHTML = '<div class="spinner"><div class="cube1"></div><div class="cube2"></div></div>';
    },
    hideIndicator() {
        $(handles.indicator).empty();
    },
    displayProductInfo(product) {
        document.getElementById('transform-result').innerHTML = (
            "<dl><dt>Rodzaj urządzenia</dt><dd>" + product.type + "</dd>" +
            "<dt>Marka</dt><dd>" + product.brand + "</dd>" +
            "<dt>Model</dt><dd>" + product.model + "</dd>" +
            "<dt>Dodatkowe uwagi</dt><dd>" + product.remarks + "</dd>" +
            "<dt>Akcje</dt><dd><a href='https://www.ceneo.pl/" + product.id + "'>ceneo (" + product.id + ")</a> | usuń dane produktu</dd></dl>"
        );
    },
    appendAllReviews(reviews) {
        const result = document.getElementById('transform-result');

        for (let i = 0, k = reviews.length; i < k; i++) {
            $(result).append(
                "<dl><dt>Lp</dt><dd>" + (i+1) + "</dd>" +
                "<dt>Id</dt><dd>" + reviews[i].id + "</dd>" +
                "<dt>Zalety produktu</dt><dd>" + reviews[i].pros + "</dd>" +
                "<dt>Wady produktu</dt><dd>" + reviews[i].cons + "</dd>" +
                "<dt>Podsumowanie opinii</dt><dd>" + reviews[i].summary + "</dd>" +
                "<dt>Ocena produktu</dt><dd>" + reviews[i].starsCount + "</dd>" +
                "<dt>Autor opinii</dt><dd>" + reviews[i].author + "</dd>" +
                "<dt>Data wystawienia opinii</dt><dd>" + reviews[i].date + "</dd>" +
                "<dt>Poleca / nie poleca</dt><dd>" + (reviews[i].isRecommended ? 'Poleca' : 'Nie poleca') + "</dd>" +
                "<dt>Liczba głosów na tak</dt><dd>" + reviews[i].positiveVotesCount + "</dd>" +
                "<dt>Liczba głosów na nie</dt><dd>" + reviews[i].negativeVotesCount + "</dd>" +
                "<dt>Akcje</dt><dd>usuń | pobierz</dd></dl>"
            );
        }
    },
    displayExtractReport(data) {
        document.getElementById('extract-result').innerHTML = (
            "<dl><dt>Id produktu</dt><dd><a href='https://www.ceneo.pl/" + data[0] + "'>" + data[0] + "</a></dd>" +
            "<dt>Liczba opinii o produkcie</dt><dd>" + data[1] + "</dd>" +
            "<dt>Liczba pobranych stron internetowych</dt><dd>" + data[2] + "</dd>" +
            "<dt>Tryb</dt><dd>" + (data[3] ? 'Automatyczny' : 'Ręczny') + "</dd></dl>"
        );
    },
    displayTransformReport(data) {
        $('transform-result').append(
            // TODO: to implement
        );
    },
    displayLoadReport(data) {
        document.getElementById('load-result').innerHTML = (
            "<dl><dt>Liczba opinii dodana do bazy danych</dt><dd>" + data + "</dd></dl>"
            // TODO: bardziej szczegółowy raport
        );
    },
    clearReports() {
        document.getElementById('extract-result').innerHTML = '';
        document.getElementById('transform-result').innerHTML = '';
        document.getElementById('load-result').innerHTML = '';
    },
    setElementActivity(isActive, handle) {
        isActive ? $(handle).addClass('active') : $(handle).removeClass('active');
    },
    setElementsVisibility(isVisible, handles) {
        for (let i = 0, k = handles.length; i < k; i++) {
            isVisible ? $(handles[i]).show() : $(handles[i]).hide();
        }
    }
}