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
    updateButtonsStatus(state) {
        if (state == AppStatus.NONE) {
            
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
    clearProductInfo() {
        // TODO: implement
    },
    clearReports() {
        // TODO: implement
    },
    showIndicator() {
        indicatorHandle.innerHTML = '<div class="spinner"><div class="cube1"></div><div class="cube2"></div></div>';
    },
    hideIndicator() {
        $(indicatorHandle).empty();
    }
}