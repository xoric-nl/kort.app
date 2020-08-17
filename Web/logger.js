let Moment = require('moment-timezone');

exports.Logger = function (Config) {
    return {
        log: function (level, type, msg) {
            console.log(Moment.tz(Config.TimeZone).format() + ' [' + level.toUpperCase() + '] [' + type.toUpperCase() + '] ' + msg);
        },
        info: function (type, msg) {
            this.log("INFO", type, msg);
        },
        warning: function (type, msg) {
            this.log("WARNING", type, msg);
        },
        error: function (type, msg) {
            this.log("ERROR", type, msg);
        }
    }
};