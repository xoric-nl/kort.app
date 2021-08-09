<?php
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