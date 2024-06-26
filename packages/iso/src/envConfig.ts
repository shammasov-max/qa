const localDomain = 'https://localhost:443'
const devDomain = 'dev.godj.pro' as const
const prodDomain = 'godj.pro' as const


import { defineEnvConfig } from "../../@common/utils/src/define-env-config";

export const config = defineEnvConfig({
  test: {
    VITE_FRONT_PORT: 20002,
    FRONTEND_HOST: localDomain,
    ADMIN_HOST: "http://localhost:20002/",
    MONGO_URI: "mongodb://localhost:27018/dev-qa",
    POSTGRES_URI: `postgres://root:BuildMeUp@${devDomain}:37432/dev`,
    WRITE_PG: false,
  },
  local: {
    VITE_FRONT_PORT: 20002,
    FRONTEND_HOST: localDomain,
    ADMIN_HOST: "http://localhost:20002/",
    MONGO_URI: "mongodb://localhost:27018/dev-qa",
    POSTGRES_URI: `postgres://root:BuildMeUp@${devDomain}:37432/dev`,
    WRITE_PG: false,
  },
  development: {
    VITE_FRONT_PORT: 20002,
    FRONTEND_HOST: "https://dev.godj.pro/",
    ADMIN_HOST: "https://dev-admin.godj.pro/",
    MONGO_URI: "mongodb://localhost:27018/dev-qa",
    POSTGRES_URI: `postgres://root:BuildMeUp@${devDomain}:37432/dev`,
    WRITE_PG: false,
  },
  production: {
    VITE_FRONT_PORT: 20002,
    FRONTEND_HOST: "https://godj.pro/",
    ADMIN_HOST: "https://admin.godj.pro/",
    MONGO_URI: "mongodb://localhost:27018/dev-qa",
    POSTGRES_URI: "postgres://root:BuildMeUp@godj.pro:37432/prod",
    WRITE_PG: false,
  },
}).addConsts({
  PORT: 20000,
  SERVER_PORT: 20000,

  VITE_ADMIN_PORT: 20002,
});

export const envConf = config
