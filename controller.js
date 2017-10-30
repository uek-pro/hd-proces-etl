const controller = {
    showProductIfExists(productId) {
        this.model.setProductInfo(productId);
    },
    showProductsReviews() {
        this.model.setReviewsFromPage(1);
    },
    showMessage(textContent) {
        this.view.displayMessage(textContent);
    },
    showProductInfo(product) {
        this.view.displayProductInfo(product);
    },
    updateUI(productStatus) {
        this.view.updateInputsStatus(productStatus);
    },
    appendReview(review, lp) {
        this.view.appendReview(review, lp);
    },
    model: model,
    view: view
}