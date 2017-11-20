const view = {
    displayProductInfo(product) {
        document.getElementById('productResult').innerHTML = (
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
        const result = document.getElementById('transformResult');

        for (let i = 0, k = reviews.length; i < k; i++) {
            $(result).append(
                "<dl><dt>Id</dt><dd>" + reviews[i].id + "</dd>" +
                "<dt>Zalety produktu</dt><dd>" + reviews[i].pros + "</dd>" +
                "<dt>Wady produktu</dt><dd>" + reviews[i].cons + "</dd>" +
                "<dt>Podsumowanie opinii</dt><dd>" + reviews[i].summary + "</dd>" +
                "<dt>Ocena produktu</dt><dd>" + reviews[i].starsCount + "</dd>" +
                "<dt>Autor opinii</dt><dd>" + reviews[i].author + "</dd>" +
                "<dt>Data wystawienia opinii</dt><dd>" + reviews[i].date + "</dd>" +
                "<dt>Poleca / nie poleca</dt><dd>" + (reviews[i].isRecommended ? 'Poleca' : 'Nie poleca' ) + "</dd>" +
                "<dt>Liczba głosów na tak</dt><dd>" + reviews[i].positiveVotesCount + "</dd>" +
                "<dt>Liczba głosów na nie</dt><dd>" + reviews[i].negativeVotesCount + "</dd></dl>"
            );
        }
    },
    displayExtractReport(pageCount) {
        document.getElementById('extractResult').innerHTML = (
            "<dl><dt>Liczba pobranych stron internetowych</dt><dd>" + pageCount + "</dd></dl>"
        ); 
    },
    displayLoadReport(reviewsCount) {
        document.getElementById('loadResult').innerHTML = (
            "<dl><dt>Liczba opinii dodana do bazy danych</dt><dd>" + reviewsCount + "</dd></dl>"
        ); 
    },
    updateButtonsStatus(state) {
        if (state == AppStatus.NONE) {
            $(handles.extract).addClass('disabled');
            $(handles.transform).addClass('disabled');
            $(handles.load).addClass('disabled');
            $(handles.nextSearch).addClass('disabled');
            
        } else if (state == AppStatus.FOUNDED) {
            $(handles.extract).removeClass('disabled');
            
        } else if (state == AppStatus.EXTRACTED) {
            $(handles.transform).removeClass('disabled');
            
        } else if (state == AppStatus.TRANSFORMED) {
            $(handles.load).removeClass('disabled');

        } else if (state = state == AppStatus.LOADED) {
            $(handles.nextSearch).removeClass('disabled');
        }
    },
    clearMessage() {
        document.getElementById('message').textContent = '';
    },
    clearProductInfo() {
        document.getElementById('productResult').innerHTML = '';
    },
    clearReports() {
        document.getElementById('extractResult').innerHTML = '';
        document.getElementById('transformResult').innerHTML = '';
        document.getElementById('loadResult').innerHTML = '';
    },
    showIndicator() {
        indicatorHandle.innerHTML = '<div class="spinner"><div class="cube1"></div><div class="cube2"></div></div>';
    },
    hideIndicator() {
        $(indicatorHandle).empty();
    }
}