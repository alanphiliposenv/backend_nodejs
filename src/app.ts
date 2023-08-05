import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+"/.env"});

import "reflect-metadata"
import express from "express";
import loggerMiddleware from "./middleware/logger.middleware";
import dataSource from "./db/postgres.db";
import errorMiddlerware from "./middleware/error.middleware";
import initialzeResponseMiddleware from "./middleware/initializeResponse.middleware";
import departmentRouter from "./routes/department.route"
import employeeRouter from "./routes/employee.route"
import roleRouter from "./routes/role.route";

const server = express();

server.use(initialzeResponseMiddleware);

server.use(express.json());
server.use(loggerMiddleware)

server.use("/api/departments", departmentRouter);
server.use("/api/employees", employeeRouter);
server.use("/api/roles", roleRouter);

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
