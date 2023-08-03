import "reflect-metadata"
import express from "express";
import loggerMiddleware from "./middleware/logger.middleware";
import dataSource from "./db/postgres.db";
import employeeRouter from "./routes/employee.route"
import errorMiddlerware from "./middleware/error.middleware";

const server = express();

server.use(express.json());
server.use(loggerMiddleware)
server.use("/employees", employeeRouter);

server.get("/*", (req, res) => {
    console.log(req.url)
    res.status(200).send("hello world")
});

server.use(errorMiddlerware);

(async () => {
    await dataSource.initialize();
    server.listen(3000, () => {
        console.log("Server listening on 3000")
    });
})();
