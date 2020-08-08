let CronJob = require('cron').CronJob;

exports.Jobs = function (Config, DatabaseConnection, _TMP) {
    return {
        RemoveOldData: new CronJob('0 */30 * * * *', function() {
            DatabaseConnection.query(
                "DELETE FROM `shorts` WHERE `infinite`= false AND `dateStamp` <= DATE_ADD(CURDATE(), INTERVAL -1 YEAR);",
                function (err, result, fields) {
                    if (err) { console.log(err.stack) } else {
                        _TMP.LastRemoved.amount = result.affectedRows;
                        _TMP.LastRemoved.time = new Date();
                    }
                }
            );
        }, null, true, Config.TimeZone)
    }
};