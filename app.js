class Product {
    constructor(id, type, brand, model, additionalRemarks) {
        this.id = id;
        this.type = type;
        this.brand = brand;
        this.model = model;
        this.additionalRemarks = additionalRemarks;
    }

    textValue() {
        return("<table><tr><td>Id</td><td>" + this.id + "</td></tr>" +
            "<tr><td>Rodzaj urządzenia</td><td>" + this.type + "</td></tr>" +
            "<tr><td>Marka</td><td>" + this.brand + "</td></tr>" +
            "<tr><td>Model</td><td>" + this.model + "</td></tr>" +
            "<tr><td>Dodatkowe uwagi</td><td>" + this.additionalRemarks + "</td></tr></table>"
        );
    }
}

var ProductParser = {
    parseProduct: function (doc) {
        var type = doc.querySelector('nav dd > span:nth-last-child(2) > a > span').textContent;
        var brand = doc.querySelector('meta[property="og:brand"]').attributes['content'].textContent;
        var productContent = doc.querySelector('div.product-content');
        var model = productContent.querySelector(".product-name").textContent;
        var additionalRemarks = productContent.querySelector(".ProductSublineTags").textContent;

        return new Product(this.parseProductId(doc), type, brand, model, additionalRemarks);
    },
    parseReviewCount: function(doc) {
        return doc.querySelector("span[itemprop=reviewCount]");
    },
    parseProductId: function(doc) {
        var url = doc.querySelector('meta[property="og:url"]').attributes['content'].textContent;
        return /www.ceneo.pl\/(.*)/g.exec(url)[1];
    }
}