const model = {
    productId: 0,
    product: null,
    reviews: null,
    pageCount: 0,
    rawData: [], // extraction
    processedData: [], // transformation
    extract(counter = 1) {

        const parent = this;
        if (parent.pageCount == 0) {
            controller.updateUI(AppStatus.NONE);
            controller.stopIndicator();
            return;
        } 
        else if (counter > parent.pageCount) {
            console.log(this.rawData);
            // TODO: +info o liczbie pobranych plików

            controller.updateUI(AppStatus.EXTRACTED);
            controller.stopIndicator();
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
                parent.extract(counter + 1);
            }
        });
    },
    transform() {

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
        // TODO: +wyświetl wszystkie opinie (processedData); +info

        controller.updateUI(AppStatus.TRANSFORMED);
        controller.stopIndicator();
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
                // TODO: +info o liczbie dodanych rekordów do bazy (dane nie mogą się dublować)
                controller.updateUI(AppStatus.LOADED);
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
                    controller.updateUI(AppStatus.FOUNDED);
                } else {
                    controller.updateUI(AppStatus.NONE);
                }
                controller.stopIndicator();
            }
        });
    }
}