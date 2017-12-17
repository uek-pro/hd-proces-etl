# Proces ETL (Projekt)

## Dokumentacja techniczna

### Wykorzystane technologie

- HTML i CSS (wygląd aplikacji)
- JS (logika aplikacji) + biblioteka jQuery (zapytania AJAX do obsługi aplikacji)
- PHP (obsługa bazy danych oraz zapytania międzydomenowe)
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
    starsCount REAL,
    author TEXT,
    date DATE,
    isRecommended BOOLEAN,
    positiveVotesCount INTEGER,
    negativeVotesCount INTEGER
);
```

### Schemat działania aplikacji

### Opis wykorzystanych klas

#### Javascript

##### Product

Klasa produktu. Konstruktor przydziela wartości, podane jako parametry, polom obiektu.

Pole | Wartość
---- | -------
id | identyfikator produktu
type | rodzaj urządzenia (kategoria)
brand | marka produktu
model | model produktu
remarks | dodatkowe informacje o produkcie
reviewsCount | liczba opinii na temat produktu

##### Review

Klasa opinii. Konstruktor przydziela wartości, podane jako parametry, polom obiektu.

Pole | Wartość
---- | -------
id | identyfikator opinii
pros | zalety produktu
cons | wady produktu
summary | podsumowanie opinii
starsCount | ocena produktu
author | autor opinii
date | data wystawienia opinii
isRecommended | informacja czy autor opinii poleca produkt (0-1)
positiveVotesCount | liczba głosów poparcia opinii
negativeVotesCount | liczba głosów odrzucenia opinii

##### Mode

Typ wyliczeniowy, definiujący źródło danych aplikacji.

Pole | Wartość
---- | -------
CENEO | 0
DATABASE | 1

##### ProductParser

Metoda | Parametry | Wartość zwracana | Opis
------ | --------- | ---------------- | ----
parseProduct() | $(document) | Product | Metoda wyciągająca dane o produkcie ze struktury strony internetowej.

##### ReviewsParser

Metoda | Parametry | Wartość zwracana | Opis
------ | --------- | ---------------- | ----
parseReview() | $(element) | Review | Metoda wyciągająca dane o pojedyńczej opinii z pojedyńczego elementu struktury (`ol.product-reviews > li.review-box`) na stronie internetowej.

##### DownloadHelper

Metoda | Parametry | Opis
------ | --------- | ----
download() | filename:string, text:string, encoding:string='utf8' | Funkcja zapisująca dane tekstowe zapisane w danym kodowaniu do danego pliku.

##### model

Pole | Opis
---- | -------
mode | źródło pobierania danych (enum)
productId | identyfikator produktu, który został podany w formularzu
product | obiekt klasy Product, zawierający informacje o produkcie
pageCount | liczba stron z opiniami o danym produkcie
rawData | tablica ze źródłami pobranych stron internetowych
processedData | tablica przetworzonych opinii, czyli zawierająca obiekty klasy Review

Metoda | Parametry | Wartość zwracana | Opis
------ | --------- | ---------------- | ----
extract | productId:int, isWholeProcess:bool=false, counter:int=1 || Metoda przeprowadzająca proces EXTRACT lub inicjująca cały proces (ETL).
transform | isWholeProcess:bool=false || Metoda przeprowadzająca proces TRANSFORM.
load ||| Metoda przeprowadzająca proces LOAD.
getProcessedData || this.processedData | Metoda zwracająca wartość pola processedData.
isInitialState || bool | Metoda sprawdzająca czy aplikacja znajduje się w stanie wyjściowym.
clear ||| Metoda przywracająca wartości pól do stanu początkowego
getProductDataFromDatabase | productId:int || Metoda pobierająca informacje o produkcie z bazy danych.
updateProductsFromDatabase ||| Metoda aktualizująca opcje w inpucie select.
deleteProductData | productId:int || Metoda usuwająca wszystkie informacje o produkcie o podanym w parametrze identyfikatorze.
deleteReview | reviewId:int, elementId:int || Metoda usuwająca opinię o podanym w parametrze identyfikatorze opinii.
saveReview | reviewId:int || Metoda zapisująca daną opinię do pliku w formacie .json.
saveAllReviews | type:string || Metoda zapisująca wszystkie opinie o produkcie do pliku w jednym z dwóch możliwych formatów - .json lub .csv.

##### view

Metoda | Parametry | Opis
------ | --------- | ----
displayMessage | text:string | Ustawia tekst elementowi `#message`
clearMessage || Usuwa tekst z elementu `#message`
showIndicator || Tworzy strukturę znaczników, pełniącą rolę indicatora
hideIndicator || Usuwa znaczniki tworzące indicator
displayProductInfo | product:Product, isFromDatabase:bool | Ustawia elementowi `#transform-result` kod HTML zawierający informacje o produkcie oraz w zależności od źródła danych dodatkowe opcje.
appendAllReviews | reviews:Review[], isFromDatabase:bool | Ustawia elementowi `#transform-result` kod HTML zawierający listę opinii oraz w zależności od źródła danych dodatkowe opcje dla każdej opinii.
displayExtractReport | data:string[4] | Ustawia elementowi `#extract-result` kod HTML zawierający informacje statystyczne po operacji EXTRACT.
displayLoadReport | data:string[3] | Ustawia elementowi `#load-result` kod HTML zawierający informacje statystyczne po operacji LOAD.
clearReports || Usuwa zawartości elementów `#extract-result`, `#transform-result` i `#load-result`.
fadeReview | elementId:int | Przyblednia opinię o przekazanym w parametrze identyfikatorze.
setElementActivity | isActive:bool, handle:$(element) | Ustawia, bądź usuwa klasę `active` elementowi podanemu w parametrze.
setElementsVisibility | isVisible:bool, handles:$(element)[] | Odkrywa, bądź ukrywa wszystkie elementy podane w parametrze.

