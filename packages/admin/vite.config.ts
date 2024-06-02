import { defineConfig, splitVendorChunkPlugin, UserConfigExport } from "vite";
import react from "@vitejs/plugin-react";
import pluginAllowedHosts from "vite-plugin-allowed-hosts";
import mkcert from "vite-plugin-mkcert";
import { envConf } from "../iso/src/envConfig.ts";

const { resolve } = require("path");
//import createCert
//                 from 'create-cert'
// https://vitejs.dev/config/
export default async () => {
    const VITE_PORT =envConf.VITE_FRONT_PORT// process.env.GODJ_VITE_PORT || 9302
    const SERVICE_API =  'http://localhost:'+envConf.SERVER_PORT

    setTimeout(() => {
        console.log('PROXY TO API ' +SERVICE_API)
        console.log('QA Admin available '+ envConf.FRONTEND_HOST)
    }, 1000)
    const viteCopnfig = defineConfig({

            base: './',
            experimental:{},
            envPrefix: 'GODJ_',
            optimizeDeps: {},
            plugins: [
                pluginAllowedHosts({
                    hosts: ["all"]
                }),
                //  visualizer({brotliSize : true, gzipSize: true}) as PluginOption,
                // viteCompression({algorithm:'brotliCompress',verbose:true}),
                //reactSWC(),//
                mkcert({}),
                react(),//
                /*   viteExternalsPlugin({
                       ramda: 'R',
                       luxon: 'luxon'

                   }),*/
                //   appConfigVite({ readGlobal: true, injectValidationFunction: true,loadingOptions:{} }),
                splitVendorChunkPlugin(),

            ],

            root: __dirname,

            publicDir: '../styles/build',

            define: {
                /* 'process.env.GODJ_LOG_ROCKET': `'${GODJ_LOG_ROCKET}'`,
             'process.git': {
                   VERSION: JSON.stringify(gitRevisionPlugin.GE),
                   COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
                   BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
                   LASTCOMMITDATETIME: JSON.stringify(gitRevisionPlugin.lastcommitdatetime()),*/
            },//

            server: {
                headers:{
                    'x-responser':'Vite-Dev_Server'
                },

                /*  https: false,*/
                cors:{allowedHeaders: '*',exposedHeaders:"*", methods:"",origin:"*"},
                http2:{},
                watch: './src',
                https: {allowHalfOpen:true,insecureHTTPParser:true},
                host: '0.0.0.0',
                port: VITE_PORT,
                appType:'mpa',
                proxy: {
                    '/api': {
                        target: SERVICE_API,
                        rewrite: (path: string) => {
                            const res = SERVICE_API+path
                            console.log(`reqrite path ${path} to  ${res}  `)
                            return res
                        }},
                    '/uploads':  {
                        target: SERVICE_API,
                        rewrite: (path: string) => {
                            const res = SERVICE_API+path
                            console.log(`reqrite path ${path} to  ${res}  `)
                            return res
                        }},
                }
            }
        } as UserConfigExport
    );
    return viteCopnfig;
}
