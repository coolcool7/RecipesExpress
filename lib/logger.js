const winston = require('winston');
const thisLogger = winston.createLogger({
    level: process.env.LOG || 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

module.exports = {

    info: function info(message) {
        thisLogger.info(message);
    },

    debug: function debug(message) {
        thisLogger.debug(message);
    },

    warn: function warn(message) {
        thisLogger.warn(message)
    },

    error: function error(message) {
        thisLogger.error(message);
    }
}
