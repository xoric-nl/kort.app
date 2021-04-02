<?php
function randomString($length = 8) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';

    for ($i = 0; $i < $length; $i++) {
        $index = rand(0, strlen($characters) - 1);
        $randomString .= $characters[$index];
    }

    return $randomString;
}

function saveUrlAndSlug($slug, $url, $token) {
    global $_CONFIG;

    $dbh = new PDO(
        'mysql:host=' . $_CONFIG['database']['host'] . ';dbname=' . $_CONFIG['database']['db'] . ';charset=utf8mb4;port=' . $_CONFIG['database']['port'],
        $_CONFIG['database']['user'], $_CONFIG['database']['pass']
    );
    $sth = $dbh->prepare("INSERT INTO `" . $_CONFIG['database']['prefix'] . "shorts` (`editToken`, `slug`, `url`, `dateStamp`) VALUES (:editToken, :slug, :url, current_timestamp());");
    $sth->bindParam(":editToken", $token, PDO::PARAM_STR);
    $sth->bindParam(":slug", $slug, PDO::PARAM_STR);
    $sth->bindParam(":url", $url, PDO::PARAM_STR);

    return $sth->execute();
}

function existingSlug($slug) {
    global $_CONFIG;

    $dbh = new PDO(
        'mysql:host=' . $_CONFIG['database']['host'] . ';dbname=' . $_CONFIG['database']['db'] . ';charset=utf8mb4;port=' . $_CONFIG['database']['port'],
        $_CONFIG['database']['user'], $_CONFIG['database']['pass']
    );
    $sth = $dbh->prepare("SELECT `slug` FROM `" . $_CONFIG['database']['prefix'] . "shorts` WHERE `slug` = :slug;");
    $sth->bindParam(":slug", $slug, PDO::PARAM_STR);
    $sth->execute();

    return ($sth->rowCount() >= 1);
}

function removeExpiredSlugs() {
    global $_CONFIG;

    $dbh = new PDO(
        'mysql:host=' . $_CONFIG['database']['host'] . ';dbname=' . $_CONFIG['database']['db'] . ';charset=utf8mb4;port=' . $_CONFIG['database']['port'],
        $_CONFIG['database']['user'], $_CONFIG['database']['pass']
    );
    $sth = $dbh->prepare("DELETE FROM `shorts` WHERE `infinite`= false AND `dateStamp` <= DATE_ADD(CURDATE(), INTERVAL -1 YEAR);");
    $sth->execute();
}

function getSlugCount() {
    global $_CONFIG;

    $dbh = new PDO(
        'mysql:host=' . $_CONFIG['database']['host'] . ';dbname=' . $_CONFIG['database']['db'] . ';charset=utf8mb4;port=' . $_CONFIG['database']['port'],
        $_CONFIG['database']['user'], $_CONFIG['database']['pass']
    );
    $sth = $dbh->prepare("SELECT * FROM `" . $_CONFIG['database']['prefix'] . "shorts`;");
    $sth->execute();

    return $sth->rowCount();
}

function getUrlFromSlug($slug) {
    global $_CONFIG;

    $dbh = new PDO(
        'mysql:host=' . $_CONFIG['database']['host'] . ';dbname=' . $_CONFIG['database']['db'] . ';charset=utf8mb4;port=' . $_CONFIG['database']['port'],
        $_CONFIG['database']['user'], $_CONFIG['database']['pass']
    );
    $sth = $dbh->prepare("SELECT * FROM `" . $_CONFIG['database']['prefix'] . "shorts` WHERE `slug` = :slug;");
    $sth->bindParam(":slug", $slug, PDO::PARAM_STR);
    $sth->execute();

    return $sth->fetchAll(PDO::FETCH_ASSOC);
}