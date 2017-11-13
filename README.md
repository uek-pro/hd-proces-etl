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
    ...
);

CREATE TABLE IF NOT EXISTS reviews (
    ...
);
```

### Schemat działania aplikacji

### Opis wykorzystanych klas

#### Klient

##### Product

Klasa produktu. Konstruktor przydziela wartości, podane jako parametry, polom obiektu.

Pole | Wartość
------- | ----
id |
brand |
model |
remarks |
reviewsCount |

##### ProductParser

##### Review

Klasa opinii. Konstruktor przydziela wartości, podane jako parametry, polom obiektu.

Pole | Wartość
------- | ----
id |
pros |
cons |
summary |
starsCount |
author |
date |
isRecommended |
positiveVotesCount |
negativeVotesCount |

##### ReviewsParser

##### model

##### view

##### controller

##### AppStatus

##### _Events_

#### Serwer

##### IConnection.php (IConnection)

Metody | Parametry | Wartość zwracana | Działanie
------ | --------- | ---------------- | ---------
prepareDatabase() ||| Przygotowanie bazy danych tj. połączenie i ewentualne utworzenie tabel
connectDatabase() ||| Połączenie z bazą danych
createTablesIfNotExists() ||| Utworzenie tabel, jeżeli nie istnieją
dropTables() ||| Usunięcie wszystkich tabel
insertProductIfNotExist($oProduct) | obiekt Product (js) || tmp
insertReviewsIfNotExists($oReviews, $iProductId) | obiekt Review (js), identyfikator produktu || tmp
deleteProductWithReviews($iProductId) | identyfikator produktu || tmp

##### SQLite\_Connection.php (SQLite\_Connection : IConnection)

Zmienna | Wartość
------- | ----
DATABASE_NAME | **stała** Nazwa pliku bazy danych (SQLite)
$pdo | Instancja klasy PDO reprezentująca połącznie z bazą danych

##### app_service.php

Skrypt obsługujący bazę danych oraz umożliwiający pobieranie zawartości stron z innych domen.

Protokół | Metoda | Parametry | Wartość zwracana | Działanie
-------- | ------ | --------- | ---------------- | ---------
get-item-page | POST | itemId - identyfikator produktu | message, success, result | Zapytanie o stronę o podanym, jako parametr, identyfikatorze produktu, a następnie zwrócenie jej kodu tekstowego.
insert-product-data | POST ||||

## Dokumentacja użytkownika

### Instrukcja instalacji aplikacji

### Instrukcja działania aplikacji