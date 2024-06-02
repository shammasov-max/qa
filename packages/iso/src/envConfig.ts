const localDomain = 'https://localhost:443'
const devDomain = 'dev.godj.pro' as const
const prodDomain = 'godj.pro' as const


import { defineEnvConfig } from "../../@shammasov/utils/src/define-env-config";

export const config = defineEnvConfig({
  test: {
    FRONTEND_HOST: localDomain,
    ADMIN_HOST: "http://localhost:19002/",
    MONGO_URI: "mongodb://localhost/qa_test",
    POSTGRES_URI: `postgres://root:BuildMeUp@${devDomain}:37432/dev`,
    WRITE_PG: false,
  },
  local: {
    FRONTEND_HOST: localDomain,
    ADMIN_HOST: "http://localhost:19002/",
    MONGO_URI: "mongodb://localhost/qa_local",
    POSTGRES_URI: `postgres://root:BuildMeUp@${devDomain}:37432/dev`,
    WRITE_PG: false,
  },
  development: {
    FRONTEND_HOST: "https://dev.godj.pro/",
    ADMIN_HOST: "https://dev-admin.godj.pro/",
    MONGO_URI: "mongodb://dev:BuildMeUp@dev.godj.pro:19017/dev",
    POSTGRES_URI: `postgres://root:BuildMeUp@${devDomain}:37432/dev`,
    WRITE_PG: false,
  },
  production: {
    FRONTEND_HOST: "https://godj.pro/",
    ADMIN_HOST: "https://admin.godj.pro/",
    MONGO_URI: "mongodb://dev:BuildMeUp@dev.godj.pro:19017/qa_local_dev",
    POSTGRES_URI: "postgres://root:BuildMeUp@godj.pro:37432/prod",
    WRITE_PG: false,
  },
}).addConsts({
  PORT: 19000,
  SERVER_PORT: 19000,
  VITE_FRONT_PORT: 443,
  VITE_ADMIN_PORT: 19002,
});

export const envConf = config
