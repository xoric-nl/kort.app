<?php
$errorMessage = false;
$includeConfig = @include 'includes/config.php';
$includeFunctions = @include 'includes/functions.php';

if ($includeConfig && $includeFunctions) {
    removeExpiredSlugs();

    if ($_SERVER['REQUEST_METHOD'] === "POST" || isset($_GET['url'])) {
        $errorMessage = true;
        $Result = [
            "type" => "success",
            "title" => "Super",
            "message" => "Uw opgegeven URL is nu lekker kort."
        ];

        if (isset($_GET['url'])) {
            $validUrl = filter_var(base64_decode($_GET['url']), FILTER_VALIDATE_URL);
        } else {
            $validUrl = filter_var($_POST['shortUrl'], FILTER_VALIDATE_URL);
        }

        if ($validUrl) {
            $url = (isset($_GET['url']) ? base64_decode($_GET['url']) : $_POST['shortUrl']);

            if (strpos(strtolower($url), "kort.app") !== false) {
                $Result["type"] = "danger";
                $Result["title"] = "Whoops";
                $Result["message"] = "Deze URL kan toch echt niet korter. Sorry";
            } else {
                $slug = !empty($_POST['custom_slug']) ? $_POST['custom_slug'] : randomString();
                $editToken = randomString(50);

                while (existingSlug($slug) && empty($_POST['custom_slug'])) {
                    $slug = randomString();
                }

                if (!saveUrlAndSlug($slug, $url, $editToken)) {
                    if (empty($_POST['custom_slug'])) {
                        $Result["type"] = "danger";
                        $Result["title"] = "Whoops";
                        $Result["message"] = "Daar ging iets fout tijdens het opslaan van de URL. Probeer het later opnieuw.";
                    } else {
                        $Result["type"] = "warning";
                        $Result["title"] = "Whoops";
                        $Result["message"] = "De aangepaste slug '$slug' is al bij ons bekend. Deze kunt u helaas niet gebruiken.";
                    }
                } else {
                    $actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]" . strtok($_SERVER['REQUEST_URI'], '?');
                    $url = $actual_link . $slug;
                    $urlQR = urlencode($url);
                    $Result["message"] .= "<br/><br/><div class='uk-text-center'><img src='https://quickchart.io/qr?text=$urlQR&size=200' alt='QR Code' /><br/><br/><a class='uk-link' href='$url'>$url</a></div>";
                }
            }
        } else {
            $Result['type'] = 'warning';
            $Result['title'] = 'Ongeldig';
            $Result['message'] = 'De opgegeven URL is geen geldige URL.';
            $Result['url'] = $_POST['shortUrl'];
        }
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
        <link rel="stylesheet" href="css/main.css" />
        <script src="js/uikit.min.js"></script>
        <script src="js/uikit-icons.min.js"></script>
        <?php if (isset($redirectUrl)) { ?>
            <meta http-equiv="refresh" content="0;url=<?= $redirectUrl ?>" />
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
        <div class="uk-background-secondary">
            <div class="uk-container uk-padding">
                <form class="uk-width-expand" method="post">
                    <h3 style="color: white; margin-bottom: 10px; text-align: center">Voer de URL in die verkleind moet worden.</h3>
                    <div class="uk-grid uk-grid-collapse" uk-grid="">
                        <div class="uk-width-expand@m">
                            <input type="text" class="uk-input" placeholder="https://kort.app" name="shortUrl" id="shortUrl" value="<?= isset($Result['url']) ? $Result['url'] : '' ?>" />
                        </div>
                        <div class="uk-width-small@m">
                            <input type="submit" value="Verklein" class="uk-button uk-button-primary uk-width-expand">
                        </div>
                    </div>
                    <div class="uk-margin-top uk-text-center uk-text-uppercase" id="customOptionsBtn" style="color: white;">
                        <small class="uk-text-middle" style="flex: auto; color: #ccc;">
                            <i uk-icon="cog" style="margin-right: 5px;"></i>
                            <a style="color: #ccc; vertical-align: middle;" onclick="document.getElementById('customOptions').classList.remove('uk-hidden'); document.getElementById('customOptionsBtn').classList.add('uk-hidden');">Geavanceerde opties</a>
                            <i uk-icon="cog" style="margin-left: 5px;"></i>
                        </small>
                    </div>
                    <div class="uk-margin-small-top uk-hidden" id="customOptions">
                        <h4 style="color: white; margin-bottom: 5px; margin-top: 0; text-align: left">Geavanceerde opties</h4>
                        <div class="uk-grid uk-grid-small" uk-grid="">
                            <div class="uk-width-1-2@m">
                                <input type="text" class="uk-input" placeholder="Aangepaste verkorte url (slug)" name="custom_slug" />
                            </div>
<!--                            <div class="uk-width-1-2@m">-->
<!--                                <input type="text" class="uk-input" placeholder="Aangepaste verkorte url (slug)" name="customSlug" />-->
<!--                            </div>-->
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="uk-container uk-padding">
            <?php if (isset($redirectUrl)) { ?>
                <div class="uk-alert uk-alert-success">
                    <h3 class="uk-margin-remove">Even geduld AUB...</h3>
                    <div class="uk-margin-remove">
                        U wordt doorgestuurd naar <?= $redirectUrl ?>.
                        <br><br>
                        Mocht u hier langer dan 5 seconden zijn klik dan <a href="<?= $redirectUrl ?>">hier</a>!
                    </div>
                </div>
            <?php } ?>
            <?php if ($errorMessage) { ?>
                <div class="uk-alert uk-alert-<?= $Result['type'] ?>">
                    <h3 class="uk-margin-remove"><?= $Result['title'] ?></h3>
                    <div class="uk-margin-remove"><?= $Result['message'] ?></div>
                </div>
            <?php } ?>
            <div class="uk-alert uk-alert-primary">
                <h3 class="uk-margin-remove">Ontwikkeling</h3>
                <div class="uk-margin-remove">
                    Er wordt nog regelmatig aan de functionalliteiten van Kort.App gewerkt.
                    <br/>
                    Zo wordt het mogelijk om op een later moment de bestemming van de slug te wijzigen.
                </div>
            </div>

            <div class="uk-margin-large-top">
                <h2 class="uk-margin-remove">Statistieken</h2>
                <p class="uk-margin-remove">Wij zijn transparent in hoevaak deze site gebruikt is. Daarom hier een aantal getalletjes.</p>
                <table class="uk-table uk-table-striped uk-width-expand">
                    <thead>
                        <tr>
                            <th>Soort</th>
                            <th>Aantal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                Aangemaakt
                            </td>
                            <td><?= $slugCount ?></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="uk-margin-large-top">
                <h2 class="uk-margin-remove">Privacy</h2>
                <p class="uk-margin-remove">
                    Privacy is bij ons van groot belang.
                    Veel verkorters op het internet slaan meer informatie op dan nodig is.
                    Denk hier bij aan bijv uw IP adres en e-mail adres.
                    Deze gegevens heeft natuurlijk niets te maken met de door u aangevraagde doorverwijzing.
                    Hier door hebben wij besloten om deze gegevens <b>niet</b> op te slaan.
                    <br><br>
                    De enige gegevens die wij op dit moment bewaren zijn als volgt:
                </p>
                <ul class="uk-list uk-list-bullet">
                    <li>SLUG (verkorte versie van de URL)</li>
                    <li>URL</li>
                    <li>Datum/tijd</li>
                    <li>Wijzigings token</li>
                </ul>
                <p class="uk-margin-remove">
                    Klinkt onwerkelijk toch? Om u er toch van te kunnen garanderen is de source code van deze website volledig beschikbaar en zichtbaar voor iedereen.
                    Eerst zien dan geloven? Klik dan <a href="https://github.com/xoric-nl/kort.app">hier</a>.
                </p>
                <p>
                    De gegevens die de website waarnaar wordt doorverwezen zelf opslaat kunnen wij niet voorkomen. U zit simpelweg niet meer bij ons op de website. Wij zijn dan dus ook niet verantwoordelijk voor uw gegevens welke doormiddel van een doorverwijzing via Kort.App bij derden worden bewaard.
                </p>
            </div>
        </div>
        <footer class="uk-container uk-padding">
            <div class="uk-grid uk-grid-small uk-text-small uk-child-width-expand" uk-grid="">
                <div>
                    Kort.App is een applicatie gemaakt door <a href="https://xoric.nl/">XORIC</a>.
                </div>
                <div class="uk-text-right">
                    &copy; XORIC - 2020
                    <div class="uk-margin-small-top">
                        <img src="img/logo.png" alt="XORIC - Logo" width="100px">
                    </div>
                </div>
            </div>
            <div class="uk-text-right">
            </div>
        </footer>
    </body>
</html>
