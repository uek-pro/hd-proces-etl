const controller = {
    showProductInfoAsync(productId) {
        if (this.model.App.status != AppStatus.NONE) {
            this.clearData();
            this.changeAppStatus(AppStatus.NONE);
        }
        if (this.model.App.mode == Mode.URL) {
            this.model.setProductInfo(productId);
        } else {
            this.model.getProductDataFromDatabase(productId);
        }
    },
    displayProductInfo(product) {
        this.view.displayProductInfo(product);
    },
    showMessage(textContent) {
        this.view.displayMessage(textContent);
    },
    hideMessage() {
        this.view.clearMessage();
    },
    showAllReviews(reviews) {
        this.view.appendAllReviews(reviews);
    },
    showExtractReport(pageCount) {
        this.view.displayExtractReport(pageCount);
    },
    showLoadReport(reviewsCount) {
        this.view.displayLoadReport(reviewsCount);
    },
    changeAppStatus(appStatus) {
        this.model.App.status = appStatus;
        this.view.updateButtonsStatus(appStatus);
    },
    setAppMode(mode) {
        this.model.App.mode = mode;
    },
    startIndicator() {
        this.view.showIndicator();
    },
    stopIndicator() {
        this.view.hideIndicator();
    },
    extractData() {
        this.startIndicator();
        this.model.extract();
    },
    transformData() {
        this.model.transform();
    },
    loadData() {
        this.model.load();
    },
    clearData() {
        this.model.clear();
        this.view.clearReports();
        this.view.clearProductInfo();
    },
    model: model,
    view: view
}