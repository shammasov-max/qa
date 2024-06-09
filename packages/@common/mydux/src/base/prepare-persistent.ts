export const preparePersistent = <A>() => (payload: A) =>
    ({
        payload,
        meta: {persistent: true},
    })