class Product {
    constructor(id, type, brand, model, additionalRemarks) {
        this.id = id;
        this.type = type;
        this.brand = brand;
        this.model = model;
        this.additionalRemarks = additionalRemarks;
    }

    textValue() {
        return ("<table><tr><td>Id</td><td><a href='https://www.ceneo.pl/" + this.id + "'>" + this.id + "</a></td></tr>" +
            "<tr><td>Rodzaj urządzenia</td><td>" + this.type + "</td></tr>" +
            "<tr><td>Marka</td><td>" + this.brand + "</td></tr>" +
            "<tr><td>Model</td><td>" + this.model + "</td></tr>" +
            "<tr><td>Dodatkowe uwagi</td><td>" + this.additionalRemarks + "</td></tr></table>"
        );
    }
}

const ProductParser = {
    parseProduct: function (doc) {

        var typeElement = doc.querySelector('nav dd > span:nth-last-child(2) > a > span');
        var type = typeElement != null ? typeElement.textContent : "";

        var brandElement = doc.querySelector('meta[property="og:brand"]');
        var brand = brandElement != null ? brandElement.attributes['content'].textContent : "";

        var modelElement = doc.querySelector("div.product-content .product-name");
        var model = modelElement != null ? modelElement.textContent : "";

        var additionalRemarksElement = doc.querySelector("div.product-content .ProductSublineTags");
        var additionalRemarks = additionalRemarksElement != null ? additionalRemarksElement.textContent : "";

        return new Product(this.parseProductId(doc), type, brand, model, additionalRemarks);
    },
    parseReviewCount: function (doc) {
        var reviewsCount = doc.querySelector("span[itemprop=reviewCount]");
        return (reviewsCount != null ? reviewsCount.textContent : "");
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

class Review {
    constructor(id, pros, cons, summary, starsCount, author, date, isRecommended, usefulReviewsCount, uselessReviewsCount) {
        this.id = id;
        this.pros = pros;
        this.cons = cons;
        this.summary = summary;
        this.starsCount = starsCount;
        this.author = author;
        this.date = date;
        this.isRecommended = isRecommended;
        this.usefulReviewsCount = usefulReviewsCount;
        this.uselessReviewsCount = uselessReviewsCount;
    }

    textValue(lp) {
        return ("<table><tr><td>Lp</td><td>" + lp + "</td></tr>" +
            "<tr><td>Id</td><td>" + this.id + "</td></tr>" +
            "<tr><td>Zalety produktu</td><td>" + this.pros + "</td></tr>" +
            "<tr><td>Wady produktu</td><td>" + this.cons + "</td></tr>" +
            "<tr><td>Podsumowanie opinii</td><td>" + this.summary + "</td></tr>" +
            "<tr><td>Liczba gwiazdek</td><td>" + this.starsCount + "</td></tr>" +
            "<tr><td>Autor opinii</td><td>" + this.author + "</td></tr>" +
            "<tr><td>Data wystawienia opinii</td><td>" + this.date + "</td></tr>" +
            "<tr><td>Czy poleca</td><td>" + this.isRecommended + "</td></tr>" +
            "<tr><td>Ocena opinii jako przydatna</td><td>" + this.usefulReviewsCount + "</td></tr>" +
            "<tr><td>Ocena opinii jako nieprzydatna</td><td>" + this.uselessReviewsCount + "</td></tr></table><hr/>"
        );
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
        return new Review(
            review.querySelector('button.vote-yes').attributes['data-review-id'].textContent,
            pros,
            cons,
            "",//review.querySelector('p.product-review-body').textContent, //tmp
            review.querySelector('span.review-score-count').textContent.split('/')[0],
            review.querySelector('div.reviewer-name-line').textContent.trim(),
            review.querySelector('span.review-time > time').attributes['datetime'].textContent,
            review.querySelector('div.reviewer-recommendation') != null ? "Tak" : "Nie",
            review.querySelector('button.vote-yes').textContent,
            review.querySelector('button.vote-no').textContent
        );
    }
}