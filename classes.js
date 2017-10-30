class Product {
    constructor(id, type, brand, model, remarks, reviewsCount) {
        this.id = id;
        this.type = type;
        this.brand = brand;
        this.model = model;
        this.remarks = remarks;
        this.reviewsCount = reviewsCount;
    }

    textValue() {
        return ("<table><tr><td>Id</td><td><a href='https://www.ceneo.pl/" + this.id + "'>" + this.id + "</a></td></tr>" +
            "<tr><td>Rodzaj urządzenia</td><td>" + this.type + "</td></tr>" +
            "<tr><td>Marka</td><td>" + this.brand + "</td></tr>" +
            "<tr><td>Model</td><td>" + this.model + "</td></tr>" +
            "<tr><td>Dodatkowe uwagi</td><td>" + this.remarks + "</td></tr>" +
            "<tr><td>Liczba opinii</td><td>" + this.reviewsCount + "</td></tr></table>"
        );
    }
}

class Review {
    constructor(id, pros, cons, summary, starsCount, author, date, isRecommended, voteYesCount, voteNoCount) {
        this.id = id;
        this.pros = pros;
        this.cons = cons;
        this.summary = summary;
        this.starsCount = starsCount;
        this.author = author;
        this.date = date;
        this.isRecommended = isRecommended;
        this.voteYesCount = voteYesCount;
        this.voteNoCount = voteNoCount;
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
            "<tr><td>Czy poleca</td><td>" + (this.isRecommended ? 'Tak' : 'Nie') + "</td></tr>" +
            "<tr><td>Ocena opinii jako przydatna</td><td>" + this.voteYesCount + "</td></tr>" +
            "<tr><td>Ocena opinii jako nieprzydatna</td><td>" + this.voteNoCount + "</td></tr></table><hr/>"
        );
    }
}