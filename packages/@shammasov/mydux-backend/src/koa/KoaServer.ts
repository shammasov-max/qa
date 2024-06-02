import Application from "koa";
import compose from "koa-compose";

export type KoaOptions = ConstructorParameters<typeof Application>[0];
export default  class KoaServer<
    StateT = Application.DefaultState,
    ContextT = Application.DefaultContext,
>  extends Application<StateT,ContextT> {
    constructor(options?: KoaOptions) {super(options)}
    use = <NewStateT = {}, NewContextT = {}>(
        middleware: Application.Middleware<StateT & NewStateT, ContextT & NewContextT> | KoaServer<StateT & NewStateT, ContextT & NewContextT> ,
    ): KoaServer<StateT & NewStateT, ContextT & NewContextT> =>{
        if('currentContext' in middleware) {
           return super.use(compose(middleware.middleware))
        } else
        return super.use<NewStateT,NewContextT>(middleware)
    }
}
