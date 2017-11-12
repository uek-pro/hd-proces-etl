<?php

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (isset($_POST['protocol'])) {

        if ($_POST['protocol'] == 'get-item-page') {

            if (isset($_POST['itemId']) && ctype_digit($_POST['itemId'])) {

                $content = getPage(
                    $_POST['itemId'],
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
                
                $database->insertProductIfNotExist($json->{'product'});
                $addedCount = $database->insertReviewsIfNotExists($json->{'reviews'}, $json->{'product'}->{'id'});

                $response = showInformation("Informacje o produkcie zostały zapisane w bazie danych", true, $addedCount);
            } else {
                $response = showInformation("Proszę podać informacje o produkcie, które mają znaleść się w bazie danych", false);
            }
        } else {
            $response = showInformation("Ale o co chodzi?", true);
        }
    } else {
        $response = showInformation("Co to ma niby znaczyć?!", false);
    }

    echo json_encode($response);

} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if (isset($_GET['obsluga'])) {

        require_once 'database\SQLite_Connection.php';
        $database = SQLite_Connection::prepareDatabase();

        if ($_GET['obsluga'] == '123456q') {

            // TODO: getRecords();

        } else if ($_GET['obsluga'] == 'del') {
            
            if (isset($_GET['id']) && ctype_digit($_GET['id'])) {
                
                $result = $database->deleteProductWithReviews($_GET['id']);
                if ($result)
                    echo 'Usunięto dane produktu o id ' . $_GET['id'];
                else 
                    echo 'Wystąpił błąd podczas usuwania produktu o id ' . $_GET['id'];
            }
            
        } else if ($_GET['obsluga'] == 'del123') {

            $database->dropTables();
            echo 'Usunięcie rekordów bazy danych.';
        }
    }
}

function getPage($iItemId, $iReviewsPage = 0) {
    try {
        $content = @file_get_contents("https://www.ceneo.pl/" . $_POST['itemId'] . ($iReviewsPage > 1 ? "/opinie-" . $iReviewsPage : ""));
        
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