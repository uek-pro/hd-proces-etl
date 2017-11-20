# Proces ETL (Projekt)

## Dokumentacja techniczna

### Wykorzystane technologie

- HTML + CSS (wygląd aplikacji)
- JS (logika aplikacji)
- biblioteka jQuery (zapytania AJAX do obsługi aplikacji oraz animacje)
- PHP (obsługa aplikacji, czyli obsługa bazy danych oraz zapytania międzydomenowe)
- SQLite (przechowywanie danych)

### Środowisko uruchomieniowe

Aby aplikacja działała poprawnie, musi znajdować się na serwerze, który zawiera parser PHP wraz ze sterownikiem\* obsługującym interfejs PDO. Ponadto powinna być umieszczona na tej samej domenie co baza danych oraz obsługujący ją skrypt PHP.

\* Instalacja sterownika PDO: <http://php.net/manual/en/pdo.installation.php>

### Struktura bazy danych

```sql
CREATE TABLE IF NOT EXISTS products (
    product_id INTEGER PRIMARY KEY,
    type TEXT,
    brand TEXT,
    model TEXT,
    remarks TEXT
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    pros TEXT,
    cons TEXT,
    summary TEXT,
    starsCount INTEGER,
    author TEXT,
    date TEXT, -- date? --
    isRecommended TEXT, -- boolean? --
    positiveVotesCount INTEGER,
    negativeVotesCount INTEGER
);
```

### Schemat działania aplikacji

### Opis wykorzystanych klas

#### Klient

##### Product

Klasa produktu. Konstruktor przydziela wartości, podane jako parametry, polom obiektu.

Pole | Wartość
------- | ----
id | identyfikator produktu
type | rodzaj urządzenia (kategoria)
brand | marka produktu
model | model produktu
remarks | dodatkowe informacje o produkcie
reviewsCount | liczba opinii na temat produktu

##### Review

Klasa opinii. Konstruktor przydziela wartości, podane jako parametry, polom obiektu.

Pole | Wartość
------- | ----
id | identyfikator opinii
pros | zalety produktu
cons | wady produktu
summary | podsumowanie opinii
starsCount | ocena produktu (0,5-5)
author | autor opinii
date | data wystawienia opinii
isRecommended | informacja czy autor opinii poleca produkt (0-1)
positiveVotesCount | liczba głosów poparcia opinii
negativeVotesCount | liczba głosów odrzucenia opinii

##### ProductParser

Metody | Parametry | Wartość zwracana | Działanie
------ | --------- | ---------------- | ---------
parseProduct() | doc - źródło strony internetowej | Product | Metoda wyciągająca dane o produkcie ze strony internetowej

##### ReviewsParser

Metody | Parametry | Wartość zwracana | Działanie
------ | --------- | ---------------- | ---------
parseReview() | review - element strony internetowej | Review | Metoda wyciągająca dane o pojedyńczej opinii z pojedyńczego elementu fragmentu (`ol.product-reviews > li.review-box`) strony internetowej

##### model

##### view

##### controller

##### _Events_

#### Serwer

##### IConnection.php (IConnection)

Metody | Parametry | Wartość zwracana | Działanie
------ | --------- | ---------------- | ---------
prepareDatabase() ||self| Przygotowanie bazy danych tj. połączenie i ewentualne utworzenie tabel
connectDatabase() ||| Połączenie z bazą danych
createTablesIfNotExists() ||| Utworzenie tabel, jeżeli nie istnieją
dropTables() ||| Usunięcie wszystkich tabel
insertProductIfNotExist($oProduct) | obiekt Product (js) | bool | Dodanie produktu, jeżeli jeszcze takowego nie ma, do bazy danych
insertReviewsIfNotExists($oReviews, $iProductId) | obiekt Review (js), identyfikator produktu | int - liczba dodanych opinii | Dodanie opinii o podanym produkcie do bazy danych, których jeszcze w niej nie ma
deleteProductWithReviews($iProductId) | identyfikator produktu | bool | Usunięcie produktu z bazy danych o podanym identyfikatorze wraz z opiniami na jego temat
selectProductAndHisReviews($iProductId) | identyfikator produktu | array[\]\[\] | Pobranie produktu oraz z jego opiniami.
selectProducts() || array[] | Pobranie pól `product_id` oraz `model` wszystkich produktów

##### SQLite\_Connection.php (SQLite\_Connection : IConnection)

Zmienna | Wartość
------- | ----
DATABASE_NAME | **stała** Nazwa pliku bazy danych (SQLite)
$pdo | Instancja klasy PDO reprezentująca połącznie z bazą danych

##### app_service.php

Skrypt obsługujący bazę danych oraz umożliwiający pobieranie zawartości stron z innych domen.

Protokół | Metoda | Parametry | Wartość zwracana | Działanie
-------- | ------ | --------- | ---------------- | ---------
get-product-page | POST | productId | message, success, result | Zapytanie o stronę o podanym, jako parametr, identyfikatorze produktu, a następnie zwrócenie jej kodu tekstowego.
insert-product-data | POST | productData | message, success, result | Zapytanie o zapis danych (produktu i jego opinii) w bazie danych. |
get-product-data | POST | productId | message, success, result | Zapytanie o wszystkie dane produktu o podanym w parametrze identyfikatorze. |
get-products-list | POST | | message, success, result | Zapytanie o pobranie danych (product_id, model) o wszystkich produktach. |
||GET| obsluga, [productId] | message | W zależności od wartości parametru `obsluga` następuje, usunięcie całej zawartości bazy lub produktu o podanym w parametrze identyfikatorze wraz z opiniami na jego temat.

## Dokumentacja użytkownika

### Instrukcja instalacji aplikacji

### Instrukcja działania aplikacji