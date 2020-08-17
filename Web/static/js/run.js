angular.module('kortApp', ['ngCookies', 'ng-clipboard'])
.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({enabled: true, requireBase: false});
}])
.directive('emptyToNull', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            ctrl.$parsers.push(function(viewValue) {
                if(viewValue === "") {
                    return null;
                }
                return viewValue;
            });
        }
    };
})
.controller('mainController', function ($rootScope, $scope, $cookies, $location) {
    $scope.View = {
        Cookies: {
            Accepted: ($cookies.get('CookiesAccepted') ? !!$cookies.get('CookiesAccepted') : false),
            Accept: function () {
                $cookies.put('CookiesAccepted', true, {
                    expires: new Date(new Date().setFullYear(new Date().getFullYear() + 5))
                });
                this.Accepted = true;
            }
        },
        Views: {
            'InputView': true,
            'ShortUrlView': false,
            'Disclaimer': false,
            'Stats': false,
        },
        setView: function(view) {
            if (view) {
                for (let viewsKey in this.Views) {
                    this.Views[viewsKey] = viewsKey.toLowerCase() === view.toLowerCase();
                }
            }
        },
        getCurrent: function () {
            let returnValue;

            for (let viewsKey in this.Views) {
                // !! To force bool value
                if (!!this.Views[viewsKey]) {
                    returnValue = viewsKey;
                }
            }

            return (!$scope.loading ? returnValue.toLowerCase() : '');
        },
    };

    $scope.Stats = _STATS;
    $scope.Versions = _VERSION;

    $scope.loading = false;
    $scope.loader = function (newValue) {
        if (typeof newValue !== 'undefined') {
            $scope.loading = newValue;
        }

        return $scope.loading;
    };

    $rootScope.shortUrl = null;

    if ($location.search().message) {
        alertify.error($location.search().message);
        $location.search('message', null);
    }
})
.controller('inputViewController', function ($rootScope, $scope, $http, $location) {
    $scope.form = {
        url: {
            value: ($location.search().url ? encodeURI(Base64.decode($location.search().url)) : null)
        },
        slug: {
            value: null
        },
        mail: {
            value: null
        }
    };
    $location.search('url', null);
    $scope.customSlug = false;

    $scope.resetForm = function () {
        $scope.form = {
            url: {
                value: null
            },
            slug: {
                value: null
            },
            mail: {
                value: null
            }
        };
    };

    $scope.submit = function () {
        $scope.loader(true);
        let request = {
            url: $scope.form.url.value
        };

        if ($scope.form.slug.value) {
            request.slug = $scope.form.slug.value;
        }
        if ($scope.form.mail.value) {
            request.mail = $scope.form.mail.value;
        }

        $http.post(location.origin + '/api/new', request)
        .then(({data: response}) => {
            $rootScope.shortUrl = response.Response.newUrl;
            $scope.View.setView('ShortUrlView');
            alertify.success(response.Message);
            $scope.resetForm();
        })
        .catch(({data: response}) => {
            if (response.Status >= 500) {
                alertify.error(response.Message);
            } else {
                alertify.warning(response.Message);
            }
        })
        .finally(() => {
            $scope.loader(false);
        });
    };

    $scope.toggleCustomSlug = function () {
        $scope.customSlug = !$scope.customSlug;
    };
    if ($scope.form.url.value != null) {
        $scope.submit();
    }
})
.controller('shortUrlViewController', function ($rootScope, $scope) {
    $scope.copySuccess = function () {
        alertify.success('Gekopieerd! 😊');
    };
});

const Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace('/++[++^A-Za-z0-9+/=]/g',"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
alertify.set('notifier','position', 'top-center');