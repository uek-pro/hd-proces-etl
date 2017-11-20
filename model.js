const model = {
    App: {
        status: AppStatus.NONE,
        mode: Mode.URL
    },
    productId: 0,
    product: null,
    reviews: null,
    pageCount: 0,
    rawData: [], // extraction
    processedData: [], // transformation
    extract(isWholeProcess = false, counter = 1) {

        const parent = this;
        if (parent.pageCount == 0) {
            controller.changeAppStatus(AppStatus.NONE);
            controller.stopIndicator();
            return;
        } 
        else if (counter > parent.pageCount) {
            console.log(this.rawData);
            //console.log("Liczba pobranych stron internetowych: ", parent.pageCount);
            controller.showExtractReport(parent.pageCount);

            controller.changeAppStatus(AppStatus.EXTRACTED);
            controller.stopIndicator();
            if (isWholeProcess)
                this.transform(true);
            return;
        }

        $.ajax({
            url: 'http://localhost/web/hd-proces-etl/app_service.php',
            method: 'post',
            data: {
                protocol: 'get-item-page',
                itemId: parent.productId,
                reviewsPageNumber: counter
            },
            success: function (response) {
                parent.rawData.push(response.result);
                parent.extract(isWholeProcess, counter + 1);
            }
        });
    },
    transform(isWholeProcess = false) {

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

        controller.changeAppStatus(AppStatus.TRANSFORMED);
        controller.stopIndicator();
        if (isWholeProcess)
            this.load();
    },
    load() {

        controller.startIndicator();
        const parent = this;
        
        $.ajax({
            url: 'http://localhost/web/hd-proces-etl/app_service.php',
            method: 'post',
            data: {
                protocol: 'insert-product-data',
                productData: JSON.stringify({product: this.product, reviews: this.processedData})
            },
            success: function (response) {

                console.log(response.message, response.result);
                controller.showLoadReport(response.result == null ? 0 : response.result);

                controller.changeAppStatus(AppStatus.LOADED);
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
    setProductInfo(productId) {

        controller.startIndicator();
        const parent = this;
        
        $.ajax({
            url: 'http://localhost/web/hd-proces-etl/app_service.php',
            method: 'post',
            data: {
                protocol: 'get-item-page',
                itemId: productId
            },
            success: function (response) {

                const doc = new DOMParser().parseFromString(response.result, "text/html");
                parent.product = ProductParser.parseProduct(doc);
                parent.pageCount = parent.product.reviewsCount > 0 ? Math.ceil(parent.product.reviewsCount / 10) : 0;
                parent.productId = productId;

                controller.showMessage(response.message);
                if (response.success) {
                    controller.displayProductInfo(parent.product);
                    controller.changeAppStatus(AppStatus.FOUNDED);
                } else {
                    controller.changeAppStatus(AppStatus.NONE);
                }
                controller.stopIndicator();
                setTimeout(
                    function() {
                        controller.hideMessage();
                    }, 
                    5000
                );
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
                controller.stopIndicator();
            }
        });
    }
}