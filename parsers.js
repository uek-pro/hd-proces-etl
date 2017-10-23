const ProductParser = {
    parseProduct: function (doc) {

        var typeElement = doc.querySelector('nav dd > span:nth-last-child(2) > a > span');
        var type = typeElement != null ? typeElement.textContent : "";

        var brandElement = doc.querySelector('meta[property="og:brand"]');
        var brand = brandElement != null ? brandElement.attributes['content'].textContent : "";

        var modelElement = doc.querySelector("div.product-content .product-name");
        var model = modelElement != null ? modelElement.textContent : "";

        var remarksElement = doc.querySelector("div.product-content .ProductSublineTags");
        var remarks = remarksElement != null ? remarksElement.textContent : "";

        return new Product(this.parseProductId(doc), type, brand, model, remarks);
    },
    parseReviewCount: function (doc) {
        var reviewsCount = doc.querySelector("span[itemprop=reviewCount]");
        return (reviewsCount != null ? reviewsCount.textContent : 0);
    },
    parseProductId: function (doc) {
        var urlValueElement = doc.querySelector('meta[property="og:url"]');
        if (urlValueElement != null) {
            var urlValue = urlValueElement.attributes['content'].textContent; //todo nie zawsze będzie to liczba
            return /www.ceneo.pl\/(.*)/g.exec(urlValue)[1];
        } else {
            return "";
        }
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
            "",//review.querySelector('p.product-review-body').textContent, //FIXME: wstawić tekst opinii
            review.querySelector('span.review-score-count').textContent.split('/')[0],
            review.querySelector('div.reviewer-name-line').textContent.trim(),
            review.querySelector('span.review-time > time').attributes['datetime'].textContent,
            isRecommended,
            review.querySelector('button.vote-yes').textContent,
            review.querySelector('button.vote-no').textContent
        );
    }
}