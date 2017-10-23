const controller = {
    showProductIfExists(productId) {
        this.model.trySetProductInfo(productId);
    },
    showProductsReviews() {
        this.model.setReviewsFromPage(1);
    },
    updateViewAsync() {

    },
    model: model,
    view: view
}