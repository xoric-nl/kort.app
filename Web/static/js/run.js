function copyNewUrl() {
    /* Get the text field */
    var copyText = document.getElementById("newUrl");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");
}

function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
}

function submit() {
    $('#loader').removeClass("hidden");
    $('#inputForm').addClass("hidden");
    $('#successNotification').addClass("hidden");

    if($('#urlToShorten').val() && isUrl($('#urlToShorten').val())){
        $.ajax({
            type: 'POST',
            url: '/api/new',
            data: JSON.stringify(
                {
                    url: $('#urlToShorten').val()
                }
            ),
            success: function(data) {
                alertify.success('De url is verkleind 😊');
                $('#inputForm').addClass("hidden");
                $('#successNotification').removeClass("hidden");
                $("#smallText").html('Nice, je URL is nu lekker kort 😁');

                $("#newUrl").val(data.Response.newUrl);
                $('#loader').addClass("hidden");
            },
            error: function(data) {
                alertify.error(data.responseJSON.Message);
                $('#loader').addClass("hidden");
            },
            contentType: "application/json",
            dataType: 'json'
        });
    } else {
        if ($('#urlToShorten').val()) {
            alertify.warning('De waarde moet een url zijn! 😒');
        } else {
            alertify.warning('De url mag niet leeg zijn 😒');
        }
        $('#inputForm').removeClass("hidden");
        $('#successNotification').addClass("hidden");
        $("#smallText").html('Lekker snel een URL verkleinen?');
        $('#loader').addClass("hidden");
    }
}

const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');
if (message) {
    alertify.error(message);
}

alertify.set('notifier','position', 'top-center');