<?php

require_once 'IConnection.php';

class SQLite_Connection implements IConnection {

    const DATABASE_NAME = "database_name.sqlite";
    private $pdo;

    public static function prepareDatabase() {
        $db = new SQLite_Connection();
        $db->connectDatabase();
        $db->createTablesIfNotExists();
        return $db;
    }

    public function connectDatabase() {
        try {
            $this->pdo = new PDO("sqlite:" . DATABASE_NAME);
        }
        catch (PDOException $e) {
            echo $e->getMessage();
            exit();
        }
    }

    public function createTablesIfNotExists() {
        $this->pdo->exec(
            "CREATE TABLE IF NOT EXISTS products (
            product_id INTEGER PRIMARY KEY,
            type TEXT,
            brand TEXT,
            model TEXT,
            remarks TEXT
            )"
        );
        $this->pdo->exec(
            "CREATE TABLE IF NOT EXISTS reviews (
            review_id INTEGER PRIMARY KEY,
            product_id INTEGER,
            pros TEXT,
            cons TEXT,
            summary TEXT,
            stars_count INTEGER,
            author TEXT,
            date TEXT, -- date? --
            is_recommended BOOLEAN,
            vote_yes_count INTEGER,
            vote_no_count INTEGER
            )"
        );
    }

    public function dropTables() {
        $this->pdo->exec("DROP TABLE products");
        $this->pdo->exec("DROP TABLE reviews");
    }

    public function insertProductIfNotExist($oProduct) {

    }

    public function insertReviewIfNotExist($oReview) {

    }

    public function deleteProductWithReviews($iProductId) {

    }
}