##### controller

Pole | Wartość
---- | -------
model | obiekt model
view | obiekt view

Metoda | Parametry | Opis
------ | --------- | ----
showProductInfoFromDatabase | productId:int | Metoda pobierająca informacje o produkcie z bazy danych.
showMessage | textContent:string | Metoda wyświetlająca wiadomość dla użytkownika.
hideMessage || Metoda chowająca treść wiadomości.
displayProductInfo | product:Product, isFromDatabase:bool | Metoda wyświetlająca informacje o produkcie. Wyświetlane są także dodatkowe opcje zależne od typu źródła danych.
showAllReviews | reviews:Review[], isFromDatabase:bool | Metoda wyświetlająca opinie o produkcie. Wyświetlane są także dodatkowe opcje zależne od typu źródła danych.
showExtractReport | data:string[] | Metoda wyświetlająca informacje statystyczne po operacji EXTRACT.
showLoadReport | data:string[] | Metoda wyświetlająca informacje statystyczne po operacji LOAD.
setElementsVisibility | isVisible:bool, ...handles:$(element) | Metoda wyświetlająca, bądź chowająca podane elementy aplikacji.
changeMode | mode:Mode | Metoda ustawiająca UI w zależności od typu źródła danych.
updateProductsAsync || Metoda aktualizująca wybory pola wyboru produktu.
startIndicator || Metoda włączająca animację indicatora.
stopIndicator || Metoda zatrzymująca indicator.
extractData | productId:int, isWholeProcess:bool=false | Metoda przeprowadzająca proces EXTRACT lub inicjująca pełny proces ETL.
transformData || Metoda przeprowadzająca proces TRANSFORM.
loadData || Metoda przeprowadzająca proces LOAD.
clearData || Metoda czyszcząca dane przechowywane w pamięci oraz przywracająca aplikację do stanu wyjściowego.
saveAllReviews | type:string | Metoda zapisująca wszystkie opinie o podanym produkcie do pliku w jednym z dwóch podanych formatów - .json albo .csv.
saveReview | reviewId:int | Metoda zapisująca wybraną opinie do pliku w formacie .json.
deleteProductData | productId:int | Metoda usuwająca informacje o produkcie o podanym identyfikatorze.
deleteReview | reviewId:int, elementId:int | Metoda usuwająca wybraną opinie o produkcie.
fadeReview | reviewId:int | Metoda przybledniająca wybraną opinię o produkcie.

