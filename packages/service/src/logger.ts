import pino from "pino";
import PinoHttp from "pino-http";
import { createClient } from "@clickhouse/client";

export const loggerTransport = {
  targets: [
    {
      target: "@mgcrea/pino-pretty-compact",
      level: "info",
      options: { translateTime: "HH:MM:ss Z", ignore: "pid,hostname" },
    },
    /*   {   level:'debug',
            target: "@common/pino-clickhouse-transport",
            options: {
                client: {
                    username:'default',
                    password: 'dv34cCmSyL',//'dv34cCmSyL'
                }
            }
        }*/
  ],
  options: {},
};
export const logger = pino({
    level: "debug",
    formatters:{

        bindings: (bindings) => {
            return { app:'dra'};
        },
    },
    transport:  loggerTransport
})
export const getLastId = async () => {

    const client = createClient({clickhouse_settings:{

        },
        username:'default',
        password: 'dv34cCmSyL'
    })
    const result = await client.query({query: `SELECT max(id) as id FROM log`})
    const lastTraceIdResult = await result.json<{ id: number }>()
    reqId = lastTraceIdResult.data[0].id + 1
}
getLastId().catch(console.warn)
let reqId = 1
export const nextLogId = () => {
    return  reqId++
}
export const httpLogger = PinoHttp({
    // Reuse an existing logger instance
    logger: logger,
    base:undefined ,
    serializers: {
        req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url
        }),
        res: (res) => ({
            code: res.statusCode,
            url: res.raw.url
        })
    }})/*


    genReqId: (req, res) => nextLogId(),
    // Define custom serializers
    serializers: {
        err: pino.stdSerializers.err,
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res
    },

    // Set to `false` to prevent standard serializers from being wrapped.
    wrapSerializers: true,

    // Define a custom logger level
    /!* customLogLevel: function (req, res, err) {
         if (res.statusCode >= 400 && res.statusCode < 500) {
             return 'warn'
         } else if (res.statusCode >= 500 || err) {
             return 'error'
         } else if (res.statusCode >= 300 && res.statusCode < 400) {
             return 'silent'
         }
         return 'info'
     },*!/

    // Define a custom success message
    customSuccessMessage: function (req, res) {
        if (res.statusCode === 404) {
            return 'resource not found'
        }
        return `${req.method} completed`
    },

    // Define a custom receive message
    customReceivedMessage: function (req, res) {
        return 'request received: ' + req.method
    },
   // quietReqLogger:false,
    // Define a custom error message
    customErrorMessage: function (req, res, err) {
        return 'request errored with status code: ' + res.statusCode
    },
    customProps:  (req, res) => {
        return {

        }
    },

    // Override attribute keys for the log object
    customAttributeKeys: {

        reqId:'id',
        req: 'request',
        res: 'response',
        err: 'error',
        responseTime: 'timeTaken'
    },

    // Define additional custom request properties
    // customProps: function (req, res) {
    //     return {
    //         customProp: req.customProp,
    // user request-scoped data is in res.locals for express applications
    //         customProp2: res.locals.myCustomData
    //     }
    // }
})
*/
