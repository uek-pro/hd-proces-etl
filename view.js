const view = {
    displayMessage(text) {
        document.getElementById('message').textContent = text;
    },
    displayProductInfo(product) {
        document.getElementById('productResult').innerHTML = product.textValue();
    },
    updateInputsStatus(state) {
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
    },
    appendReview(review, lp) {
        const reviewsDiv = document.getElementById('reviewsResult'); //TMP
        $(reviewsDiv).append(review.textValue(lp));
    },
    displayReviewsList() {

    },
    clearProductInfo() {

    },
    clearReviewsList() {

    }
}