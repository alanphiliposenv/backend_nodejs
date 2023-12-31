import * as dotenv from "dotenv";
dotenv.config({ path: "./.env"});

import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const dataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: ["dist/entity/*.js"],
    logging: true,
    namingStrategy: new SnakeNamingStrategy(),
    migrations: ["dist/db/migrations/*.js"],
});

export default dataSource;
