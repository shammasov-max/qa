import * as DaysUtils from "./date-utils";

export const Days = DaysUtils;
export const today = Days.today()
export function removeDeeplNested(data , predicate: (value: unknown) => boolean = (value) => value === undefined) {
    //transform properties into key-values pairs and filter all the empty-values
    const entries = Object.entries(data).filter(([, value]) => !predicate(value)) 
    // != null);

    //map through all the remaining properties and check if the value is an object.
    //if value is object, use recursion to remove empty properties
    const clean = entries.map(([key, v]) => {
        const value = typeof v == 'object' ? removeDeeplNested(v,predicate) : v;
        return [key, value];
    });

    //transform the key-value pairs back to an object.
    return Object.fromEntries(clean);
}
