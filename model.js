const model = {
    mode: Mode.CENEO,
    productId: -1,
    product: null,
    pageCount: 1,
    rawData: [], // extraction
    processedData: [], // transformation
    getProcessedData() {
        return this.processedData;
    },
    isInitialState() {
        return this.productId == -1 ? true : false;
    },
    extract(productId, isWholeProcess = false, counter = 1) {
        
        if (counter == 1) {
            controller.setElementsVisibility(false, handles.extract, handles.etl);
        }

        const parent = this;
        if (counter > parent.pageCount) {
            console.log(this.rawData);
            controller.showExtractReport([parent.productId, parent.product.reviewsCount, parent.pageCount, isWholeProcess]);
            controller.stopIndicator();
            if (isWholeProcess) {
                controller.setElementsVisibility(true, handles.panelHandleArray[0]);
                this.transform(true);
            } else {
                controller.setElementsVisibility(true, handles.panelHandleArray[0], handles.transform, handles.back); // NOTE: hmm?
            }
            return;
        }

        $.ajax({
            url: 'http://localhost/web/hd-proces-etl/app_service.php',
            method: 'post',
            data: {
                protocol: 'get-product-page',
                productId: productId,
                reviewsPageNumber: counter
            },
            success: function (response) {

                if (counter == 1) {
                    const doc = new DOMParser().parseFromString(response.result, "text/html");
                    parent.product = ProductParser.parseProduct(doc);
                    parent.pageCount = parent.product.reviewsCount > 0 ? Math.ceil(parent.product.reviewsCount / 10) : 1;
                    parent.productId = productId;

                    let isValidProductId = true;
                    if (!$.isNumeric(parent.product.id)) {
                        isValidProductId = false;
                    }
                    //console.log(isValidProductId, $.isNumeric(parent.product.id), parent.product.id);
                    controller.showMessage(response.message + (!isValidProductId ? ', ale nie jest to produkt, lecz prawdopodobnie kategoria produktu.' : ''));
                    setTimeout(
                        function () {
                            controller.hideMessage();
                        },
                        5000
                    );

                    if (!isValidProductId) {
                        controller.stopIndicator();
                        controller.setElementsVisibility(true, handles.extract, handles.etl);
                        return;
                    }
                }

                parent.rawData.push(response.result);
                parent.extract(productId, isWholeProcess, counter + 1);
            },
            error: function(e) {
                controller.showMessage('Wystąpił błąd podczas pobierania informacji o produkcie. (' + e.status + ')');
                controller.stopIndicator();
                return;
            }
        });
    },
    transform(isWholeProcess = false) {

        controller.setElementsVisibility(false, handles.transform);
        controller.startIndicator();

        controller.displayProductInfo(this.product, false);

        for (let i = 0, k = this.rawData.length; i < k; i++) {

            const doc = new DOMParser().parseFromString(this.rawData[i], "text/html");
            const reviews = doc.querySelectorAll('ol.product-reviews > li.review-box');

            for (let j = 0, l = reviews.length; j < l; j++) {

                const review = ReviewsParser.parseReview(reviews[j]);
                this.processedData.push(review);
            }
        }
        // NOTE: czy napewno zawsze pobrane zostają wszystkie opinie?
        console.log(this.processedData);
        controller.showAllReviews(this.processedData, false);

        controller.stopIndicator();
        controller.setElementsVisibility(true, handles.panelHandleArray[1], handles.load);
        if (isWholeProcess)
            this.load();
    },
    load() {

        controller.setElementsVisibility(false, handles.load);
        controller.startIndicator();
        const parent = this;

        $.ajax({
            url: 'http://localhost/web/hd-proces-etl/app_service.php',
            method: 'post',
            data: {
                protocol: 'insert-product-data',
                productData: JSON.stringify({ product: this.product, reviews: this.processedData })
            },
            success: function (response) {

                console.log(response.message);
                controller.showLoadReport([
                    response.result.isAddedProduct == null ? 0 : response.result.isAddedProduct,
                    parent.product.reviewsCount - response.result.reviewsAddedCount,
                    response.result.reviewsAddedCount
                ]);
                controller.setElementsVisibility(true, handles.panelHandleArray[2], handles.back);
            },
            complete: function() {
                controller.stopIndicator();
            }
        });
    },
    clear() {
        this.productId = -1;
        this.product = null;
        this.pageCount = 1;
        this.rawData = [];
        this.processedData = [];
    },
    getProductDataFromDatabase(productId) {
        controller.startIndicator();
        const parent = this;

        $.ajax({
            url: 'http://localhost/web/hd-proces-etl/app_service.php',
            method: 'post',
            data: {
                protocol: 'get-product-data',
                productId: productId
            },
            success: function (response) {

                controller.showMessage(response.message);
                if (response.success) {
                    parent.product = response.result.product;
                    parent.productId = productId;
                    parent.processedData = response.result.reviews;

                    controller.displayProductInfo(parent.product, true);
                    controller.showAllReviews(parent.processedData, true);
                    controller.setElementsVisibility(true, handles.panelHandleArray[1], handles.back);

                    setTimeout(
                        function () {
                            controller.hideMessage();
                        },
                        5000
                    );
                }
                console.log(parent);
            },
            error: function(e) {
                controller.showMessage('Wystąpił błąd podczas pobierania informacji o produkcie. (' + e.status + ')');
            },
            complete: function() {
                controller.stopIndicator();
            }
        });
    },
    updateProductsFromDatabase() {
        controller.startIndicator();
        const parent = this;

        $.ajax({
            url: 'http://localhost/web/hd-proces-etl/app_service.php',
            method: 'post',
            data: {
                protocol: 'get-products-list'
            },
            success: function (response) {

                console.log(response);
                if (response.success) {
                    $(handles.productSelect).empty();
                    for (let i = 0, k = response.result.length; i < k; i++) {
                        const opt = document.createElement('option');
                        opt.value = response.result[i].id;
                        opt.innerHTML = response.result[i].model;
                        handles.productSelect.appendChild(opt);
                    }
                }
            },
            complete: function() {
                controller.stopIndicator();
            }
        });
    },
    deleteProductData(productId) {
        controller.startIndicator();
        const parent = this;

        $.ajax({
            url: 'http://localhost/web/hd-proces-etl/app_service.php',
            method: 'post',
            data: {
                protocol: 'delete-product-data',
                productId: productId
            },
            success: function (response) {

                console.log(response);
                controller.showMessage(response.message);
                if (response.success) {
                    controller.clearData();
                }
                setTimeout(
                    function () {
                        controller.hideMessage();
                    },
                    5000
                );
            },
            complete: function() {
                controller.stopIndicator();
            }
        });
    },
    deleteReview(reviewId, elementId) {
        controller.startIndicator();
        const parent = this;

        $.ajax({
            url: 'http://localhost/web/hd-proces-etl/app_service.php',
            method: 'post',
            data: {
                protocol: 'delete-review',
                reviewId: reviewId
            },
            success: function (response) {

                console.log(response);
                controller.showMessage(response.message);
                if (response.success) {
                    parent.processedData[elementId] = null;
                    controller.fadeReview(elementId);
                }
                setTimeout(
                    function () {
                        controller.hideMessage();
                    },
                    3000
                );
            },
            complete: function() {
                controller.stopIndicator();
            }
        });
    },
    saveReview(reviewId) {
        const reviews = this.getProcessedData();
        if (reviews[reviewId] != null) {
            DownloadHelper.download(reviews[reviewId].id + '.json', JSON.stringify(reviews[reviewId]));
        }
    },
    saveAllReviews(type) {
        if (type == 'json') {

            const reviews = this.getProcessedData().filter(function (x) {
                return (x !== null);//(x !== (undefined || null || ''));
            });
            DownloadHelper.download(this.productId + '.json', JSON.stringify(reviews));

        } else if (type == 'csv') {

            const data = this.getProcessedData();
            console.log(data);

            let csvContent = '';
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
            DownloadHelper.download(this.productId + '.csv', csvContent, 'utf8 w/ BOM');
        }
    }
}