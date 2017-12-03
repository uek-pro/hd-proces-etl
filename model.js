const model = {
    mode: Mode.CENEO,
    productId: -1,
    product: null,
    reviews: null,
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
                controller.setElementsVisibility(true, handles.panelHandleArray[0], handles.transform);
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
                    // TODO: sprawdzić czy jest sens przeprowadzania procesu ETL (productId jest kategorią)
                    controller.showMessage(response.message);
                    setTimeout(
                        function () {
                            controller.hideMessage();
                        },
                        5000
                    );
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

        controller.displayProductInfo(this.product);

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
        controller.showAllReviews(this.processedData);

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
                controller.showLoadReport(response.result == null ? 0 : response.result);
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
        this.reviews = null;
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

                    controller.displayProductInfo(parent.product);
                    controller.showAllReviews(parent.processedData);
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
    }
}