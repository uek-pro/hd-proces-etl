<?php

interface IConnection {
    public static function prepareDatabase();
    public function connectDatabase();
    public function createTablesIfNotExists();
    public function dropTables();
    public function insertProductIfNotExist($oProduct);
    public function insertReviewIfNotExist($oReview);
    public function deleteProductWithReviews($iProductId);
}