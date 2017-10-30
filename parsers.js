const ProductParser = {
    parseProduct: function (doc) {

        const urlValueElement = doc.querySelector('meta[property="og:url"]');
        const productId = urlValueElement != null ? /www.ceneo.pl\/(.*)/g.exec(urlValueElement.attributes['content'].textContent)[1] : "";

        const typeElement = doc.querySelector('nav dd > span:nth-last-child(2) > a > span');
        const type = typeElement != null ? typeElement.textContent : "";

        const brandElement = doc.querySelector('meta[property="og:brand"]');
        const brand = brandElement != null ? brandElement.attributes['content'].textContent : "";

        const modelElement = doc.querySelector("div.product-content .product-name");
        const model = modelElement != null ? modelElement.textContent : "";

        const remarksElement = doc.querySelector("div.product-content .ProductSublineTags");
        const remarks = remarksElement != null ? remarksElement.textContent : "";

        const reviewsCountElement = doc.querySelector("span[itemprop=reviewCount]");
        const reviewsCount = reviewsCountElement != null ? reviewsCountElement.textContent : 0;

        return new Product(productId, type, brand, model, remarks, reviewsCount);
    }
}

const ReviewsParser = {
    parseReview: function (review) {
        var prosArray = review.querySelectorAll('div.pros-cell > ul > li');
        var pros = '';
        for (var i = 0, k = prosArray.length; i < k; i++) {
            pros += prosArray[i].textContent.trim() + ";";
        }
        var consArray = review.querySelectorAll('div.cons-cell > ul > li');
        var cons = '';
        for (var i = 0, k = consArray.length; i < k; i++) {
            cons += consArray[i].textContent.trim() + ";";
        }

        var isRecommended = null;
        var recommendationElement = review.querySelector('div.reviewer-recommendation em') != null ? review.querySelector('div.reviewer-recommendation em') : "";
        if (recommendationElement == "Polecam")
            isRecommended = true;
        else
            isRecommended = false;

        return new Review(
            review.querySelector('button.vote-yes').attributes['data-review-id'].textContent,
            pros,
            cons,
            review.querySelector('p.product-review-body').textContent.slice(0, 50), //TMP
            review.querySelector('span.review-score-count').textContent.split('/')[0],
            review.querySelector('div.reviewer-name-line').textContent.trim(),
            review.querySelector('span.review-time > time').attributes['datetime'].textContent,
            isRecommended,
            review.querySelector('button.vote-yes').textContent,
            review.querySelector('button.vote-no').textContent
        );
    }
}