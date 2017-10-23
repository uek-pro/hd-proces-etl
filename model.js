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
    reviewsCount: 0,
    pageCount: 0,
    extract() {
        
    },
    transform() {
        
    },
    load() {

    },
    clear() {

    },
    trySetProductInfo(productId) {

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
                parent.reviewsCount = ProductParser.parseReviewCount(doc);
                parent.pageCount = parent.reviewsCount > 0 ? Math.floor(parent.reviewsCount / 10) + 1 : 0;
                parent.productId = productId;
                
                document.getElementById('message').textContent = response.message; // TODO: przerzucić do widoku
                document.getElementById('result').innerHTML = parent.product.textValue();
                document.getElementById('reviewsCount').textContent = 'Liczba opinii: ' + parent.reviewsCount;
    
                updateUI(ProductStatus.FOUNDED);
            }
        });
    },
    setReviewsFromPage(counter) {

        const parent = this;

        if (parent.pageCount == 0 || counter > parent.pageCount) return;

        console.log("Będe pobierał " + counter + " stronę.");
        var reviewsDiv = document.getElementById('reviewsResult'); //

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
                    $(reviewsDiv).append(review.textValue((counter - 1) * 10 + i + 1)); // TODO: przerzucić do widoku
                }
    
                console.log("Strona " + counter + " została przekształcona.");
                parent.setReviewsFromPage(counter + 1);
            }
        });
    }
}