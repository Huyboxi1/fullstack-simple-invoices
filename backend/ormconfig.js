module.exports = {
  type: process.env["TYPEORM_DRIVER"] || "postgres",
  host: process.env["POSTGRES_HOST"] || "localhost",
  port: parseInt(process.env["POSTGRES_PORT"] || "5432", 10),
  username: process.env["POSTGRES_USER"] || "postgres",
  password: process.env["POSTGRES_PASSWORD"] || "password",
  database: process.env["POSTGRES_DB"] || "simple_invoice",
  synchronize: !!JSON.parse(process.env["TYPEORM_SYNCHRONIZE"] || "false"),
  logging: !!JSON.parse(process.env["TYPEORM_LOGGING"] || "false"),
  entities: [__dirname + "/dist/**/*.entity.js"],
  migrations: [__dirname + "/dist/migration/*.js"],
  cli: {
    entitiesDir: "src/**/*.entity{.ts,.js}",
    migrationsDir: "src/**/migration"
  }
};
