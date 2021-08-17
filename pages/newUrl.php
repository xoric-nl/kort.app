<div class="uk-background-secondary">
    <div class="uk-container uk-padding">
        <div class="uk-width-expand uk-margin-large-bottom uk-text-center">
            <img src="img/kort-logo-white.svg" width="15%" />
        </div>
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
<?php include "includes/footer.php" ?>