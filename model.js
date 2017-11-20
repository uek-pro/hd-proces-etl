const model = {
    mode: Mode.CENEO,
    productId: 0,
    product: null,
    reviews: null,
    pageCount: 0,
    rawData: [], // extraction
    processedData: [], // transformation
    extract(isWholeProcess = false, counter = 1) {

        if (counter == 1) {
            controller.setElementVisibility(handles.extract, false);
            controller.setElementVisibility(handles.etl, false);
        }

        const parent = this;
        if (parent.pageCount == 0) {
            controller.clearData();
            controller.stopIndicator();
            return;
        }
        else if (counter > parent.pageCount) {
            console.log(this.rawData);
            controller.showExtractReport(parent.pageCount);
            controller.stopIndicator();
            if (isWholeProcess) {
                controller.showPanel(handles.panelHandleArray[1], []);
                this.transform(true);
            } else {
                controller.showPanel(handles.panelHandleArray[1], [handles.transform]);
            }
            return;
        }

        $.ajax({
            url: 'http://localhost/web/hd-proces-etl/app_service.php',
            method: 'post',
            data: {
                protocol: 'get-product-page',
                productId: parent.productId,
                reviewsPageNumber: counter
            },
            success: function (response) {
                parent.rawData.push(response.result);
                parent.extract(isWholeProcess, counter + 1);
            }
        });
    },
    transform(isWholeProcess = false) {

        controller.setElementVisibility(handles.transform, false);
        controller.startIndicator();

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
        if (isWholeProcess) {
            controller.showPanel(handles.panelHandleArray[2], [handles.toJSON, handles.toCSV]);
            this.load();
        } else {
            controller.showPanel(handles.panelHandleArray[2], [handles.toJSON, handles.toCSV, handles.load]);
        }
    },
    load() {

        controller.setElementVisibility(handles.load, false);
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

                controller.showPanel(handles.panelHandleArray[3], []);
                controller.stopIndicator();
            }
        });
    },
    clear() {
        this.productId = 0;
        this.product = null;
        this.reviews = null;
        this.pageCount = 0;
        this.rawData = [];
        this.processedData = [];
    },
    setProductInfoFromUrl(productId) {
        controller.startIndicator();
        const parent = this;

        $.ajax({
            url: 'http://localhost/web/hd-proces-etl/app_service.php',
            method: 'post',
            data: {
                protocol: 'get-product-page',
                productId: productId
            },
            success: function (response) {

                const doc = new DOMParser().parseFromString(response.result, "text/html");
                parent.product = ProductParser.parseProduct(doc);
                parent.pageCount = parent.product.reviewsCount > 0 ? Math.ceil(parent.product.reviewsCount / 10) : 0;
                parent.productId = productId;

                controller.showMessage(response.message);
                if (response.success) {
                    controller.displayProductInfo(parent.product);
                    controller.showPanel(handles.panelHandleArray[0], [handles.etl, handles.extract]);
                    setTimeout(
                        function () {
                            controller.hideMessage();
                        },
                        5000
                    );
                }
                controller.stopIndicator();
            }
        });
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

                    controller.showPanel(handles.panelHandleArray[0], []);
                    controller.showPanel(handles.panelHandleArray[2], [handles.toJSON, handles.toCSV]);
                    controller.showPanel(handles.panelHandleArray[3], []);
                    setTimeout(
                        function () {
                            controller.hideMessage();
                        },
                        5000
                    );
                }
                controller.stopIndicator();
                console.log(parent);
            }
        });
    },
    isInitialState() {
        return this.productId == 0 ? true : false;
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
                
                $(handles.productSelect).empty();
                for (let i = 0, k = response.result.length; i < k; i++) {
                    const opt = document.createElement('option');
                    opt.value = response.result[i].id;
                    opt.innerHTML = response.result[i].model;
                    handles.productSelect.appendChild(opt);
                }
                controller.stopIndicator();
            }
        });
    }
}