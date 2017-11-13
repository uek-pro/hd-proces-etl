const controller = {
    showProductInfoAsync(productId) {
        this.model.setProductInfo(productId);
    },
    displayProductInfo(product) {
        this.view.displayProductInfo(product);
    },
    showMessage(textContent) {
        this.view.displayMessage(textContent);
    },
    updateUI(appStatus) {
        this.view.updateButtonsStatus(appStatus);
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