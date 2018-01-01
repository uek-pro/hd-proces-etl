class Product {
    constructor(id, type, brand, model, remarks, reviewsCount) {
        this.id = id;
        this.type = type;
        this.brand = brand;
        this.model = model;
        this.remarks = remarks;
        this.reviewsCount = reviewsCount;
    }
}

class Review {
    constructor(id, pros, cons, summary, starsCount, author, date, isRecommended, positiveVotesCount, negativeVotesCount) {
        this.id = id;
        this.pros = pros;
        this.cons = cons;
        this.summary = summary;
        this.starsCount = starsCount;
        this.author = author;
        this.date = date;
        this.isRecommended = isRecommended;
        this.positiveVotesCount = positiveVotesCount;
        this.negativeVotesCount = negativeVotesCount;
    }
}

const Mode = {
    CENEO: 0,
    DATABASE: 1
}

const ProductParser = {
    parseProduct: function (doc) {

        const urlValueElement = doc.querySelector('meta[property="og:url"]');
        const productId = urlValueElement != null ? /www.ceneo.pl\/(.*)/g.exec(urlValueElement.attributes['content'].textContent)[1] : "";

        // pobierana zostaje główna kategoria produktu
        const typeElement = doc.querySelector('nav dd > span:nth-child(2) > a > span');
        const type = typeElement != null ? typeElement.textContent : "";

        const brandElement = doc.querySelector('meta[property="og:brand"]');
        const brand = brandElement != null ? brandElement.attributes['content'].textContent : "";

        const modelElement = doc.querySelector("div.product-content .product-name");
        const model = modelElement != null ? modelElement.textContent : "";

        const remarksElement = doc.querySelector("div.product-content .ProductSublineTags"); // NOTE: prawdopodobnie prowadzącej chodzi o warianty? (#js_product-families)
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
        var recommendationElement = review.querySelector('div.reviewer-recommendation em') != null ? review.querySelector('div.reviewer-recommendation em').textContent : "";
        if (recommendationElement == "Polecam")
            isRecommended = true;
        else
            isRecommended = false;

        let starsCount = null;
        const starsCountValue = review.querySelector('span.review-score-count').textContent.split('/')[0];
        if (starsCountValue != null) {
            if (starsCountValue.length > 1) {
                starsCount = starsCountValue[0] * 2 + 1;
            } else {
                starsCount = starsCountValue * 2;
            }
        }

        return new Review(
            review.querySelector('button.vote-yes').attributes['data-review-id'].textContent,
            pros,
            cons,
            review.querySelector('p.product-review-body').textContent,//.slice(0, 200)
            starsCount,
            review.querySelector('div.reviewer-name-line').textContent.trim(),
            review.querySelector('span.review-time > time').attributes['datetime'].textContent,
            isRecommended,
            review.querySelector('button.vote-yes').textContent,
            review.querySelector('button.vote-no').textContent
        );
    }
}

const SearchResultParser = {
    parsePage: function (doc) {
        let productsArray = [];
        const searchedProducts = doc.querySelectorAll('div.category-list-body.js_category-list-body > div.cat-prod-row');
        if (searchedProducts.length > 0) {
            for (let i = 0, k = searchedProducts.length; i < k; i++) {
                if (i > 9) break; // NOTE: wyświetla tylko 10 wyników
                let productId = searchedProducts[i].attributes['data-pid'].textContent;
                let productName = searchedProducts[i].querySelector('strong.cat-prod-row-name > a').textContent;
                productsArray.push({id: productId, name: productName});
            }
        }
        return productsArray;
    }
}

const DownloadHelper = {
    download: function (filename, text, encoding = 'utf8') {
        let prefix;
        if (encoding == 'utf8 w/ BOM') {
            prefix = 'data:text/plain;charset=utf-8,%EF%BB%BF';
        } else {
            prefix = 'data:text/plain;charset=utf-8,';
        }
        const element = document.createElement('a');
        element.setAttribute('href', prefix + encodeURI(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
}