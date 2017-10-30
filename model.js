const ProductStatus = {
    NONE: 0,
    FOUNDED: 1,
    EXTRACTED: 2,
    TRANSFORMED: 3,
    LOADED: 4
}

var model = {
    productId: 0,
    product: null,
    reviews: null,
    pageCount: 0,
    extraction: [],
    transformation: [],
    extract(counter = 1) {

        const parent = this;
        if (parent.pageCount == 0 || counter > parent.pageCount) return;

        $.ajax({
            url: 'http://localhost/web/hd-proces-etl/app_service.php',
            method: 'post',
            data: {
                protocol: 'get-item-page',
                itemId: parent.productId,
                reviewsPageNumber: counter
            },
            success: function (response) {
                parent.extraction.push(response.result);
                parent.extract(counter + 1);
            }
        });
    },
    transform() {
        console.log(this.extraction);

        for (let i = 0, k = this.extraction.length; i < k; i++) {

            const doc = new DOMParser().parseFromString(this.extraction[i], "text/html");
            const reviews = doc.querySelectorAll('ol.product-reviews > li.review-box');
    
            for (let j = 0, l = reviews.length; j < l; j++) {
    
                const review = ReviewsParser.parseReview(reviews[j]);
                this.transformation.push(review);
            }
        }
    },
    load() {
        console.log(this.transformation);
    },
    clear() {
        this.extraction = [];
        this.transformation = [];
    },
    setProductInfo(productId) {

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
                controller.showProductInfo(parent.product);
                controller.updateUI(ProductStatus.FOUNDED);
            }
        });
    },
    setReviewsFromPage(counter) {

        const parent = this;

        if (parent.pageCount == 0 || counter > parent.pageCount) return;

        console.log("Będe pobierał " + counter + " stronę.");

        $.ajax({
            url: 'http://localhost/web/hd-proces-etl/app_service.php',
            method: 'post',
            data: {
                protocol: 'get-item-page',
                itemId: parent.productId,
                reviewsPageNumber: counter
            },
            success: function (response) {

                const doc = new DOMParser().parseFromString(response.result, "text/html");
                const reviews = doc.querySelectorAll('ol.product-reviews > li.review-box');

                for (var i = 0, k = reviews.length; i < k; i++) {

                    const review = ReviewsParser.parseReview(reviews[i]);
                    //console.log(review);
                    controller.appendReview(review, (counter - 1) * 10 + i + 1);
                }
    
                console.log("Strona " + counter + " została przekształcona.");
                parent.setReviewsFromPage(counter + 1);
            }
        });
    }
}