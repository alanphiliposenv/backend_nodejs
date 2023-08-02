import "reflect-metadata"
import express from "express";
import { employeeRouter } from "./employee_router";
import loggerMiddleware from "./loggerMiddleware";
import dataSource from "./data-source";

const server = express();

server.use(express.json());
server.use(loggerMiddleware)
server.use("/employees", employeeRouter);

server.get("/*", (req, res) => {
    console.log(req.url)
    res.status(200).send("hello world")
});

(async () => {
    await dataSource.initialize();
    server.listen(3000, () => {
        console.log("Server listening on 3000")
    });
})();