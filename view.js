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
    displayProductInfo(product, isFromDatabase) {
        document.getElementById('transform-result').innerHTML = (
            '<dl><dt>Rodzaj urządzenia</dt><dd>' + product.type + '</dd>' +
            '<dt>Marka</dt><dd>' + product.brand + '</dd>' +
            '<dt>Model</dt><dd>' + product.model + '</dd>' +
            '<dt>Dodatkowe uwagi</dt><dd>' + product.remarks + '</dd>' +
            '<dt>Akcje</dt><dd><a href="https://www.ceneo.pl/' + product.id + '">pokaż w ceneo</a>' + (isFromDatabase ? ' | <a onclick="controller.deleteProductData(' + product.id + ')">usuń wszystkie dane produku</a>' : '') + ' | <a onclick="controller.saveAllReviews(\'csv\')">pobierz jako csv</a> | <a onclick="controller.saveAllReviews(\'json\')">pobierz jako json</a></dd></dl>'
        );
    },
    appendAllReviews(reviews, isFromDatabase) {
        const result = document.getElementById('transform-result');

        for (let i = 0, k = reviews.length; i < k; i++) {
            $(result).append(
                '<dl><dt>Lp</dt><dd>' + (i+1) + '</dd>' +
                /*'<dt>Id</dt><dd>' + reviews[i].id + '</dd>' +*/
                '<dt>Zalety produktu</dt><dd>' + reviews[i].pros + '</dd>' +
                '<dt>Wady produktu</dt><dd>' + reviews[i].cons + '</dd>' +
                '<dt>Podsumowanie opinii</dt><dd>' + reviews[i].summary + '</dd>' +
                '<dt>Ocena produktu</dt><dd>' + (reviews[i].starsCount % 2 == 0 ? reviews[i].starsCount / 2 : (reviews[i].starsCount - 1) / 2 + '.5') + '</dd>' +
                '<dt>Autor opinii</dt><dd>' + reviews[i].author + '</dd>' +
                '<dt>Data wystawienia opinii</dt><dd>' + reviews[i].date + '</dd>' +
                '<dt>Poleca / nie poleca</dt><dd>' + (reviews[i].isRecommended ? 'Poleca' : 'Nie poleca') + '</dd>' +
                '<dt>Liczba głosów na tak</dt><dd>' + reviews[i].positiveVotesCount + '</dd>' +
                '<dt>Liczba głosów na nie</dt><dd>' + reviews[i].negativeVotesCount + '</dd>' +
                '<dt>Akcje</dt><dd>' + (isFromDatabase ? '<a onclick="controller.deleteReview(' + reviews[i].id + ',' + i + ')">usuń</a> | ' : '') + '<a onclick="controller.saveReview(' + i + ')">pobierz</a></dd></dl>'
            );
        }
    },
    displayExtractReport(data) {
        document.getElementById('extract-result').innerHTML = (
            '<dl><dt>Id produktu</dt><dd><a href="https://www.ceneo.pl/' + data[0] + '">' + data[0] + '</a></dd>' +
            '<dt>Liczba opinii o produkcie</dt><dd>' + data[1] + '</dd>' +
            '<dt>Liczba pobranych stron internetowych</dt><dd>' + data[2] + '</dd>' +
            '<dt>Tryb</dt><dd>' + (data[3] ? 'Automatyczny' : 'Ręczny') + '</dd></dl>'
        );
    },
    displayLoadReport(data) {
        document.getElementById('load-result').innerHTML = (
            '<dl><dt>Czy produkt znajdował się już w bazie danych</dt><dd>' + (!data[0] ? 'Tak' : 'Nie') + '</dd>' +
            '<dt>Liczba opinii w bazie danych przed operacją</dt><dd>' + data[1] + '</dd>' +
            '<dt>Liczba opinii dodana do bazy danych</dt><dd>' + data[2] + '</dd></dl>'
        );
    },
    clearReports() {
        document.getElementById('extract-result').innerHTML = '';
        document.getElementById('transform-result').innerHTML = '';
        document.getElementById('load-result').innerHTML = '';
    },
    fadeReview(elementId) {
        $('#transform-result > dl:nth-child(' + (elementId+2) + ')').css("opacity", 0.2);
        // NOTE: element+2, ponieważ tablica jest liczona od 0, child od 1, a 1. child to informacje o produkcie
    },
    displaySearchedProducts(searchedProducts) {
        
        for (let i = 0, k = searchedProducts.length; i < k; i++) {
            $('#searched-products').append(
                '<a onclick="controller.setProductIdElementValue(' + searchedProducts[i].id + ')">' + searchedProducts[i].name + '</a>'
            );
        }
    },
    clearSearchedProducts() {
        $('#searched-products').empty();
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