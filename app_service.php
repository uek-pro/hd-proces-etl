<?php

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (isset($_POST['protocol'])) {

        if ($_POST['protocol'] == 'get-product-page') {

            if (isset($_POST['productId']) && ctype_digit($_POST['productId'])) {

                $content = getPage(
                    $_POST['productId'],
                    isset($_POST['reviewsPageNumber']) && ctype_digit($_POST['reviewsPageNumber']) ? $_POST['reviewsPageNumber'] : 0
                );

                if ($content != "" ) {
                    $response = showInformation("Wykonano pomyślnie", true, $content);
                } else {
                    $response = showInformation("Nie ma produktu o takim identyfikatorze", false);
                }
            } else {
                $response = showInformation("Proszę podać prawidłowy identyfikator produktu", false);
            }

        } else if ($_POST['protocol'] == 'insert-product-data') {

            if (isset($_POST['productData'])) {

                $json = json_decode($_POST['productData']);
                
                require_once 'database\SQLite_Connection.php';
                $database = SQLite_Connection::prepareDatabase();
                
                $result['isAddedProduct'] = $database->insertProductIfNotExist($json->{'product'});
                $result['reviewsAddedCount'] = $database->insertReviewsIfNotExists($json->{'reviews'}, $json->{'product'}->{'id'});

                $response = showInformation("Informacje o produkcie zostały zapisane w bazie danych", true, $result);
            } else {
                $response = showInformation("Proszę podać informacje o produkcie, które mają znaleść się w bazie danych", false);
            }

        } else if ($_POST['protocol'] == 'get-product-data') {
            
            if (isset($_POST['productId']) && ctype_digit($_POST['productId'])) {
                
                require_once 'database\SQLite_Connection.php';
                $database = SQLite_Connection::prepareDatabase();
                
                $data = $database->selectProductAndHisReviews($_POST['productId']);
                if ($data != null) {
                    $response = showInformation("Informacje o wybranym produkcie zostały wczytane pomyślnie", true, $data);
                } else {
                    $response = showInformation("Nie ma produktu o takim identyfikatorze w bazie danych", false);
                }
            } else {
                $response = showInformation("Proszę podać prawidłowy identyfikator produktu", false);
            }

        } else if ($_POST['protocol'] == 'get-products-list') {
                
            require_once 'database\SQLite_Connection.php';
            $database = SQLite_Connection::prepareDatabase();
            
            $data = $database->selectProducts();
            if ($data != null) {
                $response = showInformation("Produkty wczytane pomyślnie", true, $data);
            } else {
                $response = showInformation("Wystąpił błąd podczas pobierania produktów", false);
            }

        } else if ($_POST['protocol'] == 'get-search-products') {
                
            require_once 'database\SQLite_Connection.php';
            $database = SQLite_Connection::prepareDatabase();

            if (isset($_POST['phrase'])) {

                $content = getSearchedProductsPage($_POST['phrase']);
                if ($content != "" ) {
                    $response = showInformation("Wykonano pomyślnie", true, $content);
                } else {
                    $response = showInformation("Coś poszło nie tak", false);
                }

            } else {
                $response = showInformation("Proszę podać frazę, po której będą szukane produkty", false);
            }

        } else if ($_POST['protocol'] == 'delete-product-data') {
            
            if (isset($_POST['productId']) && ctype_digit($_POST['productId'])) {

                require_once 'database\SQLite_Connection.php';
                $database = SQLite_Connection::prepareDatabase();

                $result = $database->deleteProductWithReviews($_POST['productId']);
                if ($result)
                    $response = showInformation("Usunięto dane produktu o id " . $_POST['productId'], true);
                else 
                    $response = showInformation("Wystąpił błąd podczas usuwania produktu o id " . $_POST['productId'], false);

            } else {
                $response = showInformation("Proszę podać prawidłowy identyfikator produktu", false);
            }

        } else if ($_POST['protocol'] == 'delete-review') {
            
            if (isset($_POST['reviewId']) && ctype_digit($_POST['reviewId'])) {

                require_once 'database\SQLite_Connection.php';
                $database = SQLite_Connection::prepareDatabase();

                $result = $database->deleteReview($_POST['reviewId']);
                if ($result)
                    $response = showInformation("Usunięto opinię o id " . $_POST['reviewId'], true);
                else 
                    $response = showInformation("Wystąpił błąd podczas usuwania opinii o id " . $_POST['reviewId'], false);

            } else {
                $response = showInformation("Proszę podać prawidłowy identyfikator opinii", false);
            }

        } else {
            $response = showInformation("Ale o co chodzi?", true);
        }
    } else {
        $response = showInformation("Co to ma niby znaczyć?!", false);
    }

    echo json_encode($response);
}

function getPage($iItemId, $iReviewsPage = 0) {
    try {
        $content = @file_get_contents("https://www.ceneo.pl/" . $_POST['productId'] . ($iReviewsPage > 1 ? "/opinie-" . $iReviewsPage : ""));
        
        if ($content === false) {
            return "";
        }

        return $content;

    } catch (Exception $e) {
        return "";
    }
}

function getSearchedProductsPage($sPhrase) {
    try {
        $content = @file_get_contents("https://www.ceneo.pl/;szukaj-" . $sPhrase);
        
        if ($content === false) {
            return "";
        }

        return $content;

    } catch (Exception $e) {
        return "";
    }
}

function showInformation($sMessage, $bSuccess, $sResult = "") {
    $aInformation['message'] = $sMessage;
    $aInformation['success'] = $bSuccess;
    if ($sResult != "")
        $aInformation['result'] = $sResult;
    return $aInformation;
}