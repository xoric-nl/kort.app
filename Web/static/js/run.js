const Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace('/++[++^A-Za-z0-9+/=]/g',"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

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

function goBack() {
    window.location.href = window.location.href.split('?')[0];
}

const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');
const url = urlParams.get('url');
if (message) {
    alertify.error(message);
}
if (url) {
    $('#urlToShorten').val(decodeURI(Base64.decode(url)));
    submit();
}

alertify.set('notifier','position', 'top-center');