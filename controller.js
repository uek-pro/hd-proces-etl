const controller = {
    showProductInfoFromDatabase(productId) {
        if (!this.model.isInitialState()) {
            this.clearData();
        }
        this.model.getProductDataFromDatabase(productId);
    },
    showMessage(textContent) {
        this.view.displayMessage(textContent);
    },
    hideMessage() {
        this.view.clearMessage();
    },
    displayProductInfo(product, isFromDatabase) {
        this.view.displayProductInfo(product, isFromDatabase);
    },
    showAllReviews(reviews, isFromDatabase) {
        this.view.appendAllReviews(reviews, isFromDatabase);
    },
    showExtractReport(data) {
        this.view.displayExtractReport(data);
    },
    showLoadReport(data) {
        this.view.displayLoadReport(data);
    },
    setElementsVisibility(isVisible, ...handles) {
        this.view.setElementsVisibility(isVisible, handles);
    },
    changeMode(mode) {
        this.model.mode = mode;
        if (mode == Mode.CENEO) {
            this.view.setElementActivity(false, handles.databaseMenu);
            this.view.setElementActivity(true, handles.urlMenu);
            this.setElementsVisibility(false, handles.databaseForm, handles.loadProduct);
            this.setElementsVisibility(true, handles.urlForm, handles.etl, handles.extract);
        } else {
            this.view.setElementActivity(false, handles.urlMenu);
            this.view.setElementActivity(true, handles.databaseMenu);
            this.setElementsVisibility(false, handles.urlForm, handles.etl, handles.extract);
            this.setElementsVisibility(true, handles.databaseForm, handles.loadProduct);
        }
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
    extractData(productId, isWholeProcess = false) {
        this.startIndicator();
        if (!this.model.isInitialState()) {
            this.clearData();
        }
        this.model.extract(productId, isWholeProcess);
    },
    transformData() {
        this.model.transform();
    },
    loadData() {
        this.model.load();
    },
    clearData() {
        this.model.clear();
        this.setElementsVisibility(
            false,
            handles.back,
            handles.panelHandleArray[2],
            handles.load,
            handles.panelHandleArray[1],
            handles.transform,
            handles.panelHandleArray[0],
        );
        this.model.mode == Mode.CENEO ? this.setElementsVisibility(
            true,
            handles.etl,
            handles.extract
        ) : this.setElementsVisibility(
            true,
            handles.loadProduct,
        );
        this.view.clearReports();
    },
    saveAllReviews(type) {
        if (type == 'json') {
            DownloadHelper.download(this.model.productId + '.json', JSON.stringify(this.model.getProcessedData()));
        } else if (type == 'csv') { // NOTE: brak polskich znaków

            const data = this.model.getProcessedData();
            let csvContent = '';//"data:text/csv;charset=utf-8,";
            console.log(data);
            for (let i = 0, k = data.length; i < k; i++) {
                if (data[i] != null) {
                    let row = (
                        '"' + data[i].id + '","' +
                        data[i].pros + '","' +
                        data[i].cons + '","' +
                        data[i].summary + '","' +
                        data[i].starsCount + '","' +
                        data[i].author + '","' +
                        data[i].date + '","' +
                        data[i].isRecommended + '","' +
                        data[i].positiveVotesCount + '","' +
                        data[i].negativeVotesCount + '"'
                    );
                    csvContent += row + "\r\n";
                }
            }
            DownloadHelper.download(this.model.productId + '.csv', csvContent);
        }
    },
    saveReview(reviewId) {
        const reviews = this.model.getProcessedData();
        if (reviews[reviewId] != null) {
            DownloadHelper.download(reviews[reviewId].id + '.json', JSON.stringify(reviews[reviewId]));
        }
    },
    deleteProductData(productId) {
        this.model.deleteProductData(productId);
    },
    deleteReview(reviewId, elementId) {
        this.model.deleteReview(reviewId, elementId);
    },
    fadeReview(reviewId) {
        this.view.fadeReview(reviewId);
    },
    model: model,
    view: view
}