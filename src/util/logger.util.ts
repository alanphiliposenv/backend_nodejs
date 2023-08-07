import winston from "winston";

class Logger {
    private logger: winston.Logger;
    constructor(config: winston.LoggerOptions) {
        this.logger = winston.createLogger(config);
    }
    public info(msg: string) {
        this.logger.info(msg);
    }
    public warn(msg: string) {
        this.logger.warn(msg);
    }
    public error(msg: string) {
        this.logger.error(msg);
    }
}

const logConfiguration = {
    level: "info",
    transports: [
        new winston.transports.Console(),
        new winston.transports.File(
            { filename: "server.log" }
        )
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
    )
}

const logger = new Logger(logConfiguration);

export default logger;
