<div class="redirecting">
    <div class="redirecting-img">
    </div>
    <p style="text-align: left;">
        <div class="redirecting-text">
            U wordt doorgestuurd naar:<br/>
            <span><?= $redirectUrl ?></span>
        </div>
        <br/>
        <br/>
        Dit duurt maximaal 5 seconden.
    </p>
    <a class="button" href="<?= $redirectUrl ?>">Ga direct</a>

    <?php include "includes/footer.php" ?>
</div>