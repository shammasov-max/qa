export default <F extends Function>(f: F, interrup: boolean = true): F => (
    (...as) => {
        if (interrup)
            /* tslint:disable */
            
        return f(...as)
    }
) as any as F
