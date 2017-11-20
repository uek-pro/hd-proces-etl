<?php

interface IConnection {
    public static function prepareDatabase();
    public function connectDatabase();
    public function createTablesIfNotExists();
    public function dropTables();
    public function insertProductIfNotExist($oProduct);
    public function insertReviewsIfNotExists($oReviews, $iProductId);
    public function deleteProductWithReviews($iProductId);
    public function selectProductAndHisReviews($iProductId);
}