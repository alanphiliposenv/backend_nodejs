import winston from "winston";

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
};

const logger = winston.createLogger(logConfiguration);

export default logger;
