import { DataSource } from "typeorm";


export const myDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'db_user',
    password: '6equj5_db_user',
    database: 'home_db',
    entities: ["src/entity/*.ts"],
    logging: true,
    synchronize: true,
    driver: require('mysql2')
});