#### PHP

##### IConnection.php (IConnection)

Metoda | Parametry | Wartość zwracana | Opis
------ | --------- | ---------------- | ----
prepareDatabase || self | Przygotowanie bazy danych tj. połączenie i ewentualne utworzenie tabel.
connectDatabase ||| Połączenie z bazą danych.
createTablesIfNotExists ||| Utworzenie tabel, jeżeli nie istnieją.
dropTables ||| Usunięcie wszystkich tabel.
insertProductIfNotExist | $oProduct:Product | bool | Dodanie produktu, jeżeli jeszcze takowego nie ma, do bazy danych.
insertReviewsIfNotExists | $aReviews:Reviews[], $iProductId:int | int | Dodanie opinii o podanym produkcie do bazy danych, których jeszcze w niej nie ma. Metoda zwraca liczbę dodanych opinii.
deleteProductWithReviews | $iProductId:int | bool | Usunięcie produktu z bazy danych o podanym identyfikatorze wraz z opiniami na jego temat.
deleteReview | $iReviewId:int | bool | Usunięcie pojedyńczej opinii.
selectProductAndHisReviews | $iProductId:int | array[\]\[\] | Pobranie produktu wraz z jego opiniami. Metoda zwraca tablicę asocjacyjną zawierającą tablicę obiektów Review, pojedyńczy obiekt Product oraz informację liczbę opinii.
selectProducts || array[] | Pobranie pól `product_id` oraz `model` wszystkich produktów.

##### SQLite\_Connection.php (SQLite\_Connection : IConnection)

Zmienna | Wartość
------- | -------
DATABASE_NAME | **stała** Nazwa pliku bazy danych (SQLite)
$pdo | Instancja klasy PDO reprezentująca połącznie z bazą danych

##### app_service.php

Funkcja | Parametry | Wartość zwracana | Opis
------- | --------- | ---------------- | ----
getPage | $iItemId:int, $iReviewsPage:int=0 | string | Funkcja pobierająca stronę internetową serwisu ceneo, zawierającą informacje o danym produkcie oraz listę opinii na jego temat.
showInformation | $sMessage:string, $bSuccess:bool, $sResult:any="" | array[] | Funkcja wyświetlająca informacje, w formie tablicy asocjacyjnej, na zapytanie do obsługi aplikacji.

Skrypt obsługujący bazę danych oraz umożliwiający pobieranie zawartości stron z innych domen. Wszystkie zapytania przekazywane są metodą POST, a dodatkowe wartości zwracane są tablicą asocjacyjną, zawierającą elementy takie jak:

- message - wiadomość od obsługi aplikacji
- success - informacja czy polecenie zostało pomyślnie wykonane
- result - przesłana z obsługi aplikacji wartość dodatkowa zależna od protokołu

Protokół | Parametry | Opis
-------- | --------- | ----
get-product-page | productId | Zapytanie o stronę o podanym, jako parametr, identyfikatorze produktu, a następnie zwrócenie jej kodu tekstowego.
insert-product-data | productData | Zapytanie o zapis danych (produktu i jego opinii) w bazie danych. Pomyślne wykonanie zwraca, w formie tablicy asocjacyjnej, informacje o liczbie dodanych opinii i czy podany produkt znajdował się już w bazie danych. |
get-product-data | productId | Zapytanie o wszystkie dane produktu o podanym w parametrze identyfikatorze. Pomyślne wykonanie zwraca, w formie tablicy asocjacyjnej, produkt, opinie na jego temat oraz ich liczbę.
get-products-list || Zapytanie o pobranie danych (product_id, model) o wszystkich produktach.
delete-product-data | productId || Zapytanie usuwające informacje o produkcie (wraz z opiniami na jego temat) o podanym identyfikatorze.
delete-review | reviewId || Zapytanie usuwające opinię o podanym identyfikatorze.

## Dokumentacja użytkownika

### Instrukcja instalacji aplikacji

### Instrukcja działania aplikacji