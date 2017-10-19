<?php

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (isset($_POST['protocol'])) {

        if ($_POST['protocol'] == 'get-item-page') {

            if (isset($_POST['itemId']) && ctype_digit($_POST['itemId'])) {

                $content = getPage($_POST['itemId'], getReviewsPageNumber());
                if ($content != "" ) {
                    $response = showInformation("Wykonano pomyślnie", true, $content);
                } else {
                    $response = showInformation("Nie ma produktu o takim identyfikatorze", false);
                }
                //print_r($http_response_header);
            } else {
                $response = showInformation("Proszę podać prawidłowy identyfikator produktu", false);
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
        $content = @file_get_contents("https://www.ceneo.pl/" . $_POST['itemId'] . ($iReviewsPage > 1 ? "/opinie-" . $iReviewsPage : ""));
        // https://stackoverflow.com/a/272377
        if ($content === false) {
            return "";
        }

        return $content;

    } catch (Exception $e) {
        return "";
    }
}

function getReviewsPageNumber() {
    if (isset($_POST['reviewsPageNumber']) && ctype_digit($_POST['reviewsPageNumber']))
        return $_POST['reviewsPageNumber'];
    else
        return 0;
}

function showInformation($sMessage, $bSuccess, $sResult = "") {
    $aInformation['message'] = $sMessage;
    $aInformation['success'] = $bSuccess;
    if ($sResult != "")
        $aInformation['result'] = $sResult;
    return $aInformation;
}