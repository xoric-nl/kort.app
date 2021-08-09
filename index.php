<?php
$errorMessage = false;
$includeConfig = @include 'includes/config.php';
$includeFunctions = @include 'includes/functions.php';

if ($includeConfig && $includeFunctions) {
    removeExpiredSlugs();

    if ($_SERVER['REQUEST_METHOD'] === "POST" || isset($_GET['url'])) {
        include "includes/createSlug.php";
    } else {
        if (isset($_GET['path'])) {
            $results = getUrlFromSlug($_GET['path']);
            if (count($results) >= 1) {
                $redirectUrl = $results[0]['url'];
            } else {
                $errorMessage = true;
                $Result['type'] = 'warning';
                $Result['title'] = 'Ongeldig';
                $Result['message'] = 'Deze verkorte URL is niet langer beschikbaar.';
            }
        }
    }

    $slugCount = getSlugCount();
} else {
    $errorMessage = true;
    $Result = [
        "type" => "danger",
        "title" => "Whoops",
        "message" => "Geen configuratie bestand gevonden!"
    ];
}
?>
<!DOCTYPE html>
<html lang="nl">
    <head>
        <title>Kort.App - Verkort anoniem en snel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <?php if (isset($redirectUrl)) { ?>
<!--            <meta http-equiv="refresh" content="5;url=--><?//= $redirectUrl ?><!--" />-->
            <link rel="stylesheet" href="css/redirecting.css" />
        <?php } else { ?>
            <link rel="stylesheet" href="css/main.css" />
            <script src="js/uikit.min.js"></script>
            <script src="js/uikit-icons.min.js"></script>
        <?php } ?>

        <meta name="title" content="Kort.App - Verkort anoniem en snel">
        <meta name="description" content="Verkort al uw lange URL's naar vriendelijke korte URL's.">
        <meta name="keywords" content="URL, Short, Kort, Veklein, Snel, Anoniem, Eenvoudig, Publiek">
        <meta name="robots" content="index, follow">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="language" content="Nederlands">
        <link rel="icon" type="image/png" href="img/favicon.png" />

        <!-- COMMON TAGS -->
        <meta charset="utf-8">
        <title>Kort.App - Verkort anoniem en snel</title>
        <!-- Search Engine -->
        <meta name="description" content="Verkort al uw lange URL's naar vriendelijke korte URL's.">
        <!-- Schema.org for Google -->
        <meta itemprop="name" content="Kort.App - Verkort anoniem en snel">
        <meta itemprop="description" content="Verkort al uw lange URL's naar vriendelijke korte URL's.">
        <!-- Twitter -->
        <meta name="twitter:card" content="summary">
        <meta name="twitter:title" content="Kort.App - Verkort anoniem en snel">
        <meta name="twitter:description" content="Verkort al uw lange URL's naar vriendelijke korte URL's.">
        <!-- Open Graph general (Facebook, Pinterest & Google+) -->
        <meta name="og:title" content="Kort.App - Verkort anoniem en snel">
        <meta name="og:description" content="Verkort al uw lange URL's naar vriendelijke korte URL's.">
        <meta name="og:url" content="https://kort.app">
        <meta name="og:site_name" content="Kort.App - Verkort anoniem en snel">
        <meta name="og:locale" content="nl_NL">
        <meta name="og:type" content="website">
    </head>
    <body>
        <?php
            if (isset($redirectUrl)) {
                include "pages/redirect.php";
            } else {
                include "pages/newUrl.php";
            }
        ?>
    </body>
</html>
