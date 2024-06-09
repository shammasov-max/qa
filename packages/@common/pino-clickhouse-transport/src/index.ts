import build from "pino-abstract-transport";
import { createClient } from "@clickhouse/client";
import type { NodeClickHouseClientConfigOptions } from "@clickhouse/client/dist/config";
import { mergeDeepRight } from "ramda";
import { DateTime } from "luxon";

const defaultOptions: PinoClickhouseOptions = {
  client: {
    clickhouse_settings: {
      session_timezone: "Europe/Moscow",
    },
    database: "default",
    //    username:'default',
    //   password:'BuildMeUp',
    url: "http://localhost:8123",
  },
  table: "log",
  createTable: `
SET allow_experimental_object_type=1;
create table if not exists default.log
(
        datetime  Datetime64(6),
        level Enum8('trace' = 10,  'debug'= 20, 'info'= 30,'warn'=40,'error'= 50,'fatal'= 60),
        body JSON,
        msg String
) engine = MergeTree PRIMARY KEY ( level,datetime)
ORDER BY (level,datetime)
SETTINGS index_granularity = 1024;

CREATE TABLE  if not exists  default.redirects_buffer AS redirects ENGINE = Buffer(default, redirects, 1, 10, 100, 10, 1000, 10000, 100000000)`,
};
export type PinoClickhouseOptions = {
    table?:string,

    client?: NodeClickHouseClientConfigOptions
    createTable?: string
}


type  LogRow = {
    datetime: string
    module: string
    id: number
    type: string
    level: string
    message: string
    payload: string
}
export default async function (opts:PinoClickhouseOptions) {
    const options = mergeDeepRight(defaultOptions, opts) as Required<PinoClickhouseOptions>
    const client = createClient(options.client)
    console.log("CLICKHOUSE CLIENT ", JSON.stringify(options.client))
    let query_id = 1

    /*
       if(options.createTable) {

       }
   */
    return build(async function (source) {
        for await (let obj of source) {

            const {time, msg, level,id, module,type,...payload} = obj
            try {
                const result = await client.insert<LogRow>({
                    table: options.table,
                    format:'JSONEachRow',
                    query_id: 'pino-'+(query_id++),
                    values: [
                        {
                            datetime: DateTime.fromJSDate(new Date(time)).toISO().replace('T'," ").slice(0, -6),
                            id,
                            module,
                            type,
                            message:msg,
                            level,
                            payload,
                        }
                    ]
                })

            } catch (e) {
                console.error('ClickhouseConnectionError ', opts.client)
            }
        }
    }, {
        async close (err) {
        }
    })
}
