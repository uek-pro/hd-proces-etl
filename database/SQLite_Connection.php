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
            $this->pdo = new PDO("sqlite:" . self::DATABASE_NAME);
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
            is_recommended TEXT, -- boolean? --
            positive_votes_count INTEGER,
            negative_votes_count INTEGER
            )"
        );
    }

    public function dropTables() {
        $this->pdo->exec("DROP TABLE products");
        $this->pdo->exec("DROP TABLE reviews");
    }

    public function insertProductIfNotExist($oProduct) {
        
        $query = $this->pdo->prepare(
            'INSERT INTO products VALUES (
                :product_id,
                :type,
                :brand,
                :model,
                :remarks
            )'
        );
        $query->bindValue(':product_id', $oProduct->{'id'}, PDO::PARAM_INT);
        $query->bindValue(':type', $oProduct->{'type'}, PDO::PARAM_STR);
        $query->bindValue(':brand', $oProduct->{'brand'}, PDO::PARAM_STR);
        $query->bindValue(':model', $oProduct->{'model'}, PDO::PARAM_STR);
        $query->bindValue(':remarks', $oProduct->{'remarks'}, PDO::PARAM_STR);
        if ($query->execute())
            return true;
        else
            return false;
    }

    public function insertReviewsIfNotExists($oReviews, $iProductId) {
        
        $query = $this->pdo->prepare(
            'INSERT INTO reviews VALUES (
                :review_id,
                :product_id,
                :pros,
                :cons,
                :summary,
                :stars_count,
                :author,
                :date,
                :is_recommended,
                :positive_votes_count,
                :negative_votes_count
            )'
        );

        $counter = 0;

        for ($i = 0, $k = count($oReviews); $i < $k; $i++) {

            $query->bindValue(':review_id', $oReviews[$i]->{'id'}, PDO::PARAM_INT);
            $query->bindValue(':product_id', $iProductId, PDO::PARAM_INT);
            $query->bindValue(':pros', $oReviews[$i]->{'pros'}, PDO::PARAM_STR);
            $query->bindValue(':cons', $oReviews[$i]->{'cons'}, PDO::PARAM_STR);
            $query->bindValue(':summary', $oReviews[$i]->{'summary'}, PDO::PARAM_STR);
            $query->bindValue(':stars_count', $oReviews[$i]->{'starsCount'}, PDO::PARAM_INT);
            $query->bindValue(':author', $oReviews[$i]->{'author'}, PDO::PARAM_STR);
            $query->bindValue(':date', $oReviews[$i]->{'date'}, PDO::PARAM_STR); //date?
            $query->bindValue(':is_recommended', $oReviews[$i]->{'isRecommended'}, PDO::PARAM_STR); //bool?
            $query->bindValue(':positive_votes_count', $oReviews[$i]->{'positiveVotesCount'}, PDO::PARAM_INT);
            $query->bindValue(':negative_votes_count', $oReviews[$i]->{'negativeVotesCount'}, PDO::PARAM_INT);

            if ($query->execute())
                $counter++;
        }

        return $counter;
    }

    public function deleteProductWithReviews($iProductId) {

        $operation = [0 => false, 1 => false];

        $this->pdo->beginTransaction();
        try {
            $query = $this->pdo->prepare('DELETE FROM products WHERE product_id = :id');
            $query->bindValue(':id', $iProductId, PDO::PARAM_INT);
            if ($query->execute() && $query->rowCount() > 0)
                $operation[0] = true;

            $query = $this->pdo->prepare('DELETE FROM reviews WHERE product_id = :id');
            $query->bindValue(':id', $iProductId, PDO::PARAM_INT);
            if ($query->execute() && $query->rowCount() > 0)
                $operation[1] = true;

            $this->pdo->commit();
            return $operation[0] || $operation[1];

        } catch (PDOException $e) {
            $this->pdo->rollBack();
            return false;
        }
    }

    public function selectProductAndHisReviews($iProductId) {
        // TODO: to implement
    }
}