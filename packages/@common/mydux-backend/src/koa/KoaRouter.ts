import Router from "@koa/router";
import KoaServer from "./KoaServer.ts";
import * as http from "node:http";

export type ExtractRouteParams<Route> = Route extends `${string} ${infer Path}`
  ? ExtractRouteParams<Path>
  : Route extends `${string}/:${infer Param}/${infer Rest}`
  ? {
      [Entry in Param | keyof ExtractRouteParams<`/${Rest}`>]: string;
    }
  : Route extends `${string}/:${infer Param}`
  ? {
      [Entry in Param]: string;
    }
  : undefined;

export class KoaRouter extends Router{
    constructor(options?:Router.RouterOptions) {super(options)}
    public toApp = () => {
        return new KoaServer()
            .use(this.routes())
            .use(this.allowedMethods())
    }
    public toServer = () => {
        return http.createServer(this.toApp().callback())
    }
}
