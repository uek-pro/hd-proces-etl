const controller = {
    showProductInfoFromUrl(productId) {
        if (!this.model.isInitialState()) {
            this.clearData();
        }
        this.model.setProductInfoFromUrl(productId);
    },
    showProductInfoFromDatabase(productId) {
        if (!this.model.isInitialState()) {
            this.clearData();
        }
        this.model.getProductDataFromDatabase(productId);
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
    setElementAvailability(handle, isEnabled) {
        this.view.setElementAvailability(handle, isEnabled);
    },
    setElementVisibility(handle, isVisible) {
        this.view.setElementVisibility(handle, isVisible);
    },
    changeMode(mode) {
        if (mode == Mode.CENEO) {
            this.view.setElementActivity(handles.databaseMenu, false);
            this.view.setElementActivity(handles.urlMenu, true);
            this.view.setElementVisibility(handles.databaseForm, false);
            this.view.setElementVisibility(handles.urlForm, true);
            this.view.setElementVisibility(handles.loadProduct, false);
            this.view.setElementVisibility(handles.searchProduct, true);
        } else {
            this.view.setElementActivity(handles.urlMenu, false);
            this.view.setElementActivity(handles.databaseMenu, true);
            this.view.setElementVisibility(handles.urlForm, false);
            this.view.setElementVisibility(handles.databaseForm, true);
            this.view.setElementVisibility(handles.searchProduct, false);
            this.view.setElementVisibility(handles.loadProduct, true);
        }
        this.model.mode = mode;
    },
    showPanel(panelHandle, buttonHandleArray = []) {
        this.view.showPanel(panelHandle, buttonHandleArray);
    },
    updateProductsAsync() {
        this.model.updateProductsFromDatabase();
    },
    startIndicator() {
        this.view.showIndicator();
    },
    stopIndicator() {
        this.view.hideIndicator();
    },
    extractData(isWholeProcess = false) {
        this.startIndicator();
        this.model.extract(isWholeProcess);
    },
    transformData() {
        this.model.transform();
    },
    loadData() {
        this.model.load();
    },
    clearData() {
        this.model.clear();
        this.view.setElementVisibility(handles.panelHandleArray[0], false);
        this.view.setElementVisibility(handles.panelHandleArray[1], false);
        this.view.setElementVisibility(handles.panelHandleArray[2], false);
        this.view.setElementVisibility(handles.panelHandleArray[3], false);
        this.view.setElementVisibility(handles.etl, false);
        this.view.setElementVisibility(handles.extract, false);
        this.view.setElementVisibility(handles.transform, false);
        this.view.setElementVisibility(handles.load, false);
        this.view.clearReports();
        this.view.clearProductInfo();
    },
    model: model,
    view: view
}