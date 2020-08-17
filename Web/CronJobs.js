let CronJob = require('cron').CronJob;
let Moment = require('moment-timezone');

exports.Jobs = function (Config, DatabaseConnection, _TMP) {
    let Logger = require('./logger').Logger(Config);
    return {
        RemoveOldData: new CronJob(Config.Cron.time, function() {
            Logger.info("cron", "Remove old records.");
            DatabaseConnection.query(
                "DELETE FROM `shorts` WHERE `infinite`= false AND `dateStamp` <= DATE_ADD(CURDATE(), INTERVAL -1 YEAR);",
                function (err, result, fields) {
                    if (err) { Logger.danger('sql', err.stack) } else {
                        Logger.info("sql", "Removed " + result.affectedRows + ' records.');
                        _TMP.LastRemoved.amount = result.affectedRows;
                        _TMP.RunInfo.time = Moment.tz(Config.TimeZone).format();
                    }
                }
            );
        }, null, true, Config.TimeZone),
        GetShortedCount: new CronJob(Config.Cron.time, function () {
            Logger.info("cron", "Get total record count.");
            DatabaseConnection.query(
                "SELECT COUNT(`idShorts`) AS `totalShorts` FROM `shorts`;",
                function (err, result, fields) {
                    if (err) { Logger.error('sql', err.stack) } else {
                        _TMP.TotalShorted.amount = result[0]['totalShorts'];
                        Logger.info("sql", "Total number of records is " + result[0]['totalShorts']);
                    }
                }
            );
        }, null, true, Config.TimeZone)
    }